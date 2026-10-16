# Original dashboard data migration — preparation (not cutover)

This prepares original Portfolio/Personal dashboard data for Google Drive. **Do not merge and delete the original data files until the GitHub interface has been updated and tested**.

## Export privately

From a local clone of this repo, install Node.js if needed and run:

```bash
node tools/export-private-models.cjs ../github-private-export
```

The destination MUST be outside the repository. The tool creates:

| File | Existing source | Upload to |
| --- | --- | --- |
| portfolio-model.json | data/portfolio-data.js | Google Drive / Github Pages / Portfolio / Content |
| education-model.json | data/education-catalog.js | Google Drive / Github Pages / Portfolio / Content |
| personal-analytics-model.json | data/personal-analytics.js | Google Drive / Github Pages / Personal / Content |

Review each model before upload. Keep file sharing **Restricted**. These are copies of already-public website data until old files and public history have been addressed.

## Apps Script endpoint

1. Add `private/backend/DashboardModels.gs` as a new script file in existing **Github Pages - Private Workspaces** project.
2. Add this case to existing `doPost` switch in `BrowserApi.gs` before `default`:

```javascript
case 'model':
  data = gpGetDashboardModel(workspace, String(r.token || ''), String(r.model || ''));
  break;
```

3. After uploading each JSON model file, set these Script Properties to its **FILE ID** (not folder ID):
   - `GP_PRIVATE_PORTFOLIO_MODEL_JSON_ID`
   - `GP_PRIVATE_EDUCATION_MODEL_JSON_ID`
   - `GP_PRIVATE_PERSONAL_ANALYTICS_JSON_ID`
4. Save and deploy a **New version** of the existing Web App; keep the same execute-as and access settings from successful previous tests.

## Expected protected API actions

POST via existing Worker, JSON with `{action:"model",workspace:"Portfolio",model:"portfolio",token:"..."}` or Portfolio model `education`; Personal model `analytics`. **Never paste active session tokens in chat or logs**.

An anonymous or wrong-workspace token must be rejected. Existing short-lived session controls are reused. The Worker returns `ok:false` for rejected requests (HTTP 200 may still be used).

## Deliberately not yet done

- Preserve original `portfolio/app.js` renderers by adapting them to the protected models after authorization.
- Preserve `personal/index.html` navigation, coursework tabs, and document previews using authorized Drive files.
- Resume page has its own data and media dependencies requiring migration.
- Replace the current test `/private/` UI only after all of the above are working.
- Remove public data and legacy client-side gates, audit Git history/forks and rotate exposed secrets if any.

The current master site and working Birthdays app are untouched by this PR.
