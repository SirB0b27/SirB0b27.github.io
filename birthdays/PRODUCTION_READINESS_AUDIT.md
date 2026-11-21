# Birthday production preparation — gate before PR #33

**Current state:** PR #33 is an unmerged DRAFT and changes the public GitHub iframe to the staging quiz URL. DO NOT MERGE PR #33 AS-IS.

## Source findings from the protected staging ZIP

- All nine main public quiz operations in Code.gs call bgRequire_(accessToken) before participant/data logic.
- Password-OFF access continues to require a participant session for participant-specific RPCs.
- The HTML entrypoint doGet() serves the application shell without a workspace-password check. Static frontend code is visible directly; sensitive server operations depend on per-call checks. Do not claim the HTML itself is secret.
- birthdayGateStatus() reads the Policy Events spreadsheet and fails closed on lookup errors.
- Birthday gate sessions use Apps Script CacheService, not the main Private Workspaces authentication sessions. Production will have a separate Birthday password unless deliberately unified.
- The gate uses iterated SHA-256 instead of a modern memory-hard KDF. It has a single global failed-login cache counter, which can lock out all visitors after repeated attempts. Review before release.
- Existing original public Apps Script /exec will remain reachable after simply replacing the iframe link. **Retire/restrict the old deployment separately**.
- Spreadsheet data in staging copies can still contain live participant records; do not promote those copies into a public production iframe.

## Read-only operational check

1. Add ProductionPreflight.gs to the **copied staging** Apps Script project, and run kqProductionPreflight from the editor.
2. This validates five distinct accessible quiz spreadsheets, required tabs, configured audit Sheet, and initialized password. It does not change Sheets and logs no IDs.
3. It does NOT prove those spreadsheets contain no personal data, cannot validate authorization bypasses, and does not update deployment.
4. Keep test and maintenance routines inaccessible or remove them before any production release.

## Production cutover gates

1. Confirm owner permissions and ensure all five production Sheets remain Restricted. Do not change spreadsheet IDs in the live project before a backup.
2. Prepare a production protected Apps Script **deployment** with updated Code, Scripts and BirthdayGate, keeping the old live deployment available only for rollback testing until cutover.
3. Run protected ON and OFF browser tests against a new deployment: direct URL, invalid password, correct password, revoked access, save/reload, submit, score, logout, and incognito.
4. Assess Apps Script public RPC attack surface and same-origin frontend injection. Avoid assuming the UI lock secures a backend function that lacks a server guard.
5. Ensure PR #33 references the verified **production** URL instead of the staging URL. Do not merge until deployment-level tests pass.
6. Remove/restrict the old unprotected deployment to close the direct /exec bypass; verify direct access no longer serves protected quiz data.
7. Document rollback and the impact of ON->OFF when a participant is mid-session.

## Deployment note
The user reported successful staging save/nav/policy transition tests. These are not a substitute for checking the final production deployment or direct URL bypass.

The Admin policy calendar is a recorded rule preview; the quiz staging backend independently reads the same audit events and applies them to its data operations. Other workspaces are not thereby activated.
