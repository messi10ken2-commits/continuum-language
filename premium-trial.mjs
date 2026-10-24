export const renewalTermsVersion='premium-renewal-2026-10-25';
export async function migrateTrial(c){await c.query(`CREATE TABLE IF NOT EXISTS premium_trials(user_id uuid PRIMARY KEY REFERENCES users(id),started_at timestamptz NOT NULL DEFAULT now(),ends_at timestamptz NOT NULL DEFAULT (now()+interval '72 hours'));
 ALTER TABLE premium_trials ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'cardless';
 ALTER TABLE premium_trials ADD COLUMN IF NOT EXISTS subscription_id text;
 ALTER TABLE billing_checkout_requests ADD COLUMN IF NOT EXISTS trial boolean NOT NULL DEFAULT false;
 ALTER TABLE billing_checkout_requests ADD COLUMN IF NOT EXISTS consent_at timestamptz;
 ALTER TABLE billing_checkout_requests ADD COLUMN IF NOT EXISTS terms_version text;
 ALTER TABLE billing_checkout_requests ADD COLUMN IF NOT EXISTS offer jsonb;
 `)}
export async function trialStatus(c,userId){const r=(await c.query(`SELECT t.started_at,t.ends_at,t.kind,(SELECT r.offer FROM billing_checkout_requests r WHERE r.user_id=t.user_id AND r.trial AND r.consent_at IS NOT NULL ORDER BY r.consent_at DESC LIMIT 1) AS offer,t.ends_at>now() AND (t.kind='cardless' OR EXISTS(SELECT 1 FROM billing_memberships m WHERE m.user_id=t.user_id AND m.subscription_id=t.subscription_id AND m.status='trialing' AND m.paid_until>now())) AS active FROM premium_trials t WHERE t.user_id=$1`,[userId])).rows[0];return {trialUsed:!!r,trialActive:!!r?.active,trialKind:r?.kind||null,trialOffer:r?.offer||null,trialStartedAt:r?.started_at||null,trialEndsAt:r?.ends_at||null};}
export function checkedTrialPrice(p,interval){if(!p?.active||p.type!=='recurring'||!Number.isSafeInteger(p.unit_amount)||p.unit_amount<=0||p.recurring?.interval!==interval||(p.recurring.interval_count||1)!==1||!p.currency||p.billing_scheme==='tiered'||p.recurring.usage_type==='metered')throw Object.assign(Error('Premium price configuration needs review.'),{status:503});return {priceId:p.id,amount:p.unit_amount,currency:p.currency,interval,termsVersion:renewalTermsVersion};}
