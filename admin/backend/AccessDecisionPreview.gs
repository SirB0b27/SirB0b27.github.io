/**
 * Phase 18A — POLICY DECISION PREVIEW ONLY.
 *
 * This file does NOT modify gpRequireSession_, gpGetWorkspaceContent(),
 * gpGetDashboardModel(), BrowserApi.gs, the public quiz, or the Worker.
 * No guest access is granted. Test everything before a separate cutover.
 *
 * Requires GP_POLICY (AdminPolicies.gs), gpPolicySpace_() and gpPolicyEvents_().
 */
const GP_POLICY_CUTOVER = Object.freeze({
  ENABLED: false, // Documentation marker, not a production flag.
  TZ: 'America/New_York',
  WORKSPACES: ['Portfolio','Personal','Birthdays']
});

/** Safely validate YYYY-MM-DD in an unambiguous, timezone-independent way. */
function gpDecisionDate_(value) {
  const s=String(value||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('Invalid date.');
  const d=new Date(s+'T12:00:00Z');
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==s)throw Error('Invalid date.');
  return s;
}
function gpDecisionDay_(instant) {
  const d=instant instanceof Date?instant:new Date(instant);
  if(Number.isNaN(d.getTime()))throw Error('Invalid instant.');
  return Utilities.formatDate(d,GP_POLICY_CUTOVER.TZ,'yyyy-MM-dd');
}
/**
 * Calculates the last active rule for one workspace.
 * This is a pure decision preview: the result is NOT an authorization grant.
 * Deterministic precedence: append order in the event log; cancelled rules
 * are excluded. Range endpoints are inclusive New York calendar dates.
 */
function gpPreviewPolicyForDay_(workspace,day,events) {
  const name=gpPolicySpace_(workspace);
  const today=gpDecisionDate_(day);
  const defaults={
    Portfolio:{protected:true,source:'default'},
    Personal:{protected:true,source:'default'},
    Birthdays:{protected:false,source:'existing-public'}
  };
  const cancelled=new Set(events.filter(e=>e.action==='CANCEL').map(e=>String(e.ruleId)));
  let result={workspace:name,...defaults[name],ruleId:null,mode:null,startDate:null,endDate:null};
  for(const event of events) {
    if(event.action!=='ADD'||event.workspace!==name||cancelled.has(String(event.ruleId)))continue;
    if(typeof event.protected!=='boolean')continue;
    const mode=String(event.mode||'');
    if(mode==='date-range') {
      let start,end;
      try{start=gpDecisionDate_(event.startDate);end=gpDecisionDate_(event.endDate)}catch(e){continue}
      if(start>end||today<start||today>end)continue;
    }else if(mode!=='indefinite')continue;
    result={
      workspace:name,protected:event.protected,source:'scheduled-preview',
      ruleId:String(event.ruleId),mode,
      startDate:mode==='date-range'?String(event.startDate):null,
      endDate:mode==='date-range'?String(event.endDate):null
    };
  }
  return result;
}
/**
 * Records what the future authorization layer would see.
 * IMPORTANT: allowAnonymous is deliberately ALWAYS false.
 * Actual public guest routes must be designed, reviewed and tested separately.
 */
function gpPreviewAccessDecision_(workspace,instant,events) {
  const day=gpDecisionDay_(instant);
  const policy=gpPreviewPolicyForDay_(workspace,day,events);
  return {
    workspace:policy.workspace,date:day,timeZone:GP_POLICY_CUTOVER.TZ,
    passwordWouldBeRequired:policy.protected,
    ruleId:policy.ruleId,source:policy.source,
    allowAnonymous:false,enforcementEnabled:false
  };
}
/** Manual-only admin diagnostics; never add an anonymous API action for this. */
function gpAdminPreviewAccessDecision(token,workspace,isoInstant) {
  gpAdminRequire_(token);
  const d=isoInstant?new Date(isoInstant):new Date();
  return gpPreviewAccessDecision_(workspace,d,gpPolicyEvents_());
}
/** Runnable Apps Script test: no credentials, network calls or Sheet writes. */
function gpTestAccessDecisionPreview() {
  function assert(value,reason){if(!value)throw Error('FAIL: '+reason)}
  const events=[
    {action:'ADD',ruleId:'base',workspace:'Portfolio',protected:true,mode:'indefinite'},
    {action:'ADD',ruleId:'week',workspace:'Portfolio',protected:false,mode:'date-range',startDate:'2026-10-19',endDate:'2026-10-25'},
    {action:'ADD',ruleId:'personal',workspace:'Personal',protected:false,mode:'indefinite'},
    {action:'ADD',ruleId:'birthday',workspace:'Birthdays',protected:true,mode:'indefinite'},
    {action:'ADD',ruleId:'cancelled',workspace:'Portfolio',protected:false,mode:'indefinite'},
    {action:'CANCEL',ruleId:'cancelled',workspace:'Portfolio'}
  ];
  const p=(space,day)=>gpPreviewPolicyForDay_(space,day,events);
  assert(p('Portfolio','2026-10-18').protected,'before period must stay protected');
  assert(!p('Portfolio','2026-10-19').protected,'first day is included');
  assert(!p('Portfolio','2026-10-25').protected,'last day is included');
  assert(p('Portfolio','2026-10-26').protected,'after period reverts');
  assert(!p('Personal','2026-10-26').protected,'Personal indefinite preview');
  assert(p('Birthdays','2026-10-26').protected,'Birthdays independent preview');
  const other=[{action:'ADD',ruleId:'x',workspace:'Portfolio',protected:false,mode:'indefinite'}];
  assert(gpPreviewPolicyForDay_('Personal','2026-10-20',other).protected,'workspace isolation');
  assert(gpPreviewAccessDecision_('Portfolio','2026-10-20T04:01:00Z',events).allowAnonymous===false,'no anonymous authorization');
  assert(gpPreviewAccessDecision_('Portfolio','2026-10-20T04:01:00Z',events).enforcementEnabled===false,'preview only');
  // 2026-11-01 NYC clocks fall back: 05:30Z and 06:30Z are both Nov 1.
  assert(gpDecisionDay_('2026-11-01T05:30:00Z')==='2026-11-01','DST before fallback');
  assert(gpDecisionDay_('2026-11-01T06:30:00Z')==='2026-11-01','DST after fallback');
  // Local midnight boundary on Oct 19 (EDT UTC-4).
  assert(gpDecisionDay_('2026-10-19T03:59:59Z')==='2026-10-18','NY boundary before midnight');
  assert(gpDecisionDay_('2026-10-19T04:00:00Z')==='2026-10-19','NY boundary at midnight');
  Logger.log('PASS: preview boundaries, cancellation, precedence, workspace isolation, DST, and fail-closed guest decision');
}
