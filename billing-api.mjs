import {regionalAudioPairs} from './regional-audio-pairs.mjs';
import {withVerifiedAnswers} from './verified-answers.mjs';
import {migrateTrial,trialStatus,checkedTrialPrice,renewalTermsVersion} from './premium-trial.mjs';
import {premiumGalleryFrames} from './premium-session.mjs';
import {premiumVideoSources} from './premium-video-lessons.mjs';
import {serveStudioSpeech} from './speech-api.mjs';
import {migratePremiumAccess,premiumAccess,handlePremiumAccess} from './premium-access.mjs';
import Stripe from 'stripe';
import crypto from 'node:crypto';
import {isPlatformOwner} from './profiles-api.mjs';
import {premiumCourses,premiumCourseSummary,premiumCourseById,archivedPremiumCourseSummary,validCourseAnswer,gradeCourseAnswer,courseAnswerText} from './premium-courses.mjs';
const id=x=>typeof x==='string'?x:x?.id;
const uuid=/^[a-f0-9-]{36}$/;
const err=(status,message)=>{throw Object.assign(Error(message),{status})};
export const billingSettings=(env=process.env)=>({prices:[env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,env.STRIPE_PREMIUM_YEARLY_PRICE_ID,...(env.STRIPE_PREMIUM_LEGACY_PRICE_IDS||'').split(',').map(x=>x.trim())].filter(Boolean),base:env.BILLING_PUBLIC_URL||'',enabled:env.BILLING_ENABLED==='true',maxMinutes:Math.min(60,Math.max(15,Number(env.PREMIUM_TICKET_MAX_MINUTES)||60))});
export function billingReady(env=process.env){const s=billingSettings(env);return !!(s.enabled&&env.STRIPE_SECRET_KEY&&env.STRIPE_WEBHOOK_SECRET&&(env.STRIPE_PREMIUM_MONTHLY_PRICE_ID||env.STRIPE_PREMIUM_YEARLY_PRICE_ID)&&/^https:\/\/[^/]+\/?$/.test(s.base));}
export const stripeClient=()=>new Stripe(process.env.STRIPE_SECRET_KEY,{timeout:12000,maxNetworkRetries:1,httpClient:Stripe.createFetchHttpClient()});
export async function billingTransaction(pool,fn){const c=await pool.connect();try{await c.query('BEGIN');const v=await fn(c);await c.query('COMMIT');return v}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
export async function migrateBilling(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS billing_memberships(user_id uuid PRIMARY KEY REFERENCES users(id),customer_id text UNIQUE,subscription_id text,status text NOT NULL DEFAULT 'free',paid_until timestamptz,price_id text,cancel_at_period_end boolean NOT NULL DEFAULT false,updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS billing_checkout_requests(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id),price_id text NOT NULL,interval text NOT NULL,session_id text,active boolean NOT NULL DEFAULT true,created_at timestamptz NOT NULL DEFAULT now());
 CREATE UNIQUE INDEX IF NOT EXISTS billing_one_checkout ON billing_checkout_requests(user_id) WHERE active;
 CREATE TABLE IF NOT EXISTS billing_events(id text PRIMARY KEY,type text NOT NULL,customer_id text,processed_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS billing_invoices(id text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id),subscription_id text NOT NULL,amount_paid bigint NOT NULL,currency text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS billing_blocks(charge_id text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id),blocked boolean NOT NULL,reason text NOT NULL,updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS premium_ticket_grants(user_id uuid PRIMARY KEY REFERENCES users(id),invoice_id text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS premium_class_teachers(teacher_id uuid PRIMARY KEY REFERENCES users(id),enabled boolean NOT NULL DEFAULT false,updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS premium_class_tickets(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id),number integer NOT NULL CHECK(number BETWEEN 1 AND 3),state text NOT NULL DEFAULT 'available' CHECK(state IN ('available','reserved','used','revoked')),booking_id uuid UNIQUE REFERENCES class_bookings(id),created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,number));
 ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS premium_ticket_id uuid REFERENCES premium_class_tickets(id);
 CREATE TABLE IF NOT EXISTS premium_course_attempts(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id),course_id text NOT NULL,correct integer NOT NULL,total integer NOT NULL,client_key text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,client_key));
 CREATE TABLE IF NOT EXISTS billing_ad_campaign(id integer PRIMARY KEY CHECK(id=1),title text NOT NULL,body text NOT NULL,url text NOT NULL,enabled boolean NOT NULL DEFAULT false);
 `);await migratePremiumAccess(pool);await migrateTrial(pool)}
export async function membership(c,userId,{actual=false}={}){
 const r=(await c.query(`SELECT m.*,EXISTS(SELECT 1 FROM billing_blocks b WHERE b.user_id=$1 AND b.blocked) AS blocked FROM users u LEFT JOIN billing_memberships m ON m.user_id=u.id WHERE u.id=$1`,[userId])).rows[0];
 const trial=await trialStatus(c,userId);const access=await premiumAccess(c,userId),billingPremium=!!(r&&!r.blocked&&r.status==='active'&&Date.parse(r.paid_until)>Date.now()),tester=!!access.testerActive&&!r?.blocked;
 if(actual)access.previewMode=null;
 const premium=access.previewMode?access.previewMode==='premium':billingPremium||tester||trial.trialActive&&!r?.blocked;
 return {...trial,trialEligible:!premium&&!trial.trialUsed&&!r?.blocked,tier:premium?'premium':'free',premium,adFree:premium,allFunctions:premium,exclusiveCourses:premium,status:r?.blocked?'payment_review':r?.status||'free',paidUntil:r?.paid_until||null,cancelAtPeriodEnd:r?.cancel_at_period_end||false,customer:!!r?.customer_id,billingPremium,previewMode:access.previewMode,testerUntil:access.testerUntil,testerPermanent:access.testerPermanent,source:access.previewMode?'owner_preview':billingPremium?'subscription':tester?'invitation':trial.trialActive&&!r?.blocked?'trial':'free'};
}
export async function syncClassTickets(c,userId){
 // Move a reservation only after the replacement is actually confirmed.
 const replacements=(await c.query(`SELECT t.id,n.id AS new_id,b.id AS old_id,n.starts_at,n.ends_at FROM premium_class_tickets t JOIN class_bookings b ON b.id=t.booking_id JOIN class_bookings n ON n.replaces_id=b.id AND n.status='confirmed' WHERE t.user_id=$1 AND t.state='reserved' AND b.status='cancelled' FOR UPDATE OF t`,[userId])).rows;
 for(const r of replacements){if((Date.parse(r.ends_at)-Date.parse(r.starts_at))/60000>billingSettings().maxMinutes)err(400,'This class is longer than the ticket limit.');await c.query('UPDATE class_bookings SET premium_ticket_id=NULL WHERE id=$1',[r.old_id]);await c.query('UPDATE class_bookings SET premium_ticket_id=$2 WHERE id=$1',[r.new_id,r.id]);await c.query('UPDATE premium_class_tickets SET booking_id=$2 WHERE id=$1',[r.id,r.new_id]);}
 await c.query(`UPDATE premium_class_tickets t SET state='used' FROM class_bookings b WHERE t.user_id=$1 AND t.booking_id=b.id AND t.state='reserved' AND b.status='completed'`,[userId]);
 await c.query(`UPDATE premium_class_tickets t SET state='available',booking_id=NULL FROM class_bookings b WHERE t.user_id=$1 AND t.booking_id=b.id AND t.state='reserved' AND b.status IN ('cancelled','declined')`,[userId]);
}
export async function reservePremiumTicket(c,userId,booking,requested){
 await syncClassTickets(c,userId);
 const existing=(await c.query('SELECT id FROM premium_class_tickets WHERE booking_id=$1 AND state IN (\'reserved\',\'used\')',[booking.id])).rows[0];if(existing){booking.premium_ticket_id=existing.id;return;}if(!requested)return;
 if(!(await membership(c,userId)).premium)err(403,'An active Premium membership is required to use a class ticket.');
 const teacher=(await c.query("SELECT 1 FROM premium_class_teachers p JOIN teacher_profiles t ON t.user_id=p.teacher_id WHERE p.teacher_id=$1 AND p.enabled AND t.status='approved'",[booking.teacher_id])).rows[0];if(!teacher)err(409,'This teacher is not participating in Premium ticket classes.');
 if((Date.parse(booking.ends_at)-Date.parse(booking.starts_at))/60000>billingSettings().maxMinutes)err(400,'This class is longer than the ticket limit.');
 const ticket=(await c.query("SELECT id FROM premium_class_tickets WHERE user_id=$1 AND state='available' ORDER BY number LIMIT 1 FOR UPDATE",[userId])).rows[0];if(!ticket)err(409,'No class tickets are available.');
 await c.query("UPDATE premium_class_tickets SET state='reserved',booking_id=$2 WHERE id=$1",[ticket.id,booking.id]);await c.query('UPDATE class_bookings SET premium_ticket_id=$2 WHERE id=$1',[booking.id,ticket.id]);booking.premium_ticket_id=ticket.id;
}
async function revokeTickets(c,userId){
 // Completed teaching is kept; unused and future reserved benefits are revoked.
 const reserved=(await c.query("SELECT booking_id FROM premium_class_tickets WHERE user_id=$1 AND state='reserved' AND booking_id IS NOT NULL",[userId])).rows;
 for(const r of reserved){await c.query("UPDATE class_bookings SET status='cancelled',change_reason='Premium ticket payment was refunded or is under payment review.',revision=revision+1,updated_at=now() WHERE id=$1 AND status='confirmed' AND starts_at>now()",[r.booking_id]);}
 await c.query("UPDATE premium_class_tickets SET state='revoked' WHERE user_id=$1 AND (state='available' OR (state='reserved' AND booking_id IN (SELECT id FROM class_bookings WHERE status='cancelled')))",[userId]);
}
export async function reconcileCustomer(c,customer,stripe){
 const owner=(await c.query('SELECT user_id FROM billing_memberships WHERE customer_id=$1',[customer])).rows[0];if(!owner)return null;await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[owner.user_id]);
 const m=(await c.query('SELECT * FROM billing_memberships WHERE customer_id=$1 FOR UPDATE',[customer])).rows[0];if(!m)return null;
 const subs=await stripe.subscriptions.list({customer,status:'all',limit:100,expand:['data.latest_invoice']});if(subs.has_more)err(503,'Subscription history requires payment support review.');const allowed=new Set(billingSettings().prices);
 const choices=subs.data.filter(s=>s.items?.data?.some(i=>allowed.has(id(i.price))));
 choices.sort((a,b)=>Number(b.status==='active')-Number(a.status==='active')||b.created-a.created);
 let eligible=null,trial=null,latest=choices[0];
 for(const s of choices){let invoice=s.latest_invoice;if(typeof invoice==='string')invoice=await stripe.invoices.retrieve(invoice);
  if(invoice?.status==='paid'){await c.query('INSERT INTO billing_invoices(id,user_id,subscription_id,amount_paid,currency) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING',[invoice.id,m.user_id,s.id,invoice.amount_paid||0,invoice.currency||'']);}
  const item=s.items.data.find(i=>allowed.has(id(i.price))),end=item?.current_period_end||s.current_period_end;
  if(s.status==='trialing'&&!s.pause_collection&&s.metadata?.continuum_trial===renewalTermsVersion&&Number(s.trial_end)*1000>Date.now()&&s.trial_end-s.trial_start<=259200&&s.trial_end>s.trial_start){const consent=(await c.query('SELECT id FROM billing_checkout_requests WHERE id::text=$1 AND user_id=$2 AND trial AND consent_at IS NOT NULL AND terms_version=$3',[s.metadata.checkout_request||'',m.user_id,renewalTermsVersion])).rows[0];if(consent)trial={s,item,end:s.trial_end};}
  if(s.status==='active'&&!s.pause_collection&&invoice?.status==='paid'&&Number(end)*1000>Date.now()){
   eligible={s,invoice,item,end};break;
  }
 }
 const e=eligible,s=e?.s||trial?.s||latest;if(trial&&!e)await c.query("INSERT INTO premium_trials(user_id,started_at,ends_at,kind,subscription_id) VALUES($1,$2,$3,'subscription',$4) ON CONFLICT(user_id) DO NOTHING",[m.user_id,new Date(trial.s.trial_start*1000),new Date(trial.end*1000),trial.s.id]);
 await c.query("UPDATE billing_memberships SET subscription_id=$2,status=$3,paid_until=$4,price_id=$5,cancel_at_period_end=$6,updated_at=now() WHERE user_id=$1",[m.user_id,s?.id||null,e?'active':trial?'trialing':s?.status||'free',e?new Date(e.end*1000):trial?new Date(trial.end*1000):null,e?id(e.item.price):trial?id(trial.item.price):null,s?.cancel_at_period_end===true]);
 const blocked=(await c.query('SELECT 1 FROM billing_blocks WHERE user_id=$1 AND blocked LIMIT 1',[m.user_id])).rows.length;
 if(e&&!blocked&&e.invoice.amount_paid>0){const g=await c.query('INSERT INTO premium_ticket_grants(user_id,invoice_id) VALUES($1,$2) ON CONFLICT(user_id) DO NOTHING RETURNING user_id',[m.user_id,e.invoice.id]);if(g.rows.length)await c.query('INSERT INTO premium_class_tickets(user_id,number) SELECT $1,n FROM generate_series(1,1) n ON CONFLICT DO NOTHING',[m.user_id]);}
 if(blocked)await revokeTickets(c,m.user_id);return m.user_id;
}
const eventTypes=new Set(['checkout.session.completed','checkout.session.async_payment_succeeded','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','customer.subscription.trial_will_end','invoice.paid','invoice.payment_failed','charge.refunded','charge.dispute.created','charge.dispute.closed']);
async function chargeBlock(c,obj,type,stripe){
 let charge,blocked,reason;
 if(type.startsWith('charge.dispute.')){const dispute=await stripe.disputes.retrieve(obj.id);charge=await stripe.charges.retrieve(id(dispute.charge));blocked=!['won','warning_closed'].includes(dispute.status);reason='dispute';}
 else{charge=await stripe.charges.retrieve(obj.id);blocked=charge.refunded===true;reason='refund';if(!blocked)return id(charge.customer);}
 await reconcileCustomer(c,id(charge.customer),stripe);
 let invoices=charge.invoice?[id(charge.invoice)]:[];
 if(charge.payment_intent){const payments=await stripe.invoicePayments.list({payment:{type:'payment_intent',payment_intent:id(charge.payment_intent)},limit:100});invoices.push(...payments.data.map(p=>id(p.invoice)));}
 if(!invoices.length)return null;
 const owned=(await c.query('SELECT i.user_id,m.customer_id FROM billing_invoices i JOIN billing_memberships m ON m.user_id=i.user_id WHERE i.id=ANY($1::text[]) AND m.customer_id=$2 LIMIT 1',[invoices,id(charge.customer)])).rows[0];if(!owned)return null;
 const actual=charge.refunded===true||blocked;await c.query('INSERT INTO billing_blocks(charge_id,user_id,blocked,reason) VALUES($1,$2,$3,$4) ON CONFLICT(charge_id) DO UPDATE SET blocked=EXCLUDED.blocked,reason=EXCLUDED.reason,updated_at=now()',[charge.id,owned.user_id,actual,reason]);return owned.customer_id;
}
export async function handleBillingWebhook({route,req,res,pool,send,fail,stripe}){
 if(route!=='/api/billing/webhook')return false;if(req.method!=='POST')fail(405,'Use POST');
 if(!process.env.STRIPE_WEBHOOK_SECRET||!process.env.STRIPE_SECRET_KEY)fail(503,'Billing is not configured.');
 const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1000000)fail(413,'Webhook too large');chunks.push(chunk)}
 stripe||=stripeClient();let event;try{event=stripe.webhooks.constructEvent(Buffer.concat(chunks),req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET)}catch{fail(400,'Invalid webhook signature.');}
 if(event.livemode!==process.env.STRIPE_SECRET_KEY.startsWith('sk_live_'))fail(400,'Webhook mode mismatch.');
 if(!eventTypes.has(event.type)){send(res,200,{received:true});return true;}
 try{await billingTransaction(pool,async c=>{
  await c.query("SELECT pg_advisory_xact_lock(hashtext('billing:' || $1::text))",[event.id]);if((await c.query('SELECT 1 FROM billing_events WHERE id=$1',[event.id])).rows.length)return;
  const obj=event.data.object;let customer=id(obj.customer);
  if(event.type.startsWith('charge.'))customer=await chargeBlock(c,obj,event.type,stripe);
  if(customer)await reconcileCustomer(c,customer,stripe);
  await c.query('INSERT INTO billing_events(id,type,customer_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[event.id,event.type,customer||null]);
 });}catch(e){console.warn('Billing webhook retry required',JSON.stringify({type:event.type,code:/^[A-Za-z0-9_]{1,60}$/.test(e.code||'')?e.code:'processing_failed'}));fail(503,'Webhook processing failed; retry required.');}
 send(res,200,{received:true});return true;
}
async function status(c,user){await syncClassTickets(c,user.id);const m=await membership(c,user.id),tickets=(await c.query('SELECT id,number,state,booking_id AS "bookingId" FROM premium_class_tickets WHERE user_id=$1 ORDER BY number',[user.id])).rows;let ad=null;if(!m.adFree)ad=(await c.query('SELECT title,body,url FROM billing_ad_campaign WHERE id=1 AND enabled')).rows[0]||null;return {membership:m,tickets,ad,checkoutAvailable:billingReady()&&!m.previewMode,portalAvailable:!!(process.env.STRIPE_SECRET_KEY&&/^https:\/\/[^/]+\/?$/.test(billingSettings().base)),eligibleTeachers:(await c.query("SELECT p.teacher_id FROM premium_class_teachers p JOIN teacher_profiles t ON t.user_id=p.teacher_id WHERE p.enabled AND t.status='approved'")).rows.map(r=>r.teacher_id),maxClassMinutes:billingSettings().maxMinutes,initialTickets:1,owner:isPlatformOwner(user),archivedCourses:archivedPremiumCourseSummary,courses:premiumCourseSummary,videoSources:premiumVideoSources,progress:(await c.query('SELECT course_id AS id,max(correct) AS best,max(total) AS total FROM premium_course_attempts WHERE user_id=$1 GROUP BY course_id',[user.id])).rows,intervals:[...(process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID?['month']:[]),...(process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID?['year']:[])]};}
async function handleBillingCore({route,req,res,pool,required,json,send,fail,limited,stripe}){
 if(!route.startsWith('/api/billing'))return false;const user=await required(req);
 if(await handlePremiumAccess({route,req,res,pool,user,json,send,fail,limited,transaction:billingTransaction}))return true;
 if(route==='/api/billing/trial'&&req.method==='POST'){
  if(user.role!=='learner')fail(403,'Learner membership only');limited(req,'premium-trial',12);const d=await json(req);if(d.consent!==true||Object.keys(d).some(k=>k!=='consent'))fail(400,'Confirm the free 72-hour digital Premium trial.');
  const m=await membership(pool,user.id,{actual:true});if(!m.trialUsed)fail(409,'New trials require payment details and renewal agreement in Stripe Checkout.');send(res,200,await status(pool,user));return true;
 }
 if(route==='/api/billing'&&req.method==='GET'){send(res,200,await status(pool,user));return true;}
 if(route==='/api/billing/admin'&&req.method==='GET'){
  if(!isPlatformOwner(user))fail(403,'Platform owner only');const members=(await pool.query('SELECT u.id,u.name,m.status,m.paid_until AS "paidUntil",m.cancel_at_period_end AS "cancelAtPeriodEnd",EXISTS(SELECT 1 FROM billing_blocks b WHERE b.user_id=u.id AND b.blocked) AS "paymentReview" FROM users u JOIN billing_memberships m ON m.user_id=u.id ORDER BY m.updated_at DESC LIMIT 100')).rows;
  const teachers=(await pool.query("SELECT u.id,u.name,COALESCE(p.enabled,false) AS enabled FROM users u JOIN teacher_profiles t ON t.user_id=u.id AND t.status='approved' LEFT JOIN premium_class_teachers p ON p.teacher_id=u.id ORDER BY u.name")).rows;
  send(res,200,{ready:billingReady(),settings:{keyConfigured:!!process.env.STRIPE_SECRET_KEY,webhookConfigured:!!process.env.STRIPE_WEBHOOK_SECRET,pricesConfigured:billingSettings().prices.length,publicUrlConfigured:!!billingSettings().base,enabled:billingSettings().enabled},members,teachers,events:(await pool.query('SELECT id,type,processed_at AS at FROM billing_events ORDER BY processed_at DESC LIMIT 30')).rows,ad:(await pool.query('SELECT title,body,url,enabled FROM billing_ad_campaign WHERE id=1')).rows[0]||null});return true;
 }
 if(route==='/api/billing/admin'&&req.method==='PUT'){
  if(!isPlatformOwner(user))fail(403,'Platform owner only');const d=await json(req);
  if(d.teacherId){if(!uuid.test(d.teacherId)||typeof d.enabled!=='boolean')fail(400,'Choose an approved teacher');const p=(await pool.query("SELECT 1 FROM teacher_profiles WHERE user_id=$1 AND status='approved'",[d.teacherId])).rows[0];if(!p)fail(400,'Choose an approved teacher');await pool.query('INSERT INTO premium_class_teachers(teacher_id,enabled) VALUES($1,$2) ON CONFLICT(teacher_id) DO UPDATE SET enabled=EXCLUDED.enabled,updated_at=now()',[d.teacherId,d.enabled]);}
  else{const a=d.ad;if(!a||typeof a.enabled!=='boolean'||typeof a.title!=='string'||a.title.length>100||typeof a.body!=='string'||a.body.length>300||typeof a.url!=='string'||!/^https:\/\//.test(a.url)||a.url.length>1500)fail(400,'Enter an HTTPS advertisement link and short text');await pool.query('INSERT INTO billing_ad_campaign(id,title,body,url,enabled) VALUES(1,$1,$2,$3,$4) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,body=EXCLUDED.body,url=EXCLUDED.url,enabled=EXCLUDED.enabled',[a.title,a.body,a.url,a.enabled]);}
  send(res,200,{ok:true});return true;
 }
 const course=route.match(/^\/api\/billing\/courses\/([a-z0-9-]+)(?:\/(answer|finish|audio))?$/);
 if(course){if(!(await membership(pool,user.id)).premium)fail(403,'Premium is required for this course.');let lesson=premiumCourseById(course[1]);if(!lesson)fail(404,'Course not found');if(req.method==='POST')lesson=await withVerifiedAnswers(pool,user.id,lesson);if(req.method==='GET'&&course[2]==='audio'){const params=new URL(req.url,'http://localhost').searchParams;
 if(params.has('comparison')){const index=params.get('comparison'),variant=params.get('variant');if(!/^\d+$/.test(index||'')||!['0','1'].includes(variant))fail(404,'Audio not found');const v=lesson.scene==='varieties'&&regionalAudioPairs[lesson.language]?.[Number(index)]?.variants[Number(variant)];if(!v?.locale)fail(404,'Use the native-speaker video for this regional pronunciation.');return serveStudioSpeech({req,res,pool,text:v.text,locale:v.locale,send,fail,limited,privateAudio:true,validateAudio:lesson.scene==='varieties'});}
 const gallery=params.has('gallery'),raw=params.get(gallery?'gallery':'question');
 if(raw===null||!/^\d+$/.test(raw))fail(404,'Audio not found');
 const index=Number(raw);if(!Number.isSafeInteger(index))fail(404,'Audio not found');
 if(gallery&&lesson.scene==='varieties'&&!premiumGalleryFrames(lesson)[index]?.audioLocale)fail(404,'Use the native-speaker references for regional examples.');
 const q=gallery?premiumGalleryFrames(lesson)[index]:lesson.questions[index],text=gallery?q?.text:q?.audio;
 if(!text)fail(404,'Audio not found');return serveStudioSpeech({req,res,pool,text,locale:q.audioLocale||({en:'en-US',pt:'pt-BR',es:'es-ES',ja:'ja-JP'})[lesson.language],send,fail,limited,privateAudio:true,validateAudio:lesson.scene==='varieties'});}if(req.method==='GET'&&!course[2]){send(res,200,{course:{...lesson,questions:lesson.questions.map(({answer,acceptedAnswers,note,...q})=>q)}});return true;}if(req.method==='POST'&&course[2]){const d=await json(req);if(course[2]==='finish'){if(!Array.isArray(d.answers)||d.answers.length!==lesson.questions.length||d.answers.some((n,i)=>!validCourseAnswer(lesson.questions[i],n))||!/^[a-zA-Z0-9-]{12,100}$/.test(d.key||''))fail(400,'Answer every course question');const correct=d.answers.filter((n,i)=>gradeCourseAnswer(lesson.questions[i],n)).length;const inserted=await pool.query('INSERT INTO premium_course_attempts(user_id,course_id,correct,total,client_key) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,client_key) DO NOTHING RETURNING course_id,correct,total',[user.id,lesson.id,correct,lesson.questions.length,d.key]);if(!inserted.rows.length){const old=(await pool.query('SELECT course_id,correct,total FROM premium_course_attempts WHERE user_id=$1 AND client_key=$2',[user.id,d.key])).rows[0];if(old.course_id!==lesson.id||old.correct!==correct||old.total!==lesson.questions.length)fail(409,'This course submission was already used with different content');}send(res,200,{correct,total:lesson.questions.length});return true;}if(!Number.isInteger(d.question)||!lesson.questions[d.question]||!validCourseAnswer(lesson.questions[d.question],d.answer))fail(400,'Choose an answer');const q=lesson.questions[d.question];send(res,200,{correct:gradeCourseAnswer(q,d.answer),answer:courseAnswerText(q),note:q.note});return true;}}
 if(route==='/api/billing/trial-offer'&&req.method==='GET'){if(user.role!=='learner')fail(403,'Learner membership only');if(!billingReady())fail(503,'Checkout is not open yet.');limited(req,'trial-offer-'+user.id,30);const interval=new URL(req.url,'http://localhost').searchParams.get('interval')||'month';if(!['month','year'].includes(interval))fail(400,'Choose a valid plan');const price=interval==='year'?process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID:process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;if(!price)fail(400,'This plan is not available');stripe||=stripeClient();send(res,200,{offer:checkedTrialPrice(await stripe.prices.retrieve(price),interval)});return true;}
 if(req.method!=='POST')fail(404,'Billing endpoint not found');if(user.role!=='learner')fail(403,'Learner membership only');limited(req,'billing',20);const d=await json(req);stripe||=process.env.STRIPE_SECRET_KEY?stripeClient():null;
 const base=billingSettings().base.replace(/\/$/,'');
 if(route==='/api/billing/cancel-trial'){if(d.confirm!==true)fail(400,'Confirm cancellation of trial renewal.');if(!stripe)fail(503,'Subscription management is temporarily unavailable.');await billingTransaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const m=(await c.query('SELECT * FROM billing_memberships WHERE user_id=$1 FOR UPDATE',[user.id])).rows[0];if(!m?.customer_id||!m.subscription_id)fail(404,'No trial subscription found');const sub=await stripe.subscriptions.retrieve(m.subscription_id);if(id(sub.customer)!==m.customer_id||sub.status!=='trialing')fail(409,'Use Manage subscription for this subscription.');await stripe.subscriptions.update(sub.id,{cancel_at_period_end:true});await reconcileCustomer(c,m.customer_id,stripe)});send(res,200,await status(pool,user));return true;}
 if(route==='/api/billing/portal'){if(!stripe||!/^https:\/\/[^/]+$/.test(base))fail(503,'Subscription management is temporarily unavailable.');const m=(await pool.query('SELECT customer_id FROM billing_memberships WHERE user_id=$1',[user.id])).rows[0];if(!m?.customer_id)fail(404,'No subscription customer found');const p=await stripe.billingPortal.sessions.create({customer:m.customer_id,return_url:base+'/?billing=return'});send(res,200,{url:p.url});return true;}
 if(!billingReady()||!stripe)fail(503,'Premium checkout is not open yet. Your free account is unchanged.');
 if(route==='/api/billing/checkout'){
  if((await premiumAccess(pool,user.id)).previewMode)fail(409,'Return to your actual plan before starting a purchase.');
  if(!/^[a-zA-Z0-9-]{12,100}$/.test(d.key||''))fail(400,'Invalid purchase request');const price=d.interval==='year'?process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID:process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;if(!price)fail(400,'This plan is not available');
  if(d.trial!=null&&typeof d.trial!=='boolean')fail(400,'Choose a valid trial option');if(d.trial&&(d.consent!==true||d.offer?.termsVersion!==renewalTermsVersion))fail(400,'Agree to automatic paid renewal before continuing.');
  // Persist the checkout request BEFORE the Stripe write. Retries after a
  // timeout/crash reuse its idempotency key instead of opening another payment.
  const pending=await billingTransaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);if(d.trial){const access=await membership(c,user.id,{actual:true});if(access.trialUsed||access.premium||access.status==='payment_review')fail(409,'This account is not eligible for a free trial.');}await c.query('INSERT INTO billing_memberships(user_id) VALUES($1) ON CONFLICT DO NOTHING',[user.id]);const m=(await c.query('SELECT * FROM billing_memberships WHERE user_id=$1 FOR UPDATE',[user.id])).rows[0];
   if(!m.customer_id){const customer=await stripe.customers.create({email:user.email,name:user.name,metadata:{continuum_user:user.id}},{idempotencyKey:'continuum-customer-'+user.id});await c.query('UPDATE billing_memberships SET customer_id=$2 WHERE user_id=$1',[user.id,customer.id]);m.customer_id=customer.id;}
   const current=await stripe.subscriptions.list({customer:m.customer_id,status:'all',limit:100});if(current.has_more)fail(503,'Subscription history requires payment support review.');if(current.data.some(s=>['active','trialing','past_due','unpaid','incomplete','paused'].includes(s.status)))fail(409,'An existing subscription needs management. Open Manage subscription.');
   let request=(await c.query('SELECT * FROM billing_checkout_requests WHERE user_id=$1 AND active FOR UPDATE',[user.id])).rows[0];
   if(request?.session_id){const old=await stripe.checkout.sessions.retrieve(request.session_id);if(old.status==='open'){if(request.trial!==!!d.trial||request.price_id!==price)fail(409,'Finish or wait for the existing checkout to expire before changing offers.');return {session:old};}await c.query('UPDATE billing_checkout_requests SET active=false WHERE id=$1',[request.id]);request=null;}
   if(request&&(request.trial!==!!d.trial||request.price_id!==price))fail(409,'Finish or wait for the existing checkout to expire before changing offers.');
   if(!request)request=(await c.query('INSERT INTO billing_checkout_requests(user_id,price_id,interval,trial,consent_at,terms_version,offer) VALUES($1,$2,$3,$4,CASE WHEN $4 THEN now() END,$5,$6::jsonb) RETURNING *',[user.id,price,d.interval==='year'?'year':'month',!!d.trial,d.trial?renewalTermsVersion:null,d.trial?JSON.stringify(d.offer):null])).rows[0];
   if(!billingSettings().prices.includes(request.price_id))fail(409,'A previous checkout needs review before starting another purchase.');
   const p=await stripe.prices.retrieve(request.price_id);if(!p.active||p.type!=='recurring'||p.unit_amount<=0||p.recurring?.interval!==request.interval)fail(503,'Premium price configuration needs review.');
   if(d.trial){const offer=checkedTrialPrice(p,request.interval);if(['priceId','amount','currency','interval','termsVersion'].some(k=>offer[k]!==d.offer?.[k]||offer[k]!==request.offer?.[k]))fail(409,'The price or terms changed. Refresh the offer and agree again.');}
   return {request,customer:m.customer_id};
  });
  let session=pending.session;if(!session){const r=pending.request;session=await stripe.checkout.sessions.create({mode:'subscription',customer:pending.customer,client_reference_id:user.id,line_items:[{price:r.price_id,quantity:1}],payment_method_collection:'always',...(r.trial?{custom_text:{submit:{message:'3 days free, then automatic recurring charges at the price and frequency shown. Cancel before the trial ends in Continuum Account to avoid a charge.'}}}:{}),subscription_data:{metadata:{continuum_user:user.id,product:'continuum-premium',...(r.trial?{continuum_trial:renewalTermsVersion,checkout_request:r.id}:{})},...(r.trial?{trial_period_days:3,trial_settings:{end_behavior:{missing_payment_method:'cancel'}}}:{})},success_url:base+'/?billing=success',cancel_url:base+'/?billing=cancelled'},{idempotencyKey:'continuum-checkout-'+r.id});await pool.query('UPDATE billing_checkout_requests SET session_id=$2 WHERE id=$1',[r.id,session.id]);}
  send(res,200,{url:session.url});return true;
 }
 if(route==='/api/billing/sync'){await billingTransaction(pool,async c=>{const m=(await c.query('SELECT customer_id FROM billing_memberships WHERE user_id=$1',[user.id])).rows[0];if(m?.customer_id)await reconcileCustomer(c,m.customer_id,stripe)});send(res,200,await status(pool,user));return true;}
 fail(404,'Billing endpoint not found');
}

export async function handleBilling(args){try{return await handleBillingCore(args)}catch(e){if(e.type?.startsWith('Stripe')||e.name?.startsWith('Stripe')){console.warn('Stripe request failed',JSON.stringify({type:e.type||e.name,code:/^[a-zA-Z0-9_]{1,80}$/.test(e.code||'')?e.code:'provider_error'}));args.fail(503,'Payment service is temporarily unavailable. No membership change has been confirmed.');}throw e}}
