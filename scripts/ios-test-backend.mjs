// Ephemeral loopback HTTPS fixture for the iOS simulator. Never production data.
import https from 'node:https';import {readFile,writeFile} from 'node:fs/promises';
process.env.NODE_ENV='development';delete process.env.DATABASE_URL;delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs');
const base='http://127.0.0.1:'+testServer.address().port;
const registered=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Native QA learner',email:'native-e2e@example.test',password:'native-e2e-password-123',role:'learner',adult:true})});
if(!registered.ok)throw Error('Could not seed native test account');
const cookie=registered.headers.get('set-cookie').split(';')[0];
const profile=await fetch(base+'/api/profile',{method:'PUT',headers:{'Content-Type':'application/json',cookie},body:JSON.stringify({profile:{name:'Native QA learner',languages:['en'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Everyday communication'}})});
if(!profile.ok)throw Error('Could not seed native test profile');
// Dedicated public demonstration account: all data is synthetic and ephemeral.
const demo=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Alex',email:'store-demo@example.test',password:'store-demo-fixture-123',role:'learner',adult:true})});
if(!demo.ok)throw Error('Could not seed screenshot account');
const demoCookie=demo.headers.get('set-cookie').split(';')[0];
const demoProfile=await fetch(base+'/api/profile',{method:'PUT',headers:{'Content-Type':'application/json',cookie:demoCookie},body:JSON.stringify({profile:{name:'Alex',languages:['es'],primaryLanguage:'es',level:'A1',startMode:'manual',goal:'Everyday communication'}})});
if(!demoProfile.ok)throw Error('Could not seed screenshot profile');
const tls=https.createServer({key:await readFile('/tmp/continuum-test.key'),cert:await readFile('/tmp/continuum-test.crt')},(req,res)=>{if(req.url.startsWith('/api/'))res.on('finish',()=>console.log('Fixture API',req.method,new URL(req.url,'https://127.0.0.1').pathname,res.statusCode));testServer.emit('request',req,res)});
await new Promise(r=>tls.listen(9443,'127.0.0.1',r));await writeFile('/tmp/continuum-ios-backend-ready','ready');
console.log('Synthetic native HTTPS backend ready on loopback port 9443');
process.on('SIGTERM',async()=>{tls.closeAllConnections();await new Promise(r=>tls.close(r));testServer.closeAllConnections();await new Promise(r=>testServer.close(r));await db.close();process.exit(0)});
