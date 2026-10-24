import {isPlatformOwner} from './profiles-api.mjs';
import {membership,billingTransaction,billingSettings,billingReady,reconcileCustomer,stripeClient} from './billing-api.mjs';
import {platformFeatures,controlledFeatures} from './platform-controls.mjs';
import {lessonList} from './course.mjs';
import {premiumCourseSummary} from './premium-courses.mjs';
export async function migrateOwner(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS platform_controls(key text PRIMARY KEY,enabled boolean NOT NULL,revision integer NOT NULL DEFAULT 1,reason text NOT NULL,updated_by uuid REFERENCES users(id),updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS owner_events(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),actor_id uuid NOT NULL REFERENCES users(id),kind text NOT NULL,target text,detail jsonb NOT NULL DEFAULT '{}',created_at timestamptz NOT NULL DEFAULT now());
 CREATE INDEX IF NOT EXISTS owner_events_time ON owner_events(created_at DESC);
 `)}
export const ownerAudit=(c,user,kind,target,detail={})=>c.query('INSERT INTO owner_events(actor_id,kind,target,detail) VALUES($1,$2,$3,$4::jsonb)',[user.id,kind,target,JSON.stringify(detail)]);
export async function enforcePlatformControls({route,req,pool,currentUser,json,fail}){
 const keys=controlledFeatures(route,req.method);if(!keys.length)return;
 const rows=(await pool.query('SELECT key FROM platform_controls WHERE key=ANY($1::text[]) AND NOT enabled',[keys])).rows;if(!rows.length)return;
 const user=await currentUser(req);if(isPlatformOwner(user))return;
 let blocked=rows.filter(r=>!(r.key==='teacherApplications'&&user?.role==='learner'));
 if(blocked.some(r=>r.key==='focusedPractice')&&route==='/api/skills'&&req.method==='POST'){const d=await json(req);if(typeof d.task==='string'&&!d.task.startsWith('focus-'))blocked=blocked.filter(r=>r.key!=='focusedPractice');}
 if(!blocked.length)return;
 fail(503,'This service is temporarily paused by the administrator. Your saved records are unchanged.');
}
const accessSQL=`WITH access AS (
 SELECT u.id,u.name,u.email,u.role,u.created_at AS "createdAt",m.status AS "billingStatus",m.paid_until AS "paidUntil",m.cancel_at_period_end AS "cancelAtPeriodEnd",m.price_id AS "priceId",
 EXISTS(SELECT 1 FROM billing_blocks b WHERE b.user_id=u.id AND b.blocked) AS blocked,
 EXISTS(SELECT 1 FROM premium_invitations i WHERE i.redeemed_by=u.id AND i.active AND (i.access_until IS NULL OR i.access_until>now())) AS invited,
 EXISTS(SELECT 1 FROM premium_trials t WHERE t.user_id=u.id AND t.ends_at>now()) AS trial,
 COALESCE(m.status='active' AND m.paid_until>now(),false) AS subscribed
 FROM users u LEFT JOIN billing_memberships m ON m.user_id=u.id
), plans AS (SELECT *,CASE WHEN NOT blocked AND (subscribed OR invited OR trial) THEN 'premium' ELSE 'free' END AS tier FROM access)`;
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
function params(req,fail){const p=new URL(req.url,'http://localhost').searchParams,offset=Number(p.get('offset')||0),q=(p.get('q')||'').trim(),role=p.get('role')||null,plan=p.get('plan')||null;if(!Number.isInteger(offset)||offset<0||offset>1000000||q.length>120||role&&!['learner','teacher'].includes(role)||plan&&!['free','premium'].includes(plan))fail(400,'Choose valid account filters');return {offset,q,role,plan};}
const interval=price=>price&&price===process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID?'month':price&&price===process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID?'year':price?'other':null;
export async function handleOwner({route,req,res,pool,required,currentUser,json,send,fail,limited}){
 if(route==='/api/platform'&&req.method==='GET'){const rows=(await pool.query('SELECT key,enabled FROM platform_controls')).rows;send(res,200,{features:Object.fromEntries(platformFeatures.map(f=>[f.key,rows.find(r=>r.key===f.key)?.enabled??true]))});return true;}
 if(!route.startsWith('/api/owner'))return false;
 const user=await required(req);if(!isPlatformOwner(user))fail(403,'Platform owner only');
 if(route==='/api/owner/overview'&&req.method==='GET'){
  const [accounts,teachers,classes,contacts,audit]=await Promise.all([
   pool.query(accessSQL+" SELECT role,tier,count(*)::int AS count FROM plans GROUP BY role,tier"),
   pool.query("SELECT status,count(*)::int AS count FROM teacher_profiles GROUP BY status"),
   pool.query('SELECT status,count(*)::int AS count FROM class_bookings GROUP BY status'),
   pool.query('SELECT status,count(*)::int AS count FROM support_tickets GROUP BY status'),
   pool.query('SELECT e.id,e.kind,e.target,e.detail,e.created_at AS at,u.name AS actor FROM owner_events e JOIN users u ON u.id=e.actor_id ORDER BY e.created_at DESC,e.id DESC LIMIT 30')
  ]);send(res,200,{accounts:accounts.rows,teachers:teachers.rows,classes:classes.rows,contacts:contacts.rows,audit:audit.rows,billing:{checkoutReady:billingReady(),stripeConfigured:!!process.env.STRIPE_SECRET_KEY},content:{lessons:lessonList.length,exclusiveCourses:premiumCourseSummary.length}});return true;
 }
 if(route==='/api/owner/users'&&req.method==='GET'){
  const {offset,q,role,plan}=params(req,fail),r=await pool.query(accessSQL+` SELECT *,count(*) OVER()::int AS total FROM plans WHERE ($1::text IS NULL OR role=$1) AND ($2::text IS NULL OR tier=$2) AND (name ILIKE $3 OR email ILIKE $3) ORDER BY "createdAt" DESC,id LIMIT 50 OFFSET $4`,[role,plan,'%'+q+'%',offset]);
  send(res,200,{users:r.rows.map(({priceId,subscribed,invited,trial,blocked,total,...u})=>({...u,billingStatus:blocked?'payment_review':u.billingStatus||'free',source:blocked?'free':subscribed?'subscription':invited?'invitation':trial?'trial':'free',interval:interval(priceId),owner:u.id===user.id})),total:r.rows[0]?.total||0,offset,limit:50});return true;
 }
 const account=route.match(/^\/api\/owner\/users\/([a-f0-9-]+)(?:\/(sync))?$/);
 if(account){if(!uuid.test(account[1]))fail(404,'Account not found');const target=(await pool.query('SELECT id,name,email,role,created_at AS "createdAt" FROM users WHERE id=$1',[account[1]])).rows[0];if(!target)fail(404,'Account not found');
  if(account[2]==='sync'&&req.method==='POST'){
   limited(req,'owner-membership-sync',30);if(!process.env.STRIPE_SECRET_KEY||!billingSettings().prices.length)fail(503,'Stripe synchronization is not configured.');
   try{await billingTransaction(pool,async c=>{const m=(await c.query('SELECT customer_id,price_id FROM billing_memberships WHERE user_id=$1 FOR UPDATE',[target.id])).rows[0];if(!m?.customer_id)fail(400,'This account has no Stripe customer record.');if(m.price_id&&!billingSettings().prices.includes(m.price_id))fail(409,'The current price is not in the configured plan list. Check billing configuration before refreshing.');await reconcileCustomer(c,m.customer_id,stripeClient());await ownerAudit(c,user,'subscription_synced',target.id);});}catch(e){if(e.status)throw e;fail(503,'Subscription synchronization is unavailable. Existing records were preserved.');}
  }else if(req.method!=='GET'||account[2])fail(405,'Use GET to view this account');
  const [plan,invoices,tickets,profile]=await Promise.all([membership(pool,target.id,{actual:true}),pool.query('SELECT id,amount_paid AS amount,currency,created_at AS at FROM billing_invoices WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20',[target.id]),pool.query('SELECT state,count(*)::int AS count FROM premium_class_tickets WHERE user_id=$1 GROUP BY state',[target.id]),pool.query('SELECT price_id,updated_at AS "updatedAt",customer_id IS NOT NULL AS "hasCustomer" FROM billing_memberships WHERE user_id=$1',[target.id])]);
  const record=profile.rows[0];send(res,200,{user:target,membership:plan,interval:interval(record?.price_id),updatedAt:record?.updatedAt||null,invoices:invoices.rows,tickets:tickets.rows,canSync:!!(process.env.STRIPE_SECRET_KEY&&billingSettings().prices.length&&record?.hasCustomer)});return true;
 }
 if(route==='/api/owner/settings'&&req.method==='GET'){const r=await pool.query('SELECT key,enabled,revision,reason,updated_at AS "updatedAt" FROM platform_controls');send(res,200,{features:platformFeatures.map(f=>({...f,enabled:true,revision:0,reason:'',...r.rows.find(r=>r.key===f.key)}))});return true;}
 if(route==='/api/owner/settings'&&req.method==='PUT'){
  const d=await json(req);if(!platformFeatures.some(f=>f.key===d.key)||typeof d.enabled!=='boolean'||!Number.isInteger(d.revision)||d.revision<0||typeof d.reason!=='string'||d.reason.trim().length<3||d.reason.length>500)fail(400,'Choose a service, current revision and reason');
  await billingTransaction(pool,async c=>{let r;if(d.revision===0)r=await c.query('INSERT INTO platform_controls(key,enabled,reason,updated_by) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING revision',[d.key,d.enabled,d.reason.trim(),user.id]);else r=await c.query('UPDATE platform_controls SET enabled=$2,reason=$3,updated_by=$4,revision=revision+1,updated_at=now() WHERE key=$1 AND revision=$5 RETURNING revision',[d.key,d.enabled,d.reason.trim(),user.id,d.revision]);if(!r.rows.length)fail(409,'This service setting changed. Refresh before saving.');await ownerAudit(c,user,d.enabled?'service_enabled':'service_paused',d.key,{reason:d.reason.trim()});});send(res,200,{ok:true});return true;
 }
 if(route==='/api/owner/catalog'&&req.method==='GET'){
  const {q,offset}=params(req,fail),p=new URL(req.url,'http://localhost').searchParams,language=p.get('language')||'',type=p.get('type')||'';
  if(language&&!['en','es','pt','ja'].includes(language)||type&&!['selfStudy','exclusive'].includes(type))fail(400,'Choose a supported catalog filter');
  const rows=[...lessonList.map(l=>({id:l.id,title:l.title,language:l.language||'es',level:l.level,skill:l.skill,type:'selfStudy',questions:l.questions.length})),...premiumCourseSummary.map(c=>({...c,type:'exclusive',skill:c.scene||'Practice'}))].filter(l=>(!language||l.language===language)&&(!type||l.type===type)&&[l.id,l.title].some(v=>v.toLowerCase().includes(q.toLowerCase())));send(res,200,{items:rows.slice(offset,offset+50),total:rows.length,offset});return true;
 }
 if(route==='/api/owner/audit'&&req.method==='GET'){const {offset}=params(req,fail),r=await pool.query('SELECT e.id,e.kind,e.target,e.detail,e.created_at AS at,u.name AS actor FROM owner_events e JOIN users u ON u.id=e.actor_id ORDER BY e.created_at DESC,e.id DESC LIMIT 50 OFFSET $1',[offset]);send(res,200,{events:r.rows,offset,hasMore:r.rows.length===50});return true;}
 fail(404,'Owner endpoint not found');
}
