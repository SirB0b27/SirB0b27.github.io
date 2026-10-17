# Phase 18A — Policy decisions (dry run ONLY)

This change stages a separate **fail-closed policy decision preview**; it does not change any existing authentication requirements.

## Install manually in existing Apps Script project
1. In **Github Pages - Private Workspaces**, add new script file `AccessDecisionPreview.gs`.
2. Copy all code from `admin/backend/AccessDecisionPreview.gs`.
3. Save, choose the visible `gpTestAccessDecisionPreview` function in Apps Script, and run it.
4. Expect `PASS: preview boundaries, cancellation, precedence, workspace isolation, DST, and fail-closed guest decision`.
5. Keep `BrowserApi.gs`, `AuthService.gs`, `ContentService.gs`, `DashboardModels.gs`, the Worker and the Birthday quiz unchanged.
6. No deployment is needed to run an Apps Script editor function. If you want the new code included in the next deployment, deploy a **new version** only after the test passes. No routing or behavior changes should occur.

## Important semantics
- `gpPreviewAccessDecision_` **always** returns `allowAnonymous:false` and `enforcementEnabled:false`; this is deliberate. No preview OFF rule is a grant.
- `gpPreviewPolicyForDay_` evaluates the last applicable ADD event for the requested workspace in append order, excluding CANCELed rule IDs. An expired date-range rule no longer overrides a standing indefinite rule.
- Date ranges include both calendar dates in **America/New_York**. It does not rely on the viewer's timezone.
- The explicit `gpAdminPreviewAccessDecision` helper is admin gated. Do **not** add it as an unauthenticated public endpoint.
- No policies are activated and nothing is written to Google Sheets by the test.

## Critical blockers before actual password ON/OFF behavior
1. Existing GitHub Pages public files `portfolio/`, `personal/`, `resume/` and `data/` must be removed from public publishing and sensitive content/history reviewed. JS password popups cannot secure them.
2. The direct Kajus Questions Google Apps Script /exec remains accessible; it needs upstream authorization enforced before Birthday protection can be represented as real.
3. Plan a *separate explicit public content endpoint* for intentionally unprotected periods; use carefully curated allowed fields and server checks on **each** request, without sharing private Drive files.
4. Implement cache invalidation, conflict resolution, audit integrity/backups, quota/rate-limiting, and admin-credential hardening.
5. Test unauthorized requests, wrong workspace token, expired token, invalid JSON, Date boundary/NY DST, rule cancellation, and transition back to protected.
6. Only after end-to-end security validation should an explicit later release enable enforcement.

No changes to live website navigation or Birthday content in this phase.
