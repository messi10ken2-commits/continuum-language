import Stripe from 'stripe';
import {configuredPremiumPlans,stripeMode} from '../premium-pricing.mjs';

const env=process.env;
if(!process.argv.includes('--apply')||stripeMode(env)!=='test'){
 console.error('Use --apply with a Stripe sandbox secret key configured in your terminal.');
 process.exit(1);
}
const plans=configuredPremiumPlans(env);
if(Object.values(plans).some(plan=>!plan.amount)){
 console.error('Invalid configured Premium amounts.');
 process.exit(1);
}
const stripe=new Stripe(env.STRIPE_SECRET_KEY,{maxNetworkRetries:2});
const productId=env.STRIPE_PREMIUM_PRODUCT_ID||'continuum_premium';
try{
 let product;
 try{product=await stripe.products.retrieve(productId);}
 catch(error){
  if(error.code!=='resource_missing'||env.STRIPE_PREMIUM_PRODUCT_ID)throw error;
  product=await stripe.products.create({id:productId,name:'Continuum Premium'},{idempotencyKey:'continuum-premium-product-v1'});
 }
 if(!product.active||product.livemode!==false)throw Error('Invalid sandbox product');
 const ids={};
 for(const [interval,plan] of Object.entries(plans)){
  const lookup='continuum_premium_'+interval+'_usd_'+plan.amount;
  const validate=price=>price.active&&price.livemode===false&&price.product===productId&&price.currency===plan.currency&&
   price.unit_amount===plan.amount&&price.recurring?.interval===interval&&price.recurring.interval_count===1;
  const {data}=await stripe.prices.list({lookup_keys:[lookup],limit:2});
  if(data.length>1||data[0]&&!validate(data[0]))throw Error('Existing Stripe Price needs review');
  const price=data[0]||await stripe.prices.create({product:productId,unit_amount:plan.amount,currency:plan.currency,
   recurring:{interval},lookup_key:lookup},{idempotencyKey:lookup});
  if(!validate(price))throw Error('Invalid sandbox price');
  ids[interval]=price.id;
 }
 console.log('STRIPE_PREMIUM_MONTHLY_PRICE_ID='+ids.month);
 console.log('STRIPE_PREMIUM_YEARLY_PRICE_ID='+ids.year);
}catch{
 console.error('Sandbox provisioning did not complete. Check the test account permissions, product and prices in Stripe.');
 process.exitCode=1;
}
