# Phase 18G: Kajus Questions protected staging

**Private source ZIP** is delivered to the owner directly in ChatGPT, rather than adding original quiz source and media to this public repository.

## Scope
- Keep live Kajus Questions Apps Script and the GitHub Birthdays iframe unchanged.
- Edit the independent **Kajus Questions - Staging** Apps Script copy only.
- Preserve original Index.html, Styles.html and Assets.html; use modified Code.gs and Scripts.html plus new BirthdayGate.gs from the private ZIP.
- The new Birthday workspace password is separate from the existing quiz participant login. Server quiz RPCs check workspace access with a 30-minute staging token and re-read the Birthdays policy each request.
- Audit lookup uses New York dates, cancellation rules and fail-closed errors.
- During password OFF periods, participant login still applies.
- Web-app HTML and JS presentation remain downloadable; quiz data operations are gated server-side.

## Before testing
1. Back up the staging project.
2. Copy the six project files in the ZIP as described in its README_STAGING.md.
3. Delete destructive maintenance/test files and the obsolete BirthdayGatewayStaging.gs from the staging copy before web deployment.
4. **Use copies of all five Google Sheets**, not the live Questions, Responses, Saves, Scores, Users sheets; update staging Script Properties with copies' IDs.
5. Set KQ_POLICY_AUDIT_SHEET_ID to existing admin audit spreadsheet (restricted, staging owner read permission).
6. Set a temporary unique 16+ character KQ_GATE_SETUP_PASSWORD in staging Script Properties, run initializeBirthdayStagingPassword in Apps Script, then ensure plaintext property is gone.
7. Run testBirthdayGatePure (no Sheets writes).
8. Once setup checks pass, create a **new deployment only in the staging project**; never update the existing live deployment or GitHub iframe.
9. Test ON/OFF, direct staging exec URL, bad password, expired access, participant register/login, saves, downloads, submission and leaderboards using synthetic staging data.

## Limitations
This is an untested staging candidate, not a production-ready password architecture. Separate Birthday password needs later unification or deliberate policy. Rate limiting and cryptographic password derivation need hardening. Do not claim existing public quiz is protected.