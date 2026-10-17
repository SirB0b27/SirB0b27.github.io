# Phase 18F — Kajus Questions source review and staging gateway

Based on the user's uploaded `Kajus Current Script.zip` (9 files). The original script is not changed.

## Original source inventory
- `Code.gs`: single `doGet()` returns `Index` as an embeddable page with `ALLOWALL`. There is no workspace-access check at the HTML entrypoint.
- `Index.html` includes `Styles.html`, `Assets.html`, and `Scripts.html`.
- `Assets.html` contains roughly 1.9 MB of inline assets; preserve it verbatim.
- `Scripts.html` uses `google.script.run` to invoke server functions for account registration, login, questions, saves, submissions, score/leaderboard interactions.
- Quiz's **participant** authentication is separate from **workspace** access. `session_(token)` reads a six-hour, 64-character participant token from this script project's CacheService; private workspace tokens are different and are not available in this project's CacheService.
- `Code.gs` includes `registerParticipant`, `loginParticipant`, `getQuestionBank`, `getMySave`, `saveMyProgress`, `submitMyResponses`, `getMySubmission`, `recordMyScore`, `getMyLeaderboard`; these must all be protected by any eventual enforcement.
- `BackendTests.gs`, `CleanupTests.gs`, `ResetAll.gs`, `WebTest.html` should be reviewed separately; **do not run destructive/reset functions** during migration.
- The quiz uses separate question, response, save, score and user Sheets.

## Safe staging instructions (no live deployment)
1. In the Apps Script editor for Kajus Questions, use **Make a copy** to create a distinct staging project. Check that the copy is NOT deployed to the existing live `/exec` and do not call setup, cleanup, or reset functions.
2. In the **copy only**, add `BirthdayGatewayStaging.gs` from this repository.
3. Save and run `testKqBirthdayStagingGate`. Expected log: `PASS: Birthday quiz staging policy parity. No actual visitor access changed.`
4. Optional read-only integration check: add script property `KQ_POLICY_AUDIT_SHEET_ID` to the existing Admin policy audit Spreadsheet ID (not a publicly shared spreadsheet). The executing account needs read permission. Run `kqGatePreviewStatus_` via a temporary editor wrapper only if desired; do NOT expose as a public `google.script.run` API.
5. No `doGet`, HTML, frontend or server quiz API is modified; **the working questionnaire remains open as before**.

## Next code integration — not included in this PR
- Choose a genuine, server-verified Birthday access credential for **protected ON** periods; do not put a shared secret or private-workspace bearer token in iframe URLs or JavaScript.
- When protection ON, direct `/exec` loads should show a workspace sign-in gate, without serving sensitive quiz state.
- Validate access on **every quiz RPC**, including registration and participant login and all saved response/leaderboard functions; participant login alone is not an authorization grant.
- Handle policy OFF periods safely and evaluate policy at time of each protected operation, including reactivation after a date window.
- Avoid linking two different Apps Script caches as if they were shared. A session design must work across the existing public GitHub iframe and Apps Script redirects.
- Test saved progress, submission, scores, reset safety, OAuth scopes, iframe embedding and direct `/exec` before cutover. Keep an unchanged live deployment for rollback.

## Limitations
This PR is a **staging policy parity utility**, not a functioning protected questionnaire. It must never be interpreted as enabling password protection or fixing the publicly accessible quiz URL.
