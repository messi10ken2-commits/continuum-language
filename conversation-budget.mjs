import {billingTransaction} from './billing-api.mjs';
export const freeConversationSeconds=420;
export const conversationLimit=premium=>premium?Math.min(3600,Math.max(900,Number(process.env.PREMIUM_CONVERSATION_SECONDS)||1800)):420;
export const conversationTurns=premium=>premium?48:12;
export const conversationDay=()=>new Date().toISOString().slice(0,10);
export async function migrateConversationBudget(pool){await pool.query(`ALTER TABLE speaking_sessions ADD COLUMN IF NOT EXISTS practice_ms bigint NOT NULL DEFAULT 0; ALTER TABLE speaking_sessions ADD COLUMN IF NOT EXISTS practice_tick timestamptz; CREATE TABLE IF NOT EXISTS speaking_daily_allowance(user_id uuid NOT NULL REFERENCES users(id),day text NOT NULL,session_id uuid NOT NULL REFERENCES speaking_sessions(id),PRIMARY KEY(user_id,day));`);}
export function timeUsed(s,now=Date.now()){return Number(s.practice_ms||0)+(s.practice_tick?Math.max(0,Math.min(30000,now-new Date(s.practice_tick).getTime())):0);}
export function budgetPublic(s,premium){return {limitSeconds:conversationLimit(premium),usedSeconds:Math.floor(timeUsed(s)/1000),maxTurns:conversationTurns(premium),premium,resetTimezone:'UTC'};}
export async function tickConversation(pool,userId,sessionId,premium,active){return billingTransaction(pool,async c=>{const s=(await c.query('SELECT * FROM speaking_sessions WHERE id=$1 AND user_id=$2 FOR UPDATE',[sessionId,userId])).rows[0];if(!s)throw Object.assign(Error('Conversation not found'),{status:404});const used=timeUsed(s),running=active&&s.status!=='completed'&&!s.lease_until&&used<conversationLimit(premium)*1000;return (await c.query('UPDATE speaking_sessions SET practice_ms=$3,practice_tick=$4 WHERE id=$1 AND user_id=$2 RETURNING *',[sessionId,userId,used,running?new Date():null])).rows[0];});}
