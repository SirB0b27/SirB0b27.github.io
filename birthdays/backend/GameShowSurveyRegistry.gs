/**
 * Chatting Chaunties — Game Show survey registry.
 * Server-side Apps Script module. NOT a public client API.
 *
 * Script property: GAME_SHOW_CONFIG_SHEET_ID
 * Private workbook tabs:
 * - Survey Files: Name, Questions Sheet ID, Responses Sheet ID,
 *   Scores Sheet ID, Users Sheet ID, Saves Sheet ID
 * - Member Themes: Name, Primary Color, Secondary Color, Accent Color,
 *   Text Color, Background Color, Notes
 *
 * Do not expose spreadsheet IDs, authentication tokens or entire config rows
 * through doGet, google.script.run or a public JSON response.
 * This module performs data lookup only. Authorization must be enforced in
 * every consuming RPC before opening or changing a member spreadsheet.
 */
const GAME_SHOW_NAMES=Object.freeze([
  'Hemanth','Chahana','Apurva','Sreekanth','Sai','Sid',
  'Akshay','Neha','Ishaan','Sreeja','Kaushik'
]);
const GAME_SHOW_SHEET_TYPES=Object.freeze([
  'questions','responses','scores','users','saves'
]);
function gsConfigBook_(){
  const id=PropertiesService.getScriptProperties().getProperty('GAME_SHOW_CONFIG_SHEET_ID');
  if(!id)throw Error('Missing GAME_SHOW_CONFIG_SHEET_ID script property');
  return SpreadsheetApp.openById(id);
}
function gsFindMemberRow_(tabName,name){
  if(!GAME_SHOW_NAMES.includes(name))throw Error('Unknown member');
  const sheet=gsConfigBook_().getSheetByName(tabName);
  if(!sheet)throw Error('Configuration tab unavailable: '+tabName);
  const rows=sheet.getDataRange().getDisplayValues();
  const header=rows.shift().map(v=>String(v||'').trim());
  const match=rows.find(row=>String(row[0]||'').trim()===name);
  if(!match)throw Error('Member configuration unavailable');
  return Object.fromEntries(header.map((key,i)=>[key,String(match[i]||'').trim()]));
}
function gsSurveySheetId_(name,type){
  if(!GAME_SHOW_SHEET_TYPES.includes(type))throw Error('Unknown survey storage type');
  const key=type[0].toUpperCase()+type.slice(1)+' Sheet ID';
  const id=gsFindMemberRow_('Survey Files',name)[key];
  if(!id)throw Error('Missing survey storage configuration');
  return id;
}
function gsSurveySpreadsheet_(name,type){
  // Internal only. Call after a trusted server-side authorization decision.
  return SpreadsheetApp.openById(gsSurveySheetId_(name,type));
}
function gsMemberTheme_(name){
  const row=gsFindMemberRow_('Member Themes',name);
  const fallback={primary:'#1E3A5F',secondary:'#DCEAF7',accent:'#4A90E2',text:'#111827',background:'#F8FAFC'};
  const keys={'primary':'Primary Color','secondary':'Secondary Color',
    'accent':'Accent Color','text':'Text Color','background':'Background Color'};
  const theme={};
  for(const [key,column] of Object.entries(keys)){
    const candidate=row[column];
    theme[key]=/^#[0-9a-fA-F]{6}$/.test(candidate)?candidate:fallback[key];
  }
  return theme;
}
function gsPublicMemberTheme_(member){
  // Only safe, display-oriented properties. Call via an appropriately
  // authenticated and rate-limited endpoint if survey visibility is private.
  if(!GAME_SHOW_NAMES.includes(member))throw Error('Unknown member');
  return {member,theme:gsMemberTheme_(member)};
}
function testGameShowRegistryNames(){
  if(GAME_SHOW_NAMES.length!==11||new Set(GAME_SHOW_NAMES).size!==11)
    throw Error('Member registry must contain exactly 11 unique names');
  if(GAME_SHOW_SHEET_TYPES.length!==5)throw Error('Unexpected survey file types');
  Logger.log('PASS: 11 members, five survey file types; no files modified');
}

/**
 * Run from Apps Script editor on a staging copy. Read-only inspection.
 * Does not create users, alter responses, clear records or publish anything.
 * This checks that all configured spreadsheets are accessible and that all
 * five data files are unique per member.
 */
function testGameShowRegistryConnection(){
  testGameShowRegistryNames();
  const expected=['Name','Questions Sheet ID','Responses Sheet ID','Scores Sheet ID','Users Sheet ID','Saves Sheet ID'];
  const book=gsConfigBook_();
  const registry=book.getSheetByName('Survey Files');
  const themes=book.getSheetByName('Member Themes');
  if(!registry||!themes)throw Error('Configuration tabs missing');
  const headers=registry.getRange(1,1,1,6).getDisplayValues()[0];
  if(expected.some((v,i)=>headers[i]!==v))throw Error('Survey Files header mismatch');
  const assignedIds=new Set();
  const results=[];
  for(const member of GAME_SHOW_NAMES){
    const item={member,files:0,themeReady:false};
    for(const type of GAME_SHOW_SHEET_TYPES){
      const id=gsSurveySheetId_(member,type);
      if(!/^[a-zA-Z0-9_-]{20,}$/.test(id))throw Error('Invalid spreadsheet reference for '+member+' '+type);
      if(assignedIds.has(id))throw Error('Shared spreadsheet reference detected for '+member+' '+type);
      assignedIds.add(id);
      const spreadsheet=SpreadsheetApp.openById(id);
      if(!spreadsheet.getSheets().length)throw Error('Missing tabs for '+member+' '+type);
      item.files++;
    }
    const theme=gsMemberTheme_(member);
    item.themeReady=Object.values(theme).every(v=>/^#[0-9a-fA-F]{6}$/.test(v));
    results.push(item);
  }
  if(assignedIds.size!==55)throw Error('Expected 55 unique spreadsheet references');
  Logger.log('PASS: 11 members, 55 unique accessible sheets, valid theme fallbacks');
  Logger.log(JSON.stringify(results)); // Counts and member names only; no IDs.
  return {members:results.length,uniqueSheets:assignedIds.size,ok:true};
}

/**
 * ONE-TIME SETUP. In the Apps Script editor, run setupGameShowEnvironment().
 * Finds the uniquely named workbook in the executing user's Drive and sets
 * the required script property. No manual spreadsheet IDs needed.
 * Re-running is safe and does not modify any Sheet contents.
 */
function setupGameShowEnvironment(){
  const title='Chatting Chaunties - Member Themes';
  const matches=DriveApp.getFilesByName(title);
  const candidates=[];
  while(matches.hasNext()){
    const file=matches.next();
    if(file.getMimeType()===MimeType.GOOGLE_SHEETS&&!file.isTrashed())
      candidates.push(file);
  }
  if(candidates.length!==1)
    throw Error('Expected exactly one accessible configuration spreadsheet named "'+title+'"; found '+candidates.length);
  const file=candidates[0];
  const book=SpreadsheetApp.openById(file.getId());
  if(!book.getSheetByName('Member Themes')||!book.getSheetByName('Survey Files'))
    throw Error('Configuration spreadsheet is missing a required tab');
  PropertiesService.getScriptProperties().setProperty('GAME_SHOW_CONFIG_SHEET_ID',file.getId());
  const result=testGameShowRegistryConnection();
  Logger.log('Environment configured successfully. '+result.members+' members, '+result.uniqueSheets+' spreadsheets verified.');
  return {configured:true,members:result.members,spreadsheets:result.uniqueSheets};
}
