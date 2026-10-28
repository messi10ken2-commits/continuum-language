import test from 'node:test';import assert from 'node:assert/strict';
import {chapters,lessonList,getLessonVariant,gradeLesson,hasExpandedExercises} from './course.mjs';
import {idiomChapters,idiomLessons,idiomTransfer} from './c1-idioms.mjs';
import {premiumIdiomCourses} from './premium-idioms.mjs';
import {gradeCourseAnswer} from './premium-courses.mjs';
import {allowedSpeech} from './speech-api.mjs';
import {journeyChapters} from './journey-model.mjs';import {livingMapGeometry} from './living-map-model.mjs';
import {reviewedTranslation} from './reviewed-interface-copy.mjs';
test('each C1 pathway adds exactly two idiom lessons and a checkpoint before the level summary',()=>{
 assert.equal(idiomChapters.length,4);assert.equal(idiomLessons.length,12);
 for(const c of idiomChapters){const language=c.language||'es',path=journeyChapters(language,'C1'),row=path.find(x=>x.id===c.id);assert.equal(row.lessons.length,3);assert.ok(row.lessons.at(-1).checkpoint);assert.equal(path.at(-1).lessons[0].summaryTest,true);assert.ok(path.findIndex(x=>x.id===c.id)<path.length-1);assert.equal(chapters.find(x=>x.id===c.id),c);assert.ok(row.mapTitle.length<32);
  for(const width of [266,332,774]){const g=livingMapGeometry(path,width);assert.equal(g.points.length,path.length);assert.equal(new Set(g.points.map(p=>p.x+':'+p.y)).size,path.length);assert.ok(g.points.every(p=>p.x>=60&&p.x<=g.width-60&&p.y>=40&&p.y<g.height-40));}
 }
});
test('requested English expressions and all three Japanese categories have complete native models and playable audio',()=>{
 const english=idiomLessons.filter(l=>l.language==='en'&&!l.checkpoint).flatMap(l=>l.expressions.map(p=>p.term));assert.deepEqual(english,['off the cuff','off the top of my head','if anything','better off','trip me out','turn the tide','turn something on its head','off the hook','call the shots','sweep something under the rug']);
 assert.deepEqual(new Set(idiomLessons.filter(l=>l.language==='ja'&&!l.checkpoint).flatMap(l=>l.expressions.map(p=>p.type))),new Set(['四字熟語','慣用句','ことわざ']));
 for(const l of idiomLessons.filter(l=>!l.checkpoint)){assert.equal(l.expressions.length,5);assert.ok(hasExpandedExercises(l.id));for(const p of l.expressions){for(const field of ['term','meaning','register','use','example','translation','pitfall','region'])assert.ok(p[field],l.id+':'+field);assert.ok(allowedSpeech(p.term,l.locale));assert.ok(allowedSpeech(p.example,l.locale));}const expanded=getLessonVariant(l.id,'v8-idiom-regression-123456789');assert.ok(expanded.questions.some(q=>q.audio&&allowedSpeech(q.audio,l.locale)));assert.ok(expanded.questions.some(q=>q.mode==='order'));assert.ok(expanded.questions.some(q=>q.type==='text'&&!q.mode));assert.equal(gradeLesson(l.id,expanded.questions.map(q=>q.answer),'v8-idiom-regression-123456789').score,100);}
});
test('checkpoints use unseen situations from both lessons and new C1 reviews include the chapter',()=>{
 for(const c of idiomChapters){const language=c.language||'es',source=idiomLessons.filter(l=>l.chapter===c.id&&!l.checkpoint),examples=new Set(source.flatMap(l=>l.expressions.map(p=>p.example)));assert.ok(idiomTransfer[c.id].every(q=>!examples.has(q.context)));for(let i=0;i<5;i++){const seed='v1-idiom-checkpoint-'+i+'-123456789',checkpoint=getLessonVariant(c.id+'-checkpoint',seed);assert.equal(checkpoint.questions.length,4);assert.deepEqual(new Set(checkpoint.questions.map(q=>q.sourceLesson)),new Set(source.map(l=>l.id)));assert.equal(gradeLesson(checkpoint.id,checkpoint.questions.map(q=>q.answer),seed).score,100);}
  const summary=lessonList.find(l=>l.level==='C1'&&l.summaryTest&&(l.language||'es')===language),current=getLessonVariant(summary.id,summary.testSeedPrefix+'regression-123456789'),historical=getLessonVariant(summary.id,'v1-old-summary-123456789');assert.equal(current.questions.filter(q=>q.topic===c.title).length,3);assert.ok(!historical.questions.some(q=>q.topic===c.title),'existing summary seeds keep their earlier chapter pool');assert.equal(current.questions.length,historical.questions.length+3);
 }
});
test('two distinct exclusive C1 workshops per language use the existing mixed exercise contract',()=>{
 assert.equal(premiumIdiomCourses.length,8);const taught=new Set(idiomLessons.filter(l=>!l.checkpoint).flatMap(l=>l.expressions.map(p=>p.example)));
 for(const language of ['en','es','pt','ja'])assert.equal(premiumIdiomCourses.filter(c=>c.language===language&&c.level==='C1').length,2);
 for(const c of premiumIdiomCourses){assert.equal(c.examples.length,4);assert.equal(c.questions.length,8);assert.ok(c.examples.every(s=>!taught.has(s)));assert.ok(c.questions.some(q=>q.audio));assert.ok(c.questions.some(q=>q.type==='typing'));assert.ok(c.questions.some(q=>q.type==='cloze'));assert.ok(c.questions.some(q=>q.type==='reorder'));for(const q of c.questions)assert.ok(gradeCourseAnswer(q,q.answer));}
});
test('new map labels and lesson headings have reviewed copy in every display language',()=>{for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar'])for(const text of [...idiomChapters.flatMap(c=>[c.title,c.mapTitle,c.goal]),...idiomLessons.filter(l=>!l.checkpoint).map(l=>l.title),...premiumIdiomCourses.map(c=>c.title)])assert.ok(reviewedTranslation(text,locale),locale+':'+text);});
