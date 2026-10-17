/**
 * Workspace policy registry, Phase 16 STAGING.
 * This records and previews policy only; it DOES NOT bypass or enforce
 * authentication. Never use the effective-policy result as authorization
 * until ALL content endpoints and Birthday upstream are updated.
 *
 * Requires AdminAuth.gs gpAdminRequire_ and AuthService.gs gpWorkspace_.
 * Execute setupWorkspacePolicyStore() manually as the script owner once.
 */
const GP_POLICY = Object.freeze({
  PROP: 'GP_ADMIN_POLICY_SPREADSHEET_ID',
  SHEET: 'Policy Events',
  TZ: 'America/New_York',
  HEADER: ['Event ID','Timestamp UTC','Actor','Action','Rule ID','Workspace','Protected','Mode','Start Date','End Date','Reason'],
  WORKSPACES: ['Portfolio','Personal','Birthdays']
});
function gpPolicySheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(GP_POLICY.PROP);
  if (!id) throw Error('Policy log is not configured.');
  const book=SpreadsheetApp.openById(id);
  const sheet=book.getSheetByName(GP_POLICY.SHEET);
  if (!sheet) throw Error('Policy log sheet missing.');
  return sheet;
}
/** Creates a new *private* Google Sheet; never publishes it. */
function setupWorkspacePolicyStore() {
  const props=PropertiesService.getScriptProperties();
  if (props.getProperty(GP_POLICY.PROP)) {
    Logger.log('Policy log already configured; not creating another.');
    return;
  }
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try {
    if (props.getProperty(GP_POLICY.PROP)) return;
    const book=SpreadsheetApp.create('Github Pages - Workspace Access Audit');
    const sheet=book.getSheets()[0];
    sheet.setName(GP_POLICY.SHEET);
    sheet.appendRow(GP_POLICY.HEADER);
    sheet.setFrozenRows(1);
    props.setProperty(GP_POLICY.PROP,book.getId());
    Logger.log('Policy log created. Find spreadsheet under My Drive; keep Restricted.');
  } finally {lock.releaseLock()}
}
function gpPolicyDate_(s) {
  const text=String(s||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(text))throw Error('Date must be YYYY-MM-DD.');
  const d=new Date(text+'T12:00:00Z');
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==text)throw Error('Invalid date.');
  return text;
}
function gpPolicySpace_(value) {
  const s=String(value||'').trim().toLowerCase();
  if(s==='birthdays')return 'Birthdays';
  return gpWorkspace_(s);
}
function gpPolicyEvents_() {
  const rows=gpPolicySheet_().getDataRange().getValues();
  return rows.slice(1).filter(x=>x[0]).map(x=>({
    eventId:String(x[0]),at:String(x[1]),actor:String(x[2]),
    action:String(x[3]),ruleId:String(x[4]),workspace:String(x[5]),
    protected:String(x[6])==='true',mode:String(x[7]),
    startDate:String(x[8]||''),endDate:String(x[9]||''),reason:String(x[10]||'')
  }));
}
function gpPolicyCurrent_(events,asOf) {
  const day=Utilities.formatDate(asOf,GP_POLICY.TZ,'yyyy-MM-dd');
  const revoked=new Set(events.filter(e=>e.action==='CANCEL').map(e=>e.ruleId));
  const state={
    Portfolio:{protected:true,source:'default',ruleId:null},
    Personal:{protected:true,source:'default',ruleId:null},
    Birthdays:{protected:false,source:'existing-public',ruleId:null}
  };
  // Latest active added rule wins, with strict event order.
  for(const e of events){
    if(e.action!=='ADD'||revoked.has(e.ruleId))continue;
    if(e.mode==='date-range'&&(day<e.startDate||day>e.endDate))continue;
    state[e.workspace]={protected:e.protected,source:e.mode,ruleId:e.ruleId,startDate:e.startDate,endDate:e.endDate};
  }
  return state;
}
/**
 * Admin-only policy visibility. Preview data is NOT an auth grant.
 * Limits log output; never returns credential records or tokens.
 */
function gpAdminPolicyStatus(token) {
  gpAdminRequire_(token);
  const events=gpPolicyEvents_();
  return {timezone:GP_POLICY.TZ,effective:gpPolicyCurrent_(events,new Date()),
    audit:events.slice(-500).reverse(),enforcementEnabled:false};
}
/**
 * Save a policy event. Does not change live access enforcement.
 * Supply {workspace,protected,mode,startDate,endDate,reason}.
 */
function gpAdminPolicyAdd(token,input) {
  gpAdminRequire_(token);
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid rule.');
  const workspace=gpPolicySpace_(input.workspace);
  if(typeof input.protected!=='boolean')throw Error('Protected must be true or false.');
  const mode=String(input.mode||'');
  if(mode!=='indefinite'&&mode!=='date-range')throw Error('Invalid policy duration.');
  const start=mode==='date-range'?gpPolicyDate_(input.startDate):'';
  const end=mode==='date-range'?gpPolicyDate_(input.endDate):'';
  if(start&&start>end)throw Error('Start date must be on or before end date.');
  const reason=String(input.reason||'').trim();
  if(reason.length>500)throw Error('Reason too long.');
  const actor='configured-admin';
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try {
    gpAdminRequire_(token);
    const ruleId=Utilities.getUuid();
    const eventId=Utilities.getUuid();
    gpPolicySheet_().appendRow([eventId,new Date().toISOString(),actor,'ADD',ruleId,workspace,
       String(input.protected),mode,start,end,reason]);
    return {ruleId,recorded:true,enforcementEnabled:false};
  }finally{lock.releaseLock()}
}
function gpAdminPolicyCancel(token,ruleId,reason) {
  gpAdminRequire_(token);
  const id=String(ruleId||'').trim();
  if(!/^[a-f0-9-]{36}$/i.test(id))throw Error('Invalid rule ID.');
  const why=String(reason||'').slice(0,500);
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    gpAdminRequire_(token);
    const events=gpPolicyEvents_();
    const added=events.find(e=>e.action==='ADD'&&e.ruleId===id);
    if(!added||events.some(e=>e.action==='CANCEL'&&e.ruleId===id))throw Error('Active rule not found.');
    gpPolicySheet_().appendRow([Utilities.getUuid(),new Date().toISOString(),'configured-admin','CANCEL',
      id,added.workspace,String(added.protected),added.mode,added.startDate,added.endDate,why]);
    return {recorded:true,enforcementEnabled:false};
  }finally{lock.releaseLock()}
}
/** Safe test: no mutation, only checks interval selection. */
function gpTestPolicySchedule_() {
  const events=[
    {action:'ADD',ruleId:'a',workspace:'Portfolio',protected:false,mode:'date-range',startDate:'2026-10-19',endDate:'2026-10-25'},
    {action:'ADD',ruleId:'b',workspace:'Personal',protected:false,mode:'indefinite',startDate:'',endDate:''}
  ];
  function date(d){return new Date(d+'T16:00:00Z')}
  const before=gpPolicyCurrent_(events,date('2026-10-18'));
  const during=gpPolicyCurrent_(events,date('2026-10-22'));
  const after=gpPolicyCurrent_(events,date('2026-10-26'));
  if(!before.Portfolio.protected||during.Portfolio.protected||!after.Portfolio.protected||
    during.Personal.protected||after.Birthdays.protected)throw Error('Policy schedule test FAILED');
  Logger.log('PASS: date window, indefinite, default policy evaluation');
}
