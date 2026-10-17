# Phase 16 — Policy registry and audit log (staging)

This is a **recording and preview layer**, not password on/off enforcement.
Do **not** expose `gpAdminPolicyAdd` or `gpAdminPolicyCancel` through the public BrowserApi until implementation and audit tests are complete.

## Installation
1. In your EXISTING `Github Pages - Private Workspaces` Apps Script project, add a script file named `AdminPolicies.gs`.
2. Copy all contents from `admin/backend/AdminPolicies.gs` into it. Save.
3. Run `setupWorkspacePolicyStore()` as the script owner. Grant Google Sheets permissions if requested. This creates a new **Restricted** Google Sheet named `Github Pages - Workspace Access Audit`.
4. In Project Settings > Script properties verify `GP_ADMIN_POLICY_SPREADSHEET_ID` exists. Do not post the ID publicly and do not change the Sheet sharing to Anyone.
5. Run `gpTestPolicySchedule_`. Expect `PASS: date window, indefinite, default policy evaluation`.
6. Keep current `BrowserApi.gs` unchanged for now. Do NOT add public endpoints to mutate policies, and do NOT change any workspace protection flags.

## Event model
Each ADD/CANCEL is appended with event ID, UTC timestamp, actor label, rule ID, workspace, protected true/false, mode, start date, end date, reason. Cancellation never deletes original rows.
Effective state is evaluated for today's America/New_York date (includes end date). Latest active ADD event in sheet order wins, cancelled IDs ignored. Default Portfolio & Personal protected; Birthday publicly accessible as it is today.

## Limitations to resolve before actual enforcement
- This is a prototype spreadsheet-backed event registry. An attacker with edit access to the Sheet can alter history. Stronger append-only audit storage and backup are required for tamper resistance.
- `gpAdminPolicyAdd` records a request; it **does not** turn any password on/off.
- Birthday's directly accessible Google Apps Script quiz URL must be gated server-side; adding a GitHub prompt is not sufficient.
- The existing public GitHub Portfolio/Personal/Resume/data and history remain accessible. Policy cannot make these private.
- The current client-side policy visualization and calendar have NOT been implemented.
- Admin auth hardening / recovery and origin/WAF controls are still open.
- Calendar dates are America/New_York by calendar day, independent of UTC timestamp. Test the exact DST transitions and boundary times prior to release.
- Several overlapping policy cases and simultaneous writers need additional validation.
- Never write a password, token, reset code or secret into the audit Sheet.
- The function uses the label `configured-admin` as actor because the current single-admin session system does not expose a stable actor ID.
