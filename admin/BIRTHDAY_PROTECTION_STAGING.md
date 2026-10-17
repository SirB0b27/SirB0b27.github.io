# Phase 18E — Birthday security preflight (NO live behavior changes)

## Verified routes
- Public GitHub Pages `/birthdays/` contains the original Kaju sidebar, Questions fullscreen iframe and Game placeholder.
- The Questions iframe points directly to a **separately deployed** Kajus Questions Google Apps Script `/exec`. Opening that URL does not traverse the private-workspace Worker, BrowserApi, or admin policy evaluator.
- Existing `gpPreviewAccessDecision_` returns policy calculations only and has `allowAnonymous:false, enforcementEnabled:false`; there is no direct auth contract between it and the separate quiz project.
- Birthdays currently defaults to public, including if no policy events exist.

## Install and test (safe)
1. Add **new** `BirthdayProtectionPreflight.gs` file to the existing **Github Pages - Private Workspaces** Apps Script project, using the source in `admin/backend/BirthdayProtectionPreflight.gs`.
2. Save, then select and run `gpTestBirthdayProtectionPreflight` in the Apps Script editor.
3. Expected log: `PASS: Birthday dry-run schedule, timezone boundaries, cancellation; quiz access remains disabled in staging`.
4. **Do not** redeploy the Birthday quiz, edit its `doGet`, change iframe URLs or enable policy enforcement. This test writes nothing to Sheets or Drive and makes no external requests.
5. No Worker, quiz, or website deployment is required to run the editor test.

## Production blocker — direct quiz URL
A GitHub-only password gate cannot secure a separately published Apps Script /exec. A referer or browser-defined marker is not authorization. The quiz must itself enforce a signed, limited-lifetime access grant or route every sensitive operation through an authenticated backend. A bearer token in an iframe query string can leak via browser history, referrers and logs, so avoid simple token-in-URL designs. Also account for Google Apps Script redirects and iframe third-party cookie/storage behavior.

## Recommended next implementation after preflight
1. Back up the existing Kajus Questions Apps Script project; inventory its `doGet`, `doPost`, client HTML and server functions, and decide how quiz sessions and responses are persisted.
2. Build a *separate staging deployment* of the quiz backed by a server-side access check. Preserve the original frontend markup, fullscreen behavior and questionnaire workflow.
3. Specify **public OFF** and **protected ON** server behaviors, including direct /exec access. Default deny if a protected policy cannot be checked, with an explicit birthday-public default until cutover.
4. Test missing credentials, forged requests, expired grants, cross-workspace attempts, cancelled rules, NY date boundaries, logout, quiz submission, reload, and direct /exec access.
5. Update iframe integration only after verified staging works. Retain rollback to current working quiz until final cutover.

## Security note
This repository's script files are source templates only. The active Kajus Questions Apps Script is independently deployed and cannot be safely assumed to match local GitHub files. The preflight result does not imply that the separate quiz is currently protected.
