// Store test receipts are accepted only in local development or isolated Railway Staging.
import {createHash, sign} from 'node:crypto';

const appleOrigin = 'https://api.storekit-sandbox.apple.com';
const googleOrigin = 'https://androidpublisher.googleapis.com';
const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleAccessStates = new Set(['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED']);

function sandboxEnabled(env = process.env) {
  const railwayEnvironment = env.RAILWAY_ENVIRONMENT_NAME?.toLowerCase();
  return env.STORE_BILLING_SANDBOX === 'true' && (railwayEnvironment
    ? ['staging', 'billing-staging'].includes(railwayEnvironment)
    : env.NODE_ENV !== 'production');
}

export async function migrateStoreSubscriptions(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS store_sandbox_subscriptions (
      provider text NOT NULL CHECK (provider IN ('apple', 'google')),
      purchase_key text NOT NULL,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      access_until timestamptz NOT NULL,
      verified_at timestamptz NOT NULL,
      PRIMARY KEY (provider, purchase_key)
    );
    CREATE INDEX IF NOT EXISTS store_sandbox_subscriptions_user
      ON store_sandbox_subscriptions (user_id, access_until DESC);
  `);
}

export async function storeSandboxAccess(db, userId) {
  if (!sandboxEnabled()) return null;
  return (await db.query(`
    SELECT provider, access_until FROM store_sandbox_subscriptions
    WHERE user_id=$1 AND access_until>now()
    ORDER BY access_until DESC, provider LIMIT 1
  `, [userId])).rows[0] ?? null;
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function signedJwt(header, claims, privateKey) {
  const body = `${encode(header)}.${encode(claims)}`;
  const options = header.alg === 'ES256' ? {key: privateKey, dsaEncoding: 'ieee-p1363'} : privateKey;
  const signature = sign('sha256', Buffer.from(body), options).toString('base64url');
  return `${body}.${signature}`;
}

function applePayload(value) {
  // Decode only JWS values received directly from Apple's authenticated HTTPS API.
  return JSON.parse(Buffer.from(value.split('.')[1], 'base64url').toString('utf8'));
}

function googleAccountId(userId) {
  return createHash('sha256').update(`continuum-store-google:${userId}`).digest('hex');
}

async function providerRequest(url, options, fail) {
  let response;
  try {
    response = await fetch(url, {...options, redirect: 'error', signal: AbortSignal.timeout(8000)});
    if (response.status === 400 || response.status === 404) fail(422, 'The store purchase could not be verified.');
    if (!response.ok) fail(503, 'Store verification is temporarily unavailable.');
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    if (error.status) throw error;
    fail(503, 'Store verification is temporarily unavailable.');
  }
}

async function verifyApple(originalId, userId, fail) {
  const {APPLE_STORE_BUNDLE_ID: bundle, APPLE_STORE_ISSUER_ID: issuer,
    APPLE_STORE_KEY_ID: keyId, APPLE_STORE_PRIVATE_KEY: key, APPLE_STORE_PRODUCT_IDS: ids} = process.env;
  if (!bundle || !issuer || !keyId || !key || !ids) fail(503, 'Apple Sandbox verification is not configured.');
  if (typeof originalId !== 'string' || !/^[0-9]{1,32}$/.test(originalId)) fail(400, 'Enter a valid Apple original transaction ID.');
  const now = Math.floor(Date.now() / 1000);
  const token = signedJwt({alg: 'ES256', kid: keyId, typ: 'JWT'}, {
    iss: issuer, iat: now, exp: now + 300, aud: 'appstoreconnect-v1', bid: bundle,
  }, key);
  const data = await providerRequest(`${appleOrigin}/inApps/v1/subscriptions/${originalId}`, {
    headers: {Authorization: `Bearer ${token}`},
  }, fail);
  if (data?.environment !== 'Sandbox' || data.bundleId !== bundle) fail(422, 'This is not a Continuum Apple Sandbox purchase.');
  const products = new Set(ids.split(',').map(id => id.trim()).filter(Boolean));
  const transactions = (data.data ?? []).flatMap(group => group.lastTransactions ?? []);
  let accessUntil = 0;
  let owned = false;
  for (const item of transactions) {
    const tx = applePayload(item.signedTransactionInfo);
    if (tx.originalTransactionId !== originalId || tx.bundleId !== bundle || tx.environment !== 'Sandbox' ||
      tx.appAccountToken?.toLowerCase() !== userId || !products.has(tx.productId)) continue;
    owned = true;
    if (tx.revocationDate || tx.isUpgraded) continue;
    const expiry = item.status === 4 && item.signedRenewalInfo
      ? applePayload(item.signedRenewalInfo).gracePeriodExpiresDate : item.status === 1 ? tx.expiresDate : 0;
    if (Number.isSafeInteger(expiry)) accessUntil = Math.max(accessUntil, expiry);
  }
  if (!owned) fail(422, 'This purchase is not linked to this Continuum account.');
  return {purchaseKey: originalId, accessUntil};
}

async function verifyGoogle(purchaseToken, userId, fail) {
  const {GOOGLE_PLAY_PACKAGE_ID: pkg, GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL: email,
    GOOGLE_PLAY_SERVICE_ACCOUNT_KEY: key, GOOGLE_PLAY_PRODUCT_IDS: ids} = process.env;
  if (!pkg || !email || !key || !ids) fail(503, 'Google Play test verification is not configured.');
  if (typeof purchaseToken !== 'string' || !/^[\x21-\x7e]{1,4096}$/.test(purchaseToken)) fail(400, 'Enter a valid Google Play purchase token.');
  const now = Math.floor(Date.now() / 1000);
  const assertion = signedJwt({alg: 'RS256', typ: 'JWT'}, {
    iss: email, aud: googleTokenUrl, iat: now, exp: now + 300,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
  }, key);
  const oauth = await providerRequest(googleTokenUrl, {
    method: 'POST',
    body: new URLSearchParams({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion}),
  }, fail);
  if (typeof oauth?.access_token !== 'string' || !oauth.access_token) fail(503, 'Google Play verification is temporarily unavailable.');
  const headers = {Authorization: `Bearer ${oauth.access_token}`};
  const appUrl = `${googleOrigin}/androidpublisher/v3/applications/${encodeURIComponent(pkg)}`;
  const token = encodeURIComponent(purchaseToken);
  const data = await providerRequest(`${appUrl}/purchases/subscriptionsv2/tokens/${token}`, {headers}, fail);
  if (!data?.testPurchase || data.externalAccountIdentifiers?.obfuscatedExternalAccountId !== googleAccountId(userId)) {
    fail(422, 'This Google Play test purchase is not linked to this Continuum account.');
  }
  const products = new Set(ids.split(',').map(id => id.trim()).filter(Boolean));
  const eligible = (data.lineItems ?? []).filter(item => products.has(item.productId));
  if (!eligible.length) fail(422, 'This purchase does not include a Continuum Premium plan.');
  const accessUntil = googleAccessStates.has(data.subscriptionState)
    ? Math.max(0, ...eligible.map(item => Date.parse(item.expiryTime) || 0)) : 0;
  if (accessUntil > Date.now() && data.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING') {
    await providerRequest(`${appUrl}/purchases/subscriptions/${encodeURIComponent(eligible[0].productId)}/tokens/${token}:acknowledge`, {
      method: 'POST', headers: {...headers, 'Content-Type': 'application/json'}, body: '{}',
    }, fail);
  }
  return {purchaseKey: createHash('sha256').update(purchaseToken).digest('hex'), accessUntil};
}

export async function handleStoreSubscriptions({route, req, res, pool, required, json, send, fail, limited}) {
  if (route !== '/api/billing/store-sandbox') return false;
  if (!sandboxEnabled()) fail(404, 'Store Sandbox is disabled.');
  const user = await required(req, 'learner');
  if (req.method === 'GET') {
    send(res, 200, {appleAccountToken: user.id, googleObfuscatedAccountId: googleAccountId(user.id)});
    return true;
  }
  if (req.method !== 'POST') fail(405, 'Use GET or POST.');
  limited(req, 'store-sandbox', 16);
  const data = await json(req);
  const verify = data.provider === 'apple' ? verifyApple : data.provider === 'google' ? verifyGoogle : null;
  if (!verify) fail(400, 'Choose Apple or Google Play.');
  // Older requests finishing late must not overwrite a newer verification.
  const checkedAt = new Date();
  const purchase = await verify(data.purchase, user.id, fail);
  const saved = await pool.query(`
    INSERT INTO store_sandbox_subscriptions(provider, purchase_key, user_id, access_until, verified_at)
    VALUES($1,$2,$3,$4,$5)
    ON CONFLICT(provider,purchase_key) DO UPDATE
      SET access_until=EXCLUDED.access_until, verified_at=EXCLUDED.verified_at
    WHERE store_sandbox_subscriptions.user_id=EXCLUDED.user_id
      AND store_sandbox_subscriptions.verified_at<=EXCLUDED.verified_at
    RETURNING user_id
  `, [data.provider, purchase.purchaseKey, user.id, new Date(purchase.accessUntil), checkedAt]);
  if (!saved.rowCount) {
    const existing = await pool.query(
      'SELECT user_id FROM store_sandbox_subscriptions WHERE provider=$1 AND purchase_key=$2',
      [data.provider, purchase.purchaseKey]);
    if (existing.rows[0]?.user_id !== user.id) fail(409, 'This purchase belongs to another account.');
  }
  const access = await storeSandboxAccess(pool, user.id);
  send(res, 200, {active: !!access, provider: access?.provider ?? null, accessUntil: access?.access_until ?? null});
  return true;
}
