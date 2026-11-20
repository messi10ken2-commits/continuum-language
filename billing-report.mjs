export async function billingReport(pool){
 const [accounts,invoices,refunds,events]=await Promise.all([
  pool.query(`WITH access AS (
   SELECT m.*,COALESCE(m.status='active' AND m.paid_until>now(),false) AS paid,
    EXISTS(SELECT 1 FROM billing_blocks b WHERE b.user_id=u.id AND b.blocked) AS blocked,
    EXISTS(SELECT 1 FROM premium_trials t WHERE t.user_id=u.id AND t.ends_at>now() AND
     (t.kind='cardless' OR (m.status='trialing' AND m.subscription_id=t.subscription_id AND m.paid_until>now()))) AS trial,
    EXISTS(SELECT 1 FROM premium_invitations i WHERE i.redeemed_by=u.id AND i.active AND
     (i.access_until IS NULL OR i.access_until>now())) AS invited
   FROM users u LEFT JOIN billing_memberships m ON m.user_id=u.id WHERE u.role='learner'
  )
  SELECT count(*) FILTER(WHERE blocked OR NOT(paid OR trial OR invited))::int AS free,
   count(*) FILTER(WHERE NOT blocked AND (paid OR trial OR invited))::int AS premium,
   count(*) FILTER(WHERE NOT blocked AND trial)::int AS trials,
   count(*) FILTER(WHERE NOT blocked AND paid AND recurring_interval='month')::int AS monthly,
   count(*) FILTER(WHERE NOT blocked AND paid AND recurring_interval='year')::int AS yearly,
   count(*) FILTER(WHERE (paid OR trial) AND cancel_at_period_end)::int AS cancelling,
   count(*) FILTER(WHERE status IN ('past_due','unpaid'))::int AS unpaid,
   count(*) FILTER(WHERE blocked)::int AS review,
   SUM(CASE WHEN recurring_interval='year' THEN recurring_amount/12.0 ELSE recurring_amount END)
    FILTER(WHERE paid AND NOT blocked AND recurring_currency='usd' AND recurring_interval IN ('month','year')) AS mrr,
   count(*) FILTER(WHERE paid AND NOT blocked AND (recurring_currency IS DISTINCT FROM 'usd' OR recurring_amount IS NULL OR recurring_interval IS NULL))::int AS unpriced
  FROM access`),
  pool.query(`SELECT currency,billing_interval AS interval,SUM(amount_paid) AS amount FROM billing_invoices
    WHERE paid_at>=date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AND amount_paid>0 AND currency<>'' GROUP BY 1,2 ORDER BY 1,2`),
  pool.query('SELECT currency,SUM(amount_refunded) AS amount FROM billing_refund_totals GROUP BY currency ORDER BY currency'),
  pool.query(`SELECT count(*) FILTER(WHERE type='invoice.paid')::int AS paid,
   count(*) FILTER(WHERE type='invoice.payment_failed')::int AS failed FROM billing_events
   WHERE processed_at>=date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`)
 ]);
 return {accounts:accounts.rows[0],invoices:invoices.rows,refunds:refunds.rows,events:events.rows[0]};
}
