import {isPlatformOwner} from './profiles-api.mjs';
import {billingTransaction} from './billing-api.mjs';
import {ownerAudit} from './owner-api.mjs';
export async function migrateSupport(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS support_tickets(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id),subject text NOT NULL,category text NOT NULL CHECK(category IN ('general','technical','billing','teaching','account')),status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','waiting','resolved')),revision integer NOT NULL DEFAULT 1,client_key text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,client_key));
 CREATE TABLE IF NOT EXISTS support_messages(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),seq bigserial UNIQUE,ticket_id uuid NOT NULL REFERENCES support_tickets(id),author_id uuid NOT NULL REFERENCES users(id),body text NOT NULL,client_key text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(author_id,client_key));
 CREATE TABLE IF NOT EXISTS support_reads(ticket_id uuid NOT NULL REFERENCES support_tickets(id),user_id uuid NOT NULL REFERENCES users(id),last_seq bigint NOT NULL DEFAULT 0,PRIMARY KEY(ticket_id,user_id));
 CREATE INDEX IF NOT EXISTS support_tickets_time ON support_tickets(updated_at DESC);
 CREATE INDEX IF NOT EXISTS support_messages_thread ON support_messages(ticket_id,seq);
 `)}
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const key=v=>typeof v==='string'&&/^[a-zA-Z0-9-]{12,100}$/.test(v);
const body=v=>typeof v==='string'&&v.trim().length>0&&v.length<=4000;
const categories=['general','technical','billing','teaching','account'],statuses=['open','waiting','resolved'];
export async function handleSupport({route,req,res,pool,required,json,send,fail,limited}){
 if(!route.startsWith('/api/support'))return false;
 const user=await required(req),owner=isPlatformOwner(user),url=new URL(req.url,'http://localhost');
 const ticket=async(c,id,lock=false)=>{const r=(await c.query('SELECT * FROM support_tickets WHERE id=$1'+(lock?' FOR UPDATE':''),[id])).rows[0];if(!r||!owner&&r.user_id!==user.id)fail(404,'Contact conversation not found');return r;};
 if(route==='/api/support/summary'&&req.method==='GET'){
  const r=await pool.query(`SELECT count(*)::int AS unread FROM support_messages m JOIN support_tickets t ON t.id=m.ticket_id LEFT JOIN support_reads r ON r.ticket_id=t.id AND r.user_id=$1 WHERE ($2::boolean OR t.user_id=$1) AND m.author_id<>$1 AND m.seq>COALESCE(r.last_seq,0)`,[user.id,owner]);send(res,200,{unread:r.rows[0].unread});return true;
 }
 if(route==='/api/support'&&req.method==='GET'){
  const status=url.searchParams.get('status')||null,role=url.searchParams.get('role')||null,q=(url.searchParams.get('q')||'').trim(),offset=Number(url.searchParams.get('offset')||0);
  if(status&&!statuses.includes(status)||role&&!['learner','teacher'].includes(role)||q.length>120||!Number.isInteger(offset)||offset<0||offset>1000000)fail(400,'Choose valid contact filters');
  const r=await pool.query(`SELECT t.id,t.subject,t.category,t.status,t.revision,t.updated_at AS "updatedAt",u.name,u.email,u.role,
   (SELECT count(*)::int FROM support_messages m LEFT JOIN support_reads r ON r.ticket_id=t.id AND r.user_id=$1 WHERE m.ticket_id=t.id AND m.author_id<>$1 AND m.seq>COALESCE(r.last_seq,0)) AS unread,count(*) OVER()::int AS total
   FROM support_tickets t JOIN users u ON u.id=t.user_id WHERE ($2::boolean OR t.user_id=$1) AND ($3::text IS NULL OR t.status=$3) AND ($4::text IS NULL OR u.role=$4) AND (t.subject ILIKE $5 OR u.email ILIKE $5 OR u.name ILIKE $5) ORDER BY t.updated_at DESC,t.id LIMIT 30 OFFSET $6`,[user.id,owner,status,role,'%'+q+'%',offset]);
  send(res,200,{tickets:r.rows.map(({total,...r})=>r),total:r.rows[0]?.total||0,offset,limit:30,owner});return true;
 }
 if(route==='/api/support'&&req.method==='POST'){
  limited(req,'support-create',20);const d=await json(req);
  if(typeof d.subject!=='string'||d.subject.trim().length<3||d.subject.length>120||!categories.includes(d.category)||!body(d.body)||!key(d.key))fail(400,'Add a subject, category and message of up to 4000 characters');
  const id=await billingTransaction(pool,async c=>{
   const inserted=await c.query('INSERT INTO support_tickets(user_id,subject,category,client_key) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING id',[user.id,d.subject.trim(),d.category,d.key]);
   if(!inserted.rows.length){const previous=(await c.query('SELECT t.*,m.body FROM support_tickets t JOIN support_messages m ON m.ticket_id=t.id AND m.client_key=t.client_key AND m.author_id=t.user_id WHERE t.user_id=$1 AND t.client_key=$2',[user.id,d.key])).rows[0];if(!previous||previous.subject!==d.subject.trim()||previous.category!==d.category||previous.body!==d.body.trim())fail(409,'This contact submission was already used with different content');return previous.id;}
   const id=inserted.rows[0].id;const message=await c.query('INSERT INTO support_messages(ticket_id,author_id,body,client_key) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING id',[id,user.id,d.body.trim(),d.key]);if(!message.rows.length)fail(409,'This message key was already used');return id;
  });send(res,201,{id});return true;
 }
 const m=route.match(/^\/api\/support\/([a-f0-9-]+)(?:\/(messages|read))?$/);
 if(m){if(!uuid.test(m[1]))fail(404,'Contact conversation not found');
  if(req.method==='GET'&&!m[2]){
   const t=await ticket(pool,m[1]);const before=url.searchParams.get('before');if(before&&!/^\d{1,15}$/.test(before))fail(400,'Invalid message page');
   const [person,messages]=await Promise.all([pool.query('SELECT name,email,role FROM users WHERE id=$1',[t.user_id]),pool.query('SELECT m.id,m.seq,m.author_id AS "authorId",u.name AS author,m.body,m.created_at AS at FROM support_messages m JOIN users u ON u.id=m.author_id WHERE m.ticket_id=$1 AND ($2::bigint IS NULL OR m.seq<$2) ORDER BY m.seq DESC LIMIT 50',[t.id,before||null])]);
   const {client_key,...publicTicket}=t;send(res,200,{ticket:{...publicTicket,...person.rows[0]},messages:messages.rows.reverse(),nextBefore:messages.rows.length===50?messages.rows[0].seq:null,owner});return true;
  }
  if(req.method==='POST'&&m[2]==='read'){
   await ticket(pool,m[1]);const d=await json(req),lastSeq=String(d.lastSeq??'');if(!/^\d{1,15}$/.test(lastSeq))fail(400,'Choose the last visible message');await pool.query('INSERT INTO support_reads(ticket_id,user_id,last_seq) SELECT $1,$2,COALESCE(max(seq),0) FROM support_messages WHERE ticket_id=$1 AND seq<=$3 ON CONFLICT(ticket_id,user_id) DO UPDATE SET last_seq=GREATEST(support_reads.last_seq,EXCLUDED.last_seq)',[m[1],user.id,lastSeq]);send(res,200,{ok:true});return true;
  }
  if(req.method==='POST'&&m[2]==='messages'){
   limited(req,'support-message',80);const d=await json(req);if(!body(d.body)||!key(d.key)||!Number.isInteger(d.revision))fail(400,'Write a message and refresh the conversation before sending');
   await billingTransaction(pool,async c=>{
    const t=await ticket(c,m[1],true),old=(await c.query('SELECT ticket_id,body FROM support_messages WHERE author_id=$1 AND client_key=$2',[user.id,d.key])).rows[0];if(old){if(old.ticket_id!==t.id||old.body!==d.body.trim())fail(409,'This message key was already used with different content');return;}
    if(t.revision!==d.revision)fail(409,'New activity arrived. Refresh this conversation before sending.');
    const inserted=await c.query('INSERT INTO support_messages(ticket_id,author_id,body,client_key) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING id',[t.id,user.id,d.body.trim(),d.key]);if(!inserted.rows.length)fail(409,'This message key was already used with different content');
    await c.query('UPDATE support_tickets SET status=$2,revision=revision+1,updated_at=now() WHERE id=$1',[t.id,owner?'waiting':'open']);if(owner)await ownerAudit(c,user,'support_replied',t.id);
   });send(res,200,{ok:true});return true;
  }
  if(req.method==='PUT'&&!m[2]){
   if(!owner)fail(403,'Platform owner only');const d=await json(req);if(!statuses.includes(d.status)||!Number.isInteger(d.revision))fail(400,'Choose a status and current revision');
   await billingTransaction(pool,async c=>{const t=await ticket(c,m[1],true);if(t.revision!==d.revision)fail(409,'This conversation changed. Refresh before updating it.');await c.query('UPDATE support_tickets SET status=$2,revision=revision+1,updated_at=now() WHERE id=$1',[t.id,d.status]);await ownerAudit(c,user,'support_status',t.id,{status:d.status});});send(res,200,{ok:true});return true;
  }
 }
 fail(404,'Support endpoint not found');
}
