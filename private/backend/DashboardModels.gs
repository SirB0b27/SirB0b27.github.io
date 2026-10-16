/**
 * Add as DashboardModels.gs to existing Apps Script project AFTER uploading the
 * converted JSON models to restricted Drive files and setting script properties.
 * The original gpGetWorkspaceContent() remains unchanged.
 */
const GP_DASHBOARD_MODELS = Object.freeze({
  Portfolio: Object.freeze({
    portfolio: 'GP_PRIVATE_PORTFOLIO_MODEL_JSON_ID',
    education: 'GP_PRIVATE_EDUCATION_MODEL_JSON_ID'
  }),
  Personal: Object.freeze({
    analytics: 'GP_PRIVATE_PERSONAL_ANALYTICS_JSON_ID'
  })
});
function gpGetDashboardModel(workspace, token, model) {
  const name = gpWorkspace_(workspace);
  gpRequireSession_(name, token); // MUST precede any Drive access
  const key = String(model || '');
  const property = GP_DASHBOARD_MODELS[name][key];
  if (!property) throw new Error('Unknown model.');
  const id = PropertiesService.getScriptProperties().getProperty(property);
  if (!id) throw new Error('Model not configured.');
  const file = DriveApp.getFileById(id); // Drive file stays Restricted
  if (file.getSize() > 6000000) throw new Error('Model too large.');
  return JSON.parse(file.getBlob().getDataAsString('UTF-8'));
}
/**
 * Add this case into BrowserApi.gs's doPost switch BEFORE default:
 *
 * case 'model':
 *   data = gpGetDashboardModel(workspace, String(r.token || ''), String(r.model || ''));
 *   break;
 *
 * Do not replace the entire BrowserApi.gs file with this file.
 */
