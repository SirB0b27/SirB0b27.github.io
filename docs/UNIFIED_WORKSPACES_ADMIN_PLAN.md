# Unified navigation and admin access scheduler — implementation contract

## User-required interface
- Keep `index.html` ("Choose a workspace" 3 cards) as final home.
- Put GitHub and LinkedIn icon links at its upper right (staged in this PR).
- Add an admin/user icon at upper left ONLY when a real secured admin login and dashboard exists.
- Keep the ORIGINAL Portfolio header, collapsible sidebar, icons, styling and interactions — never replace with generic cards. Reuse analogous shell on Personal and Birthdays.
- Include Home, Portfolio, Birthdays, Personal in all workspace sidebars. Selecting a protected workspace shows its GitHub-hosted login form; no Apps Script iframe or redirect/banner.
- Portfolio and Personal are currently authenticated in a GitHub /private flow; Birthdays public Kaju iframe is currently accessible. Make Birthday protection effective only after its public direct URLs and upstream quiz are addressed.

## Admin behavior
Admin credentials are SEPARATE from workspace credentials. Admin authentication, authorization, sessions, CSRF/origin defense and throttling must be fully server-side. Never store admin credentials, passwords, tokens, reset codes, or private schedules in public GitHub JS. Provision admin email/password privately in Apps Script deployment properties via a reviewed setup procedure. Do not use a bypass flag in front-end code.

Admin dashboard sections:
1. Current access status (Portfolio / Personal / Birthdays) and effective next policy change.
2. Add/edit/revoke policy: workspace, protect ON/OFF, indefinite vs date range, start/end inclusive, local timezone `America/New_York`; date-range UI appears only when indefinite is OFF. Dates future/present; validate start <= end.
3. Audit/change log table with actor, server timestamp, workspace, previous and new policy, effective interval, reason, unique immutable event ID. Edits append new events instead of overwriting log. Do NOT log passwords/tokens.
4. Calendar month/week view, visualizing effective public/unprotected periods and changes.
5. Explicit warning before disabling authentication. Protected data remains restricted in Google Drive even when access policy is OFF; the backend decides whether to expose it.
6. Restore default policy (all protected by default) and emergency revoke/lockdown.

## Policy evaluation contract
- Default: Portfolio and Personal protected; Birthdays depends on audited migration state and must not falsely advertise protection until quiz upstream access is gated.
- Support policies with `mode: "indefinite"` or `mode: "date-range"`.
- Evaluate every content request on the SERVER, not only on page navigation. A scheduled OFF policy grants appropriately scoped public READ access only for its effective interval. A separate ADMIN session is always required to modify policy. All mutations and their previous/new values are append-only audit records.
- Clearly define precedence for overlapping schedules: newest approved policy by `effectiveAt` then sequence; avoid accidental overlaps via validation.
- Clock source: backend server UTC now; convert selected dates to America/New_York calendar-day boundaries (DST aware). End date inclusive until next local midnight.
- On policy transition to ON, invalidate/ignore previous public access grants immediately. Cache policy no longer than a small approved TTL; prohibit caching private responses.
- Separate 'visibility' from 'authentication': switching password OFF does not make existing raw Drive files public or erase security controls; only backend-authorized and intentionally public fields return.
- Birthday upstream Google Apps Script quiz endpoint must enforce policy server-side or be configured to disallow direct bypass. A password prompt in GitHub alone CANNOT protect a public quiz /exec URL.

## Recommended storage
Google Sheet **Workspace Access Audit** (append-only): event_id, server_timestamp_utc, actor_id, action, workspace, protected, mode, start_date, end_date, previous_policy_json, new_policy_json, reason.
Google Sheet **Workspace Access Policies** (current evaluated state): rule_id, workspace, protected, mode, start_date, end_date, created_at, created_by, superseded_at, revision.
Use spreadsheet IDs stored only in server-side Apps Script properties. LockService for atomic event append and policy revision; admin authorization on every read/mutation. Consider quota and race conditions.

## Security and migration blockers
- Current GitHub repository contains legacy publicly accessible Portfolio, Personal, Resume and data files. Authentication on /private DOES NOT protect them.
- Even deleting public files won't erase Git history, forks or archives. Perform sensitive-content audit.
- Current Birthdays quiz has its own functioning Apps Script backend; don't break it. If a policy requires real Birthdays access protection, integrate enforcement with that upstream service (or put it behind server-side authenticated access), not a cosmetic client-side gate.
- Admin email/password has not yet been provided/configured; do not guess or commit.
- Backend admin API, audit Sheet, policy evaluation and calendar UI are NOT implemented by this PR.
- No home or sidebar link cutover until functional, security, and browser tests pass.

## Incremental rollout
A. Home icon links + final navigation and admin requirements (this PR; no access policy change).
B. Shared nav on protected Portfolio/Personal and Birthdays using original shell; preserve current Kaju app.
C. Admin auth provisioning and protected service API; immutable audit store; policy tests.
D. Admin dashboard with indefinite/date-range controls and calendar; isolate staging environment.
E. Policy enforcement on each backend request; Birthdays direct-bypass closed; tests for DST, overlap, expired policy, workspace isolation, anonymous access, and rollback.
F. Cut over homepage workspace links only after original UI + content migration completed; remove old exposed content and assess history.

