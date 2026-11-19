// Read-only configuration report. Never prints credentials, sends mail, or changes an account.
import {pushSettings} from '../../push-api.mjs';
import {appLinkSettings} from '../../app-links-api.mjs';
import {mailSettings,outboxReady} from '../../transactional-mail.mjs';
import {appleStoreSettings} from '../../apple-store-api.mjs';
import {erasurePolicy} from '../../account-erasure.mjs';
const mail=mailSettings(),apple=appleStoreSettings(),deletion=erasurePolicy();
const missing=names=>names.filter(name=>!process.env[name]);
const report={
 mail:{provider:mail.provider,transportConfigured:mail.configured,encryptedOutboxConfigured:outboxReady(),workerEnabled:process.env.READINESS_MAINTENANCE_ENABLED==='true',requiredSettings:mail.provider==='gmail-api'?missing(['AUTH_GMAIL_CLIENT_ID','AUTH_GMAIL_CLIENT_SECRET','AUTH_GMAIL_REFRESH_TOKEN','AUTH_MAIL_FROM','MAIL_OUTBOX_KEY','READINESS_MAINTENANCE_ENABLED']):mail.provider==='webhook'?missing(['AUTH_MAILER_WEBHOOK_URL','AUTH_MAILER_WEBHOOK_TOKEN','MAIL_OUTBOX_KEY','READINESS_MAINTENANCE_ENABLED']):missing(['AUTH_SMTP_HOST','AUTH_SMTP_USER','AUTH_SMTP_PASSWORD','AUTH_MAIL_FROM','MAIL_OUTBOX_KEY','READINESS_MAINTENANCE_ENABLED'])},
 deletion:{policyConfigured:deletion.configured,executionEnabled:deletion.enabled,requiredSettings:missing(['ACCOUNT_DELETION_POLICY_PUBLISHED','ACCOUNT_DELETION_POLICY_VERSION','ACCOUNT_DELETION_PROCESSING_DAYS','ACCOUNT_DELETION_RETENTION_DAYS','ACCOUNT_DELETION_BACKUP_DAYS','ACCOUNT_DELETION_ENABLED'])},
 apple:{credentialsConfigured:apple.configured,verificationEnabled:apple.enabled,environment:apple.environment,livePurchasesEnabled:false,requiredSettings:missing(['APPLE_STORE_BUNDLE_ID','APPLE_STORE_ISSUER_ID','APPLE_STORE_KEY_ID','APPLE_STORE_PRIVATE_KEY','APPLE_STORE_PRODUCT_IDS',...(apple.environment==='Production'?['APPLE_STORE_APP_ID','APPLE_STORE_LIVE_APPROVED']:[])])},
 remotePush:{implemented:true,registrationEnabled:pushSettings().registrationEnabled,deliveryEnabled:pushSettings().deliveryEnabled,requiredSettings:missing(['PUSH_TOKEN_KEY','APNS_BUNDLE_ID','APNS_ENVIRONMENT','APNS_KEY_ID','APNS_TEAM_ID','APNS_PRIVATE_KEY','PUSH_REGISTRATION_ENABLED','PUSH_DELIVERY_ENABLED'])},universalLinks:{implemented:true,associationEnabled:appLinkSettings().enabled,provisioned:false,requiredSettings:missing(['APPLE_APP_IDENTIFIER','APP_LINK_ORIGIN','APP_LINKS_ENABLED'])},deviceVerification:{completed:false}
};
console.log(JSON.stringify(report,null,2));
if(process.argv.includes('--strict')&&((process.env.ACCOUNT_DELETION_ENABLED==='true'&&!deletion.enabled)||(process.env.APPLE_STORE_SERVER_ENABLED==='true'&&!apple.enabled)||(process.env.PUSH_REGISTRATION_ENABLED==='true'&&!pushSettings().registrationEnabled)||(process.env.PUSH_DELIVERY_ENABLED==='true'&&!pushSettings().deliveryEnabled)||(process.env.APP_LINKS_ENABLED==='true'&&!appLinkSettings().enabled)))process.exitCode=1;
