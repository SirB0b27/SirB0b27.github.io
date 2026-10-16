/**
 * Add to the existing "Github Pages - Private Workspaces" Apps Script project
 * as BrowserApi.gs. Uses the existing gpLogin(), gpGetWorkspaceContent(),
 * gpRequestPasswordReset(), gpCompletePasswordReset(), gpLogout().
 * Every content request stays guarded by gpRequireSession_().
 * Redeploy a NEW web app version after saving.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents || e.postData.contents.length > 10000)
      throw new Error('Invalid request.');
    const r = JSON.parse(e.postData.contents);
    if (!r || typeof r !== 'object' || Array.isArray(r)) throw new Error('Invalid request.');
    const workspace = gpWorkspace_(r.workspace);
    const action = String(r.action || '');
    let data;
    switch (action) {
      case 'login':
        data = gpLogin(workspace, String(r.email || ''), String(r.password || ''));
        break;
      case 'content':
        data = gpGetWorkspaceContent(workspace, String(r.token || ''));
        break;
      case 'logout':
        data = gpLogout(String(r.token || ''));
        break;
      case 'requestReset':
        data = gpRequestPasswordReset(workspace, String(r.email || ''));
        break;
      case 'completeReset':
        data = gpCompletePasswordReset(workspace, String(r.email || ''), String(r.code || ''), String(r.newPassword || ''));
        break;
      default:
        throw new Error('Unsupported action.');
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Avoid including exception stacks or credential information.
    const publicMessage = /Incorrect credentials|try again later|sign in again|Session expired|Password must|code|Code|recovery|reset|verification/i.test(String(err.message||''))
      ? String(err.message) : 'Request failed.';
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:publicMessage}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
