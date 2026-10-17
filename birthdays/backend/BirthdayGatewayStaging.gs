/**
 * Kajus Questions — Phase 18F staging-only policy reader.
 *
 * Install only in a COPY of the Kajus Questions Apps Script project.
 * This code intentionally does not override doGet() or quiz RPCs.
 * It never grants visitor access and never writes to response/save/user sheets.
 *
 * Separate Apps Script projects DO NOT share CacheService sessions; do not try
 * to trust tokens issued by the private-workspace project here.
 */
const KQ_GATE_STAGING=Object.freeze({
  policyProperty:'KQ_POLICY_AUDIT_SHEET_ID',
  auditTab:'Policy Events',
  timezone:'America/New_York',
  column:{action:3,ruleId:4,workspace:5,protected:6,mode:7,start:8,end:9}
});
function kqGateDateCell_(value){
  if(Object.prototype.toString.call(value)==='[object Date]'&&!isNaN(value.getTime()))
    return Utilities.formatDate(value,KQ_GATE_STAGING.timezone,'yyyy-MM-dd');
  const s=String(value||'').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s)?s:'';
}
function kqGateEvaluateRows_(rows,day){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('Bad date');
  const I=KQ_GATE_STAGING.column;
  const events=rows.filter(row=>String(row[I.workspace])==='Birthdays');
  const cancelled=new Set(events.filter(row=>String(row[I.action])==='CANCEL').map(row=>String(row[I.ruleId])));
  // The existing Birthday default is PUBLIC, and this file is not enforcing.
  // An unavailable audit log must never be treated as an OFF grant.
  let protectedState=false,source='existing-public',ruleId=null;
  for(const row of events){
    if(String(row[I.action])!=='ADD'||cancelled.has(String(row[I.ruleId])))continue;
    const mode=String(row[I.mode]);
    if(mode==='date-range'){
      const first=kqGateDateCell_(row[I.start]),last=kqGateDateCell_(row[I.end]);
      if(!first||!last||first>last||day<first||day>last)continue;
    }else if(mode!=='indefinite')continue;
    const value=String(row[I.protected]).toLowerCase();
    if(value!=='true'&&value!=='false')continue;
    protectedState=value==='true';source=mode;ruleId=String(row[I.ruleId]);
  }
  return {passwordWouldBeRequired:protectedState,source,ruleId};
}
function kqGatePreviewStatus_(){
  const id=PropertiesService.getScriptProperties().getProperty(KQ_GATE_STAGING.policyProperty);
  if(!id)throw Error('Staging policy spreadsheet property missing');
  const sheet=SpreadsheetApp.openById(id).getSheetByName(KQ_GATE_STAGING.auditTab);
  if(!sheet)throw Error('Staging policy sheet missing');
  const day=Utilities.formatDate(new Date(),KQ_GATE_STAGING.timezone,'yyyy-MM-dd');
  const rows=sheet.getDataRange().getValues().slice(1);
  return {day,policy:kqGateEvaluateRows_(rows,day),guestQuizAuthorized:false,enforcementEnabled:false};
}
/** Zero external I/O: invoke from Run menu in a COPIED staging quiz project. */
function testKqBirthdayStagingGate(){
  function assert(x,label){if(!x)throw Error('FAILED: '+label)}
  const add=(id,value,mode,start,end)=>['id','ts','admin','ADD',id,'Birthdays',String(value),mode,start||'',end||'',''];
  const rows=[
    add('base',true,'indefinite'),
    add('window',false,'date-range','2026-10-18','2026-10-19'),
    add('cancelMe',false,'indefinite'),
    ['id','ts','admin','CANCEL','cancelMe','Birthdays','false','indefinite','','','']
  ];
  assert(kqGateEvaluateRows_(rows,'2026-10-17').passwordWouldBeRequired===true,'before window');
  assert(kqGateEvaluateRows_(rows,'2026-10-18').passwordWouldBeRequired===false,'window start');
  assert(kqGateEvaluateRows_(rows,'2026-10-19').passwordWouldBeRequired===false,'window end');
  assert(kqGateEvaluateRows_(rows,'2026-10-20').passwordWouldBeRequired===true,'after window');
  assert(kqGateEvaluateRows_([], '2026-10-20').passwordWouldBeRequired===false,'current public default');
  assert(kqGateEvaluateRows_([add('personal',true,'indefinite').map((x,i)=>i===5?'Personal':x)],'2026-10-20').passwordWouldBeRequired===false,'workspace isolation');
  Logger.log('PASS: Birthday quiz staging policy parity. No actual visitor access changed.');
}
