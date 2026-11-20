// Only fixed diagnostic codes cross into logs, database metadata or the owner UI.
// Never retain Google's error description, response body, tokens or message text.
export const mailDiagnosticHints={
 MAIL_DELIVERY_FAILED:'Delivery failed. Review the safe worker diagnostics.',
 MAIL_CONFIGURATION:'Mail settings or message headers are invalid.',
 MAIL_NETWORK_ERROR:'The server could not reach the mail provider. It will retry.',
 MAIL_TIMEOUT:'The mail provider timed out. It will retry.',
 MAIL_OUTBOX_DECRYPTION_FAILED:'The queued email could not be decrypted. Preserve the encryption key and review key changes.',
 GMAIL_OAUTH_INVALID_GRANT:'Reauthorize the intended sender using the same OAuth client as the server. The refresh token may be expired, revoked or issued to another client.',
 GMAIL_OAUTH_INVALID_CLIENT:'Check the OAuth client ID and client secret together in secure server settings.',
 GMAIL_OAUTH_UNAUTHORIZED_CLIENT:'This OAuth client is not allowed to use the configured authorization flow.',
 GMAIL_OAUTH_INVALID_SCOPE:'Authorize Gmail sending permission for the intended sender.',
 GMAIL_OAUTH_ACCESS_DENIED:'Google denied authorization. Review the consent screen, allowed users and account access.',
 GMAIL_OAUTH_REJECTED:'Google rejected token renewal. Review authorization for the configured client.',
 GMAIL_INVALID_AUTH_RESPONSE:'Google returned an unusable authorization response.',
 GMAIL_API_DISABLED:'Enable the Gmail API in the Google Cloud project that owns this OAuth client.',
 GMAIL_INSUFFICIENT_SCOPE:'The authorization does not permit Gmail sending. Reauthorize with gmail.send.',
 GMAIL_DOMAIN_POLICY:'The Google account or organization policy blocks this request.',
 GMAIL_RATE_LIMITED:'Google has limited requests or sending. Wait for the scheduled retry.',
 GMAIL_SERVICE_UNAVAILABLE:'Google is temporarily unavailable. The server will retry.',
 GMAIL_SEND_UNAUTHORIZED:'Google rejected the access token for sending.',
 GMAIL_SEND_FORBIDDEN:'Google refused this send. Check sender identity, permissions and account restrictions.',
 GMAIL_INVALID_MESSAGE:'Google rejected the message or sender headers.',
 GMAIL_SEND_REJECTED:'Google rejected the send request.',
 SMTP_AUTH_FAILED:'SMTP authentication failed. Review credentials in secure server settings.'
};
export class MailDeliveryError extends Error{
 constructor(code,status=null,message='Mail delivery unavailable'){
  super(message);this.name='MailDeliveryError';
  this.code=Object.hasOwn(mailDiagnosticHints,code)?code:'MAIL_DELIVERY_FAILED';
  this.httpStatus=Number.isInteger(status)&&status>=400&&status<=599?status:null;
 }
}
export function mailFailure(error){
 if(error instanceof MailDeliveryError)return {code:error.code,httpStatus:error.httpStatus};
 if(error?.code==='EAUTH')return {code:'SMTP_AUTH_FAILED',httpStatus:null};
 if(error?.name==='TimeoutError'||error?.name==='AbortError'||error?.code==='ETIMEDOUT')return {code:'MAIL_TIMEOUT',httpStatus:null};
 return {code:'MAIL_DELIVERY_FAILED',httpStatus:null};
}
export async function gmailFailure(response,stage){
 const data=await response.json().catch(()=>null),status=response.status;
 const reasons=[typeof data?.error==='string'?data.error:null,...(Array.isArray(data?.error?.errors)?data.error.errors.map(e=>e?.reason):[]),...(Array.isArray(data?.error?.details)?data.error.details.map(e=>e?.reason):[])];
 const oauth={invalid_grant:'GMAIL_OAUTH_INVALID_GRANT',invalid_client:'GMAIL_OAUTH_INVALID_CLIENT',unauthorized_client:'GMAIL_OAUTH_UNAUTHORIZED_CLIENT',invalid_scope:'GMAIL_OAUTH_INVALID_SCOPE',access_denied:'GMAIL_OAUTH_ACCESS_DENIED'};
 let code=stage==='authorization'&&typeof reasons[0]==='string'&&Object.hasOwn(oauth,reasons[0])?oauth[reasons[0]]:undefined;
 if(!code&&stage==='send'){
  if(reasons.some(r=>r==='accessNotConfigured'||r==='SERVICE_DISABLED'))code='GMAIL_API_DISABLED';
  else if(reasons.some(r=>r==='insufficientPermissions'||r==='ACCESS_TOKEN_SCOPE_INSUFFICIENT'))code='GMAIL_INSUFFICIENT_SCOPE';
  else if(reasons.includes('domainPolicy'))code='GMAIL_DOMAIN_POLICY';
  else if(reasons.some(r=>['rateLimitExceeded','userRateLimitExceeded','dailyLimitExceeded','quotaExceeded'].includes(r)))code='GMAIL_RATE_LIMITED';
 }
 code??=status===429?'GMAIL_RATE_LIMITED':status>=500?'GMAIL_SERVICE_UNAVAILABLE':stage==='authorization'?'GMAIL_OAUTH_REJECTED':status===401?'GMAIL_SEND_UNAUTHORIZED':status===403?'GMAIL_SEND_FORBIDDEN':status===400?'GMAIL_INVALID_MESSAGE':'GMAIL_SEND_REJECTED';
 return new MailDeliveryError(code,status,stage==='authorization'?'Gmail authorization unavailable':'Gmail delivery unavailable');
}
