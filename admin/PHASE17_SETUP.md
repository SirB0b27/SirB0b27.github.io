# Phase 17: Admin policy preview dashboard (not enforcement)

PR adds a form (password On/Off, indefinite or date range), view of policy events, cancellation, and monthly calendar. **All rules are preview/audit only: they do NOT alter live access.**

## Manual Apps Script change
Make sure you have `AdminPolicies.gs` from merged PR #16 and the private audit spreadsheet configured.

In the existing `BrowserApi.gs` `switch(action)`, add these three cases before `default`:

```javascript
case 'adminPolicyStatus':
  data = gpAdminPolicyStatus(String(r.token || ''));
  break;
case 'adminPolicyAdd':
  data = gpAdminPolicyAdd(String(r.token || ''), r.rule);
  break;
case 'adminPolicyCancel':
  data = gpAdminPolicyCancel(String(r.token || ''), String(r.ruleId || ''), String(r.reason || ''));
  break;
```

Do not add any unauthenticated API variant. These functions enforce `gpAdminRequire_` in Apps Script.

Save and deploy a **new version of the existing web app**. Keep the same deployment ID/URL and the Google Sheet restricted.

## Test
1. Go to `/admin/`, sign in with the separate admin credentials.
2. Confirm the initial Portfolio/Personal/Birthdays preview status loads and the calendar appears.
3. Record a date-range **OFF** Portfolio rule for a test period. Check a new row appeared in the private Sheet. This does NOT affect live login.
4. Select Indefinite, record another rule for Personal, verify it appears in the change log, and cancel it.
5. After logout, direct calls to the policy endpoints without admin tokens must return `ok:false`.
6. Check small/mobile screen layouts and dates including a DST boundary.

## Known limitations
- This is a staging preview; not the final production access calendar.
- Calendar uses the viewer browser's local date for labels, while backend policy evaluation uses America/New_York. Before enforcement, these must use a consistent backend-derived New York calendar.
- Competing/overlapping rules may produce unexpected precedence; assess and add overlap conflict warnings.
- A Google Sheet is editable and not cryptographically tamper-proof.
- Legacy Portfolio/Personal assets remain public; Birthday direct Apps Script quiz URL bypasses GitHub.
- Do not claim password Off changes public access until **every** protected content endpoint has server-side policy evaluation and upstream quiz protection.
