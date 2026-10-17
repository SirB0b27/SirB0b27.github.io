/**
 * Kajus Questions production-readiness checks, designed for editor runs only.
 *
 * This does not authenticate a visitor or modify quiz data.
 * Add to the *staging* script first, not the currently live quiz.
 */
function kqProductionPreflight() {
  const props=PropertiesService.getScriptProperties();
  const sheetKeys=['QUESTION_SHEET_ID','RESPONSE_SHEET_ID','SAVE_SHEET_ID','SCORE_SHEET_ID','USERS_SHEET_ID'];
  const ids=sheetKeys.map(k=>String(props.getProperty(k)||''));
  if(ids.some(x=>!x))throw Error('Missing one or more required Sheet IDs.');
  if(new Set(ids).size!==ids.length)throw Error('A quiz Sheet ID is reused across roles.');
  const policyId=String(props.getProperty('KQ_POLICY_AUDIT_SHEET_ID')||'');
  if(!policyId||ids.includes(policyId))throw Error('Policy Sheet missing or conflated with quiz data.');
  if(props.getProperty('KQ_GATE_SETUP_PASSWORD'))throw Error('Plaintext bootstrap password property still exists.');
  if(!props.getProperty('KQ_GATE_HASH')||!props.getProperty('KQ_GATE_SALT'))
    throw Error('Birthday workspace password has not been initialized.');
  const expected=[
    ['QUESTION_SHEET_ID','Questions'],
    ['RESPONSE_SHEET_ID','Responses'],
    ['SAVE_SHEET_ID','Save Metadata'],
    ['SCORE_SHEET_ID','Scores'],
    ['USERS_SHEET_ID','Users']
  ];
  for(const [key,tab] of expected){
    const ss=SpreadsheetApp.openById(props.getProperty(key));
    if(!ss.getSheetByName(tab))throw Error('Required tab not found for '+key+': '+tab);
  }
  const audit=SpreadsheetApp.openById(policyId);
  if(!audit.getSheetByName('Policy Events'))throw Error('Admin policy event tab missing.');
  const status=birthdayGateStatus();
  if(!status.ready)throw Error('Birthday policy evaluation unavailable.');
  // Only non-sensitive diagnostics. Never log passwords, tokens or Sheet IDs.
  Logger.log('PASS: five distinct accessible quiz Sheets, required tabs, policy Sheet, initialized password; policy readable.');
}
/**
 * Use in a separate staging project before any new deployment.
 * This check cannot prove a Sheet is a harmless copy or that an old
 * deployment was retired. Verify exact IDs manually with the owner.
 */
