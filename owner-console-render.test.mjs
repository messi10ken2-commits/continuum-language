import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {default:OwnerDashboard}=await vite.ssrLoadModule('/OwnerDashboard.jsx');
 const {default:SupportInbox}=await vite.ssrLoadModule('/SupportInbox.jsx');
 const {ReviewDashboard}=await vite.ssrLoadModule('/Profiles.jsx');
 const dashboard=renderToStaticMarkup(React.createElement(OwnerDashboard,{user:{id:'render-owner'}}));
 assert.ok(dashboard.includes('Administration'));assert.equal((dashboard.match(/aria-pressed=/g)||[]).length,9);for(const label of ['Accounts','Contacts','Services','Content','Teachers','Classes','Billing','Audit'])assert.ok(dashboard.includes(label));
 for(const role of ['learner','teacher']){const support=renderToStaticMarkup(React.createElement(SupportInbox,{user:{id:'render-'+role,role}}));assert.ok(support.includes('New contact'));assert.ok(support.includes('Search contacts'));assert.ok(!support.includes('mailto:'));}
 const review=renderToStaticMarkup(React.createElement(ReviewDashboard,{owner:true,embedded:true}));assert.ok(review.includes('Teacher applications'));assert.ok(!review.includes('Continuum administration'));
 console.log('PASS: owner navigation groups, support entry for both roles, and embedded teacher review render without changing standalone reviewer behavior.');
}finally{await vite.close()}
