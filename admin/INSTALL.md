# Phase 15 — Admin login staging (NOT an access policy system yet)

This PR adds a separate ADMIN credential mechanism and a GitHub-hosted /admin/ page. **No access policy can be changed yet**; all controls and calendars are still pending. Do not expose admin login to actual use until it has passed security review and deployment testing.

## Manual steps in EXISTING Google Apps Script project
1. Add the code from `admin/backend/AdminAuth.gs` as new `AdminAuth.gs` script file. Keep `AuthService.gs`, `PasswordRecovery.gs` and other workspace files unchanged.
2. In `BrowserApi.gs`, inside the existing `switch(action)` add the following cases before default:

```javascript
case 'adminLogin':
  data = gpAdminLogin(String(r.email || ''), String(r.password || ''));
  break;
case 'adminStatus':
  data = gpAdminStatus(String(r.token || ''));
  break;
case 'adminLogout':
  data = gpAdminLogout(String(r.token || ''));
  break;
```

NOTE: The existing `doPost` first evaluates `gpWorkspace_(r.workspace)` for **every** request, so the admin page sends `workspace:'Portfolio'` as a syntactic requirement. It does NOT authenticate the admin as Portfolio; `gpAdminRequire_` enforces separate admin credentials. Later backend refactor should eliminate this unnecessary workspace coupling.

3. Script Properties, temporarily set:
   - `GP_ADMIN_SETUP_EMAIL` = chosen admin email (do not share in GitHub/chat)
   - `GP_ADMIN_SETUP_PASSWORD` = unique password, 16–256 chars, not a workspace password.
4. In Apps Script editor, run `setupAdminCredentials`. This deletes the temporary plaintext properties (even if input validation fails), hashes the password, increments version, and invalidates prior admin sessions. Confirm temporary properties are absent. **Do not paste credentials into chat or source.**
5. Review AdminAuth security; then deploy a new version of the existing web app (same /exec URL), only after testing non-admin content access remains protected.
6. The working Worker `SCRIPT_URL` stays unchanged if the same deployment ID is reused.
7. Admin login can be tested after this PR merges to GitHub Pages at `/admin/`; there is no admin icon on homepage yet, pending a working backend test.

## Security notes
- The custom existing gpPasswordHash_ (iterative SHA256) is not Argon2id/PBKDF2 with conventional work factors; strengthen hashing before production use. Do not treat this as production-grade hardened authentication.
- Admin password-reset/recovery is NOT implemented: an owner can rotate the password by rerunning setup manually in Apps Script.
- Logins have a global Script Properties-based lockout (6 failures, 15 minutes) under Script Lock. Malicious actors can intentionally lock admin out; consider WAF and bot controls.
- Sessions are CacheService-based (30 minutes), short-lived, and stored in JS memory in the browser. No JS or server logs should contain tokens or passwords.
- Changing a workspace's protection policy must ALWAYS be enforced by backend. A UI toggle alone is not access control.
- Google Drive content remains Restricted. Birthdays' direct quiz URL remains accessible and is NOT protected.
- Old Portfolio and Personal direct GitHub URLs/data/history are still public.
- This PR does NOT implement audit sheets, date range rules, calendar, access-policy on/off, or scheduled actions. No live permissions change.

## Next development
Implement durable, auditable server-side policy tables and immutable change log; test schedule precedence, timezone and wrong-workspace access. Then add the admin UI controls and calendar, then enforce real Birthday protection at its upstream service, and only then turn on admin icon and access controls.
