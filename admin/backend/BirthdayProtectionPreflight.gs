/**
 * Phase 18E — Birthday protection preflight only.
 *
 * Does NOT intercept the public Kajus Questions script or change any routes.
 * This staging check deliberately never grants access to quiz content.
 *
 * Installed alongside AccessDecisionPreview.gs and AdminPolicies.gs.
 */
function gpBirthdayPreflightDecision_(events, asOf) {
  const preview=gpPreviewAccessDecision_('Birthdays',asOf,events);
  return {
    workspace:'Birthdays',
    localDate:preview.date,
    passwordWouldBeRequired:preview.passwordWouldBeRequired,
    allowQuizAccess:false,
    enforcementEnabled:false,
    source:preview.source,
    upstreamQuizProtected:false
  };
}
/**
 * Run from Apps Script editor, no Sheet operations or external HTTP calls.
 * Tests that calendar previews cannot be mistaken for upstream permissions.
 */
function gpTestBirthdayProtectionPreflight() {
  function check(value,label){if(!value)throw Error('FAIL: '+label)}
  const rules=[
    {action:'ADD',ruleId:'birthday-lock',workspace:'Birthdays',protected:true,mode:'indefinite',startDate:'',endDate:''},
    {action:'ADD',ruleId:'birthday-open',workspace:'Birthdays',protected:false,mode:'date-range',startDate:'2026-10-18',endDate:'2026-10-19'}
  ];
  const before=gpBirthdayPreflightDecision_(rules,'2026-10-18T03:59:59Z');
  const opening=gpBirthdayPreflightDecision_(rules,'2026-10-18T04:00:00Z');
  const closing=gpBirthdayPreflightDecision_(rules,'2026-10-20T03:59:59Z');
  const after=gpBirthdayPreflightDecision_(rules,'2026-10-20T04:00:00Z');
  check(before.passwordWouldBeRequired===true,'protected before start');
  check(opening.passwordWouldBeRequired===false,'OFF starts at New York midnight');
  check(closing.passwordWouldBeRequired===false,'OFF includes final New York date');
  check(after.passwordWouldBeRequired===true,'ON after end');
  for(const record of [before,opening,closing,after]){
    check(record.allowQuizAccess===false,'never authorize quiz from preview');
    check(record.enforcementEnabled===false,'enforcement remains disabled');
    check(record.upstreamQuizProtected===false,'upstream remains unprotected');
  }
  const cancelled=rules.concat([{action:'CANCEL',ruleId:'birthday-open',workspace:'Birthdays'}]);
  check(gpBirthdayPreflightDecision_(cancelled,'2026-10-18T16:00:00Z').passwordWouldBeRequired===true,'cancelled OFF ignored');
  const defaultState=gpBirthdayPreflightDecision_([],'2026-10-18T16:00:00Z');
  check(defaultState.passwordWouldBeRequired===false,'Birthdays currently public by default');
  Logger.log('PASS: Birthday dry-run schedule, timezone boundaries, cancellation; quiz access remains disabled in staging');
}
