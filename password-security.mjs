import {scrypt,timingSafeEqual,randomBytes} from 'node:crypto';
import {promisify} from 'node:util';
const scryptAsync=promisify(scrypt);
const dummyHash='0'.repeat(32)+':'+ '0'.repeat(128);
let active=0;
const queue=[];
async function derive(password,salt){
 if(active>=4){
  if(queue.length>=16)throw Object.assign(Error('Sign-in is busy. Please try again shortly.'),{status:503});
  await new Promise(resolve=>queue.push(resolve));
 }else active++;
 try{return await scryptAsync(password,salt,64);}
 finally{const next=queue.shift();if(next)next();else active--;}
}
export async function passwordHash(password,salt=randomBytes(16).toString('hex')){
 return salt+':'+(await derive(password,salt)).toString('hex');
}
export async function passwordMatches(password,stored){
 if(typeof password!=='string'||password.length<1||password.length>128)return false;
 const valid=typeof stored==='string'&&/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored);
 const [salt,key]=(valid?stored:dummyHash).split(':');
 const actual=await derive(password,salt);
 return timingSafeEqual(Buffer.from(key,'hex'),actual)&&valid;
}
