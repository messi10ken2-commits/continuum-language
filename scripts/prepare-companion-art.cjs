const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
(async()=>{const out='public/companions-v2',manifest=[];
for(const [file,cols,rows,names] of [
 ['../generated_images/exec-5e355516-4f22-4315-88ff-c994938ebb9d.png',3,2,['fox-head-happy','fox-body','fox-tail','fox-arm-left','fox-arm-right','fox-head']],
 ['../generated_images/exec-f3a50132-ed98-4065-96b5-1688613390e8.png',4,2,['bird-head','bird-body','bird-wing','bird-tail','cat-head','cat-body','cat-tail','cat-head-happy']],
 ['../generated_images/exec-82fde980-15eb-4b4b-810c-6415d302e2b8.png',2,2,['dog-head','dog-head-happy','dog-body','dog-tail']],
 ['../generated_images/exec-d4aaaabe-5a8e-43c1-a215-df95d8e25690.png',2,2,['capybara-head','capybara-head-happy','capybara-body']],
 ['../generated_images/exec-fa4b93b7-1ee7-4035-b332-4a7ecf646db8.png',2,2,['guinea-pig-head','guinea-pig-head-happy','guinea-pig-body']],
 ['../generated_images/exec-87414139-8678-4e44-b966-47fa9e90219c.png',2,2,['quokka-head','quokka-head-happy','quokka-body','quokka-tail']],
 ['../generated_images/exec-139bccc5-85e6-4169-a85c-265050c05201.png',2,2,['panda-head','panda-head-happy','panda-body','panda-tail']]]){
 const m=await sharp(file).metadata();for(let i=0;i<names.length;i++){const left=Math.round(i%cols*m.width/cols),top=Math.round(Math.floor(i/cols)*m.height/rows),right=Math.round((i%cols+1)*m.width/cols),bottom=Math.round((Math.floor(i/cols)+1)*m.height/rows);const tile=await sharp(file).extract({left,top,width:right-left,height:bottom-top}).toBuffer();const b=await sharp(tile).trim({threshold:30}).resize({width:400,height:400,fit:'inside'}).webp({quality:92}).toBuffer();await fs.writeFile(path.join(out,names[i]+'.webp'),b);manifest.push({file:names[i]+'.webp',source:path.basename(file),sha256:crypto.createHash('sha256').update(b).digest('hex')});}}
 await fs.writeFile(path.join(out,'art-manifest.json'),JSON.stringify(manifest,null,2)+'\n');})();
