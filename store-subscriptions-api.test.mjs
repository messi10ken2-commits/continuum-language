import assert from 'node:assert/strict';
import {generateKeyPairSync} from 'node:crypto';
import {test} from 'node:test';

const ec = generateKeyPairSync('ec', {namedCurve: 'P-256'}).privateKey.export({type: 'pkcs8', format: 'pem'});
const rsa = generateKeyPairSync('rsa', {modulusLength: 2048}).privateKey.export({type: 'pkcs8', format: 'pem'});
Object.assign(process.env, {
  STORE_BILLING_SANDBOX: 'true',
  APPLE_STORE_BUNDLE_ID: 'example.continuum',
  APPLE_STORE_ISSUER_ID: 'test-issuer',
  APPLE_STORE_KEY_ID: 'test-key',
  APPLE_STORE_PRIVATE_KEY: ec,
  APPLE_STORE_PRODUCT_IDS: 'premium.monthly',
  GOOGLE_PLAY_PACKAGE_ID: 'example.continuum',
  GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL: 'test@example.test',
  GOOGLE_PLAY_SERVICE_ACCOUNT_KEY: rsa,
  GOOGLE_PLAY_PRODUCT_IDS: 'premium',
});

test('verified store test purchases affect only their owner and are isolated from Production', async () => {
  const {testServer, db} = await import('./test-server.mjs');
  const nativeFetch = globalThis.fetch;
  const origin = 'http://127.0.0.1:' + testServer.address().port;
  const path = '/api/billing/store-sandbox';
  const api = async (path, method = 'GET', cookie, body) => {
    const response = await nativeFetch(origin + path, {
      method, headers: {'Content-Type': 'application/json', ...(cookie ? {cookie} : {})},
      ...(body ? {body: JSON.stringify(body)} : {}),
    });
    return {status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0]};
  };
  const register = name => api('/api/auth/register', 'POST', undefined, {
    name, email: name + '@example.test', password: 'store-sandbox-test-123', role: 'learner', adult: true,
  });
  const jws = payload => 'header.' + Buffer.from(JSON.stringify(payload)).toString('base64url') + '.signature';
  try {
    assert.equal((await api(path)).status, 401);
    const [a, b] = [await register('AppleQA'), await register('GoogleQA')];
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    const apple = (await api(path, 'GET', a.cookie)).data;
    const google = (await api(path, 'GET', b.cookie)).data;
    const expires = Date.now() + 86_400_000;
    const appleTx = {
      appAccountToken: apple.appleAccountToken, originalTransactionId: '1234', bundleId: 'example.continuum',
      productId: 'premium.monthly', environment: 'Sandbox', expiresDate: expires,
    };
    let appleStatus = 1, googleState = 'SUBSCRIPTION_STATE_CANCELED', googleTest = false, acknowledgements = 0;
    globalThis.fetch = async (url, options) => {
      const address = new URL(url);
      if (address.hostname === 'api.storekit-sandbox.apple.com') {
        assert.match(options.headers.Authorization, /^Bearer [^.]+\.[^.]+\.[^.]+$/);
        return Response.json({bundleId: appleTx.bundleId, environment: 'Sandbox', data: [{lastTransactions: [
          {status: appleStatus, signedTransactionInfo: jws(appleTx)},
        ]}]});
      }
      if (address.href === 'https://oauth2.googleapis.com/token') return Response.json({access_token: 'test-token'});
      if (address.hostname === 'androidpublisher.googleapis.com') {
        if (address.pathname.endsWith(':acknowledge')) {
          acknowledgements++;
          return new Response(null, {status: 204});
        }
        return Response.json({
          ...(googleTest ? {testPurchase: {}} : {}),
          externalAccountIdentifiers: {obfuscatedExternalAccountId: google.googleObfuscatedAccountId},
          subscriptionState: googleState, acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING',
          lineItems: [{productId: 'premium', expiryTime: new Date(expires).toISOString()}],
        });
      }
      return nativeFetch(url, options);
    };
    const submit = (account, provider, purchase) => api(path, 'POST', account.cookie, {provider, purchase});
    const membership = async account => (await api('/api/billing', 'GET', account.cookie)).data.membership;
    assert.equal((await submit(b, 'apple', '1234')).status, 422);
    assert.equal((await submit(a, 'apple', '1234')).data.active, true);
    assert.equal((await membership(a)).source, 'apple_sandbox');
    assert.equal((await membership(b)).premium, false);
    appleStatus = 5;
    assert.equal((await submit(a, 'apple', '1234')).data.active, false);
    assert.equal((await membership(a)).premium, false);
    assert.equal((await submit(b, 'google', 'test-purchase-token')).status, 422);
    googleTest = true;
    assert.equal((await submit(a, 'google', 'test-purchase-token')).status, 422);
    assert.equal((await submit(b, 'google', 'test-purchase-token')).data.active, true);
    assert.equal(acknowledgements, 1);
    assert.equal((await membership(b)).source, 'google_sandbox');
    googleState = 'SUBSCRIPTION_STATE_ON_HOLD';
    assert.equal((await submit(b, 'google', 'test-purchase-token')).data.active, false);
    googleState = 'SUBSCRIPTION_STATE_ACTIVE';
    assert.equal((await submit(b, 'google', 'test-purchase-token')).data.active, true);
    process.env.NODE_ENV = 'production';
    process.env.RAILWAY_ENVIRONMENT_NAME = 'production';
    assert.equal((await api(path, 'GET', b.cookie)).status, 404);
    assert.equal((await membership(b)).premium, false);
  } finally {
    globalThis.fetch = nativeFetch;
    await new Promise(resolve => testServer.close(resolve));
    await db.close();
  }
});
