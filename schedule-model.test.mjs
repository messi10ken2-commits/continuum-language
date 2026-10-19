import {test} from 'node:test';import assert from 'node:assert/strict';import {availabilityDates,teachingMetrics} from './schedule-model.mjs';
const now=Date.parse('2026-10-19T10:00:00Z');
test('weekly slots preserve local time through DST and reject skipped/repeated hours',()=>{
 const list=availabilityDates({local:'2026-10-23T14:00',timezone:'Europe/London',duration:50,weeks:2,startsAt:'2026-10-23T13:00:00.000Z'},now);assert.equal(list[1].startsAt,'2026-10-30T14:00:00.000Z');assert.equal(Date.parse(list[1].endsAt)-Date.parse(list[1].startsAt),50*60000);
 assert.throws(()=>availabilityDates({local:'2026-10-18T01:30',timezone:'Europe/London',duration:50,weeks:2,startsAt:'2026-10-18T00:30:00.000Z'},now-3*86400000),/ambiguous/);
 assert.throws(()=>availabilityDates({local:'2026-10-23T14:00',timezone:'Europe/London',duration:50,weeks:13,startsAt:'2026-10-23T13:00:00.000Z'},now));assert.throws(()=>availabilityDates({local:'2026-10-23T14:00',timezone:'Europe/London',duration:50,weeks:1,startsAt:'2026-10-23T14:00:00.000Z'},now),/offset/);
});
test('performance uses real completed durations, unique teacher actions and measured reply bursts',()=>{
 const iso=h=>new Date(now+h*3600000).toISOString();const booking=(id,status,h)=>({id,status,teacher_id:'t',learner_id:'l'+id,created_at:iso(-20),starts_at:iso(h),ends_at:iso(h+1)});
 const bookings=[booking('a','completed',-2),booking('b','cancelled',20),booking('c','cancelled',30),booking('d','cancelled',40),booking('e','confirmed',50)];
 const ev=(id,kind,actor='t',detail={})=>({booking_id:id,kind,actor_id:actor,detail,created_at:iso(-1)}),events=[ev('a','booked','l'),ev('b','booked','l'),ev('b','cancelled'),ev('b','cancelled'),ev('c','booked','l'),ev('c','cancelled','lc'),ev('d','booked','l'),ev('d','admin_cancelled','owner'),ev('e','booked','l'),ev('e','rescheduled','l')];
 let seq=0;const msg=(thread,author,h,kind='message')=>({thread_id:thread,author_id:author,teacher_id:'t',created_at:iso(h),kind,seq:++seq});const messages=[msg('1','l',-60),msg('1','l',-59),msg('1','t',-50),msg('2','l',-48),msg('2','t',-47,'update'),msg('3','l',-2),msg('4','l',-80),msg('4','t',-50)];
 const m=teachingMetrics(bookings,messages,events,{days:7,now});assert.equal(m.completed,1);assert.equal(m.teachingMinutes,60);assert.equal(m.eligible,5);assert.equal(m.teacherCancelled,1);assert.equal(m.cancellationRate,20);assert.equal(m.reliability,80);assert.equal(m.teacherRescheduled,0);assert.equal(m.responseOpportunities,3);assert.equal(m.timelyReplies,1);assert.equal(m.responseRate,33);assert.equal(m.earnings.enabled,false);assert.equal(m.earnings.collectedMinor,0);
 const empty=teachingMetrics([],[],[],{now});assert.equal(empty.responseRate,null);assert.equal(empty.reliability,null);assert.equal(empty.totalCompleted,0);
});
