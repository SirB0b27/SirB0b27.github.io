/**
 * Independent admin login for private workspace policy management.
 * STAGING ONLY: no policy-changing endpoints exist yet.
 * Add to existing "Github Pages - Private Workspaces" Apps Script project.
 * Admin credentials are never stored in GitHub or delivered to the browser.
 */
const GP_ADMIN = Object.freeze({PREFIX:'GP_ADMIN_V1_',SESSION_SECONDS:1800,MAX_FAILURES:6,LOCK_SECONDS:900});
function gpAdminProp_(key){return PropertiesService.getScriptProperties().getProperty(GP_ADMIN.PREFIX+key)}
function gpAdminPut_(key,value){PropertiesService.getScriptProperties().setProperty(GP_ADMIN.PREFIX+key,String(value))}
function gpAdminCredentials_(){
 const raw=gpAdminProp_('CREDENTIALS');
 if(!raw)throw Error('Admin authentication is not configured.');
 const c=JSON.parse(raw);
 if(!c.email||!c.hash||!c.salt||!c.version)throw Error('Admin authentication is incomplete.');
 return c;
}
/**
 * One-time manual provisioning. In Project Settings -> Script properties, set:
 * GP_ADMIN_SETUP_EMAIL = <your private admin email>
 * GP_ADMIN_SETUP_PASSWORD = <unique 16-256-character admin password>
 * Then run setupAdminCredentials once; the temporary secrets are removed.
 * For future password rotation, rerun with a fresh unique password.
 */
function setupAdminCredentials(){
 const properties=PropertiesService.getScriptProperties();
 const email=String(properties.getProperty('GP_ADMIN_SETUP_EMAIL')||'').trim().toLowerCase();
 const password=String(properties.getProperty('GP_ADMIN_SETUP_PASSWORD')||'');
 // Always delete temporary plaintext properties even on failure.
 properties.deleteProperty('GP_ADMIN_SETUP_EMAIL');
 properties.deleteProperty('GP_ADMIN_SETUP_PASSWORD');
 if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email))throw Error('Enter a valid admin email in Script Properties.');
 if(password.length<16||password.length>256)throw Error('Admin password must be 16-256 characters.');
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try{
   const raw=gpAdminProp_('CREDENTIALS');
   const old=raw?JSON.parse(raw):null;
   const salt=gpRandom_(64);
   gpAdminPut_('CREDENTIALS',JSON.stringify({email,salt,hash:gpPasswordHash_(password,salt),version:(old?.version||0)+1,updatedAt:Date.now()}));
   gpAdminPut_('FAILED',JSON.stringify({count:0,lockedUntil:0}));
   Logger.log('Admin credentials configured; all earlier admin sessions invalidated.');
 }finally{lock.releaseLock();}
}
function gpAdminLogin(email,password){
 const addr=String(email||'').trim().toLowerCase();
 const c=gpAdminCredentials_();
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try{
   const s=JSON.parse(gpAdminProp_('FAILED')||'{"count":0,"lockedUntil":0}');
   if(s.lockedUntil>Date.now())throw Error('Please try again later.');
   // One global counter (rather than per-email) prevents bypass by email rotation.
   let valid=false;
   if(addr===c.email && String(password||'').length>=16&&String(password||'').length<=256)
     valid=gpSafeEquals_(gpPasswordHash_(password,c.salt),c.hash);
   if(!valid){
      const count=(s.lockedUntil&&s.lockedUntil<=Date.now()?0:s.count||0)+1;
      gpAdminPut_('FAILED',JSON.stringify({count,lockedUntil:count>=GP_ADMIN.MAX_FAILURES?Date.now()+GP_ADMIN.LOCK_SECONDS:0}));
      throw Error('Incorrect credentials or temporarily locked.');
   }
   gpAdminPut_('FAILED',JSON.stringify({count:0,lockedUntil:0}));
   const token=gpRandom_(96);
   CacheService.getScriptCache().put('gp:admin:'+gpDigest_(token),JSON.stringify({version:c.version,issuedAt:Date.now()}),GP_ADMIN.SESSION_SECONDS);
   return {token,expiresInSeconds:GP_ADMIN.SESSION_SECONDS};
 }finally{lock.releaseLock();}
}
function gpAdminRequire_(token){
 const t=String(token||'');
 if(!/^[a-f0-9]{96}$/i.test(t))throw Error('Admin sign-in required.');
 const raw=CacheService.getScriptCache().get('gp:admin:'+gpDigest_(t));
 if(!raw)throw Error('Admin session expired.');
 const s=JSON.parse(raw);
 if(s.version!==gpAdminCredentials_().version)throw Error('Admin session expired.');
 return {authenticated:true};
}
function gpAdminStatus(token){gpAdminRequire_(token);return {authenticated:true,workspaces:['Portfolio','Personal','Birthdays'],policyEditingEnabled:false}}
function gpAdminLogout(token){
 const t=String(token||'');
 if(/^[a-f0-9]{96}$/i.test(t))CacheService.getScriptCache().remove('gp:admin:'+gpDigest_(t));
 return {ok:true};
}
