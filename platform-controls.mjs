// Shared labels and route policy; all services remain enabled unless the owner pauses one.
export const platformFeatures=[
 {key:'registration',label:'New registrations',description:'Allow new learner and teacher accounts.'},
 {key:'selfStudy',label:'Self-study exercises',description:'Allow lesson drafts, exercise submissions and pronunciation practice.'},
 {key:'assessments',label:'Placement assessments',description:'Allow new placement tests and submissions.'},
 {key:'aiConversation',label:'AI conversation',description:'Allow new conversations and AI turns. Saved history and reviews remain accessible.'},
 {key:'exclusiveCourses',label:'Exclusive courses',description:'Allow course access and answer checks. Finishing an existing attempt remains available.'},
 {key:'review',label:'Vocabulary review',description:'Allow new review sessions. Saved review submissions remain available.'},
 {key:'focusedPractice',label:'Focused practice',description:'Allow Practice Studio focused tasks and their AI-assessed submissions. Existing reports and placement tasks remain accessible.'},
 {key:'bookings',label:'New class bookings',description:'Allow new booking and rescheduling proposals. Existing class management remains available.'},
 {key:'teacherApplications',label:'Teacher applications',description:'Allow teachers to create or update their teaching profile.'},
 {key:'teacherDirectory',label:'Teacher directory',description:'Publish the approved teacher directory.'},
 {key:'studioAudio',label:'Studio audio',description:'Allow studio audio requests. Device voice and existing downloaded recordings are unaffected.'},
 {key:'checkout',label:'New subscription checkout',description:'Allow new Stripe checkout requests and free trial starts. Subscription management and webhooks remain available.'}
];
export function controlledFeature(route,method){
 if(method==='POST'&&route==='/api/auth/register')return 'registration';
 if(route==='/api/speech')return 'studioAudio';
 if(method==='POST'&&['/api/billing/checkout','/api/billing/trial'].includes(route))return 'checkout';
 if(method==='PUT'&&route==='/api/profile')return 'teacherApplications';
 if(method==='GET'&&/^\/api\/teachers(?:\/|$)/.test(route))return 'teacherDirectory';
 if(method==='POST'&&route==='/api/speaking'||method==='POST'&&/^\/api\/speaking\/[^/]+\/turn$/.test(route))return 'aiConversation';
 if(/^\/api\/billing\/courses\//.test(route)&&!route.endsWith('/finish'))return 'exclusiveCourses';
 if(/^\/api\/assessments(?:\/|$)/.test(route)&&method!=='GET')return 'assessments';
 if(route==='/api/review'&&method==='GET')return 'review';
 if(route==='/api/skills'&&method==='POST'||/^\/api\/skills\/tasks\//.test(route)&&method==='GET')return 'focusedPractice';
 if(method==='POST'&&(route==='/api/classroom/bookings'||/^\/api\/classroom\/threads\/[^/]+\/bookings$/.test(route)))return 'bookings';
 if(method!=='GET'&&['/api/practice','/api/practice/import','/api/pronunciation'].includes(route)||method==='PUT'&&route.startsWith('/api/learning/'))return 'selfStudy';
 return null;
}

export function controlledFeatures(route,method){const keys=[controlledFeature(route,method)].filter(Boolean);if(method==='GET'&&/\/audio(?:\/|$)/.test(route)&&/^\/api\/(speaking|skills|billing\/courses)\//.test(route))keys.push('studioAudio');return [...new Set(keys)];}
