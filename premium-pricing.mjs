export const premiumTrialDays=3;
export const premiumPlans={
 month:{amount:999,currency:'usd',interval:'month'},
 year:{amount:7999,currency:'usd',interval:'year'}
};
export const isPremiumInterval=interval=>Object.hasOwn(premiumPlans,interval);
export const premiumPriceId=(env,interval)=>interval==='month'?env.STRIPE_PREMIUM_MONTHLY_PRICE_ID:interval==='year'?env.STRIPE_PREMIUM_YEARLY_PRICE_ID:undefined;
export function configuredPremiumPlans(env){
 return Object.fromEntries(Object.entries(premiumPlans).map(([interval,plan])=>{
  const configured=env[interval==='month'?'BILLING_MONTHLY_AMOUNT_CENTS':'BILLING_YEARLY_AMOUNT_CENTS'];
  const amount=configured===undefined||configured===''?plan.amount:/^[1-9][0-9]{0,7}$/.test(configured)?Number(configured):null;
  return [interval,{...plan,amount}];
 }));
}
export function stripeMode(env){
 const key=env.STRIPE_SECRET_KEY||'';
 if(/^(sk|rk)_live_/.test(key))return 'live';
 if(/^(sk|rk)_test_/.test(key))return 'test';
 return null;
}
