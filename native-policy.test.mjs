import test from 'node:test';import assert from 'node:assert/strict';
import {validatedAPIOrigin,requestSessionToken,handleNativeOrigin,nativeSessionRequest} from './native-policy.mjs';
test('native endpoint is HTTPS without credentials or URL injection',()=>{
 assert.equal(validatedAPIOrigin('https://staging.example.test'),'https://staging.example.test');
 for(const url of ['http://example.test','https://user:pass@example.test','https://example.test/api','https://example.test/?token=x'])assert.throws(()=>validatedAPIOrigin(url));
});
test('bearer sessions reuse the shared session identity; ordinary cookies are preserved',()=>{
 const token='a'.repeat(43);assert.equal(requestSessionToken({headers:{authorization:'Bearer '+token}}),token);
 assert.equal(requestSessionToken({headers:{cookie:'other=1; continuum_session=web-session'}}),'web-session');
 assert.equal(nativeSessionRequest({headers:{origin:'https://evil.test','x-continuum-client':'ios'}}),false);
});
test('native origin does not permit cookie-only writes or wildcard CORS',()=>{
 const headers={},res={setHeader:(k,v)=>headers[k]=v,writeHead(){},end(){}},fail=(s,m)=>{throw Object.assign(Error(m),{status:s})};
 assert.throws(()=>handleNativeOrigin({method:'POST',headers:{origin:'capacitor://localhost',cookie:'continuum_session=x'}},res,'/api/practice',fail),{status:403});
 assert.equal(headers['Access-Control-Allow-Origin'],'capacitor://localhost');
 assert.equal(handleNativeOrigin({method:'POST',headers:{origin:'https://evil.test'}},res,'/api/practice',fail),false);
 assert.equal(handleNativeOrigin({method:'POST',headers:{origin:'capacitor://localhost','x-continuum-client':'ios'}},res,'/api/auth/login',fail),false);
});
