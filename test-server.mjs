// Test-only adapter: runs the actual server source against an in-memory PostgreSQL engine.
// No production database or account is touched. Requires @electric-sql/pglite.
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
let source=await fs.readFile(new URL('./server.mjs',import.meta.url),'utf8');
source=source.replace("import pg from 'pg';",`import {PGlite} from '${import.meta.resolve('@electric-sql/pglite')}';
const db=new PGlite();
const pg={Pool:class{async query(sql,args){if(!args&&sql.includes('CREATE TABLE'))return db.exec(sql);const r=await db.query(sql,args);return {...r,rowCount:r.rows.length||r.affectedRows||0}}async connect(){return {query:this.query.bind(this),release(){}}}}};`)
 .replace("const root=path.dirname(fileURLToPath(import.meta.url));",`const root=${JSON.stringify(root)};`)
 .replaceAll("'./course.mjs'",JSON.stringify(new URL('./course.mjs',import.meta.url).href))
 .replaceAll("'./assessment-api.mjs'",JSON.stringify(new URL('./assessment-api.mjs',import.meta.url).href))
 .replace("if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');",'')
 .replace('http.createServer((req,res)=>','const testServer=http.createServer((req,res)=>')
 .replace(".listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Continuum API ready'));",".listen(0,'127.0.0.1');\nawait new Promise(r=>testServer.on('listening',r));\nexport {testServer,db};");
const runtime=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
export const testServer=runtime.testServer,db=runtime.db;
