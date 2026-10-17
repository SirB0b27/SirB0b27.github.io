# Birthday quiz cutover gate — DO NOT MERGE YET

This branch changes exactly one destination: the iframe in `birthdays/index.html` from the current live Kajus Questions web app to the **staging** protected deployment. It preserves the original fullscreen layout, navigation, colors, and quiz HTML.

**IMPORTANT: The staging spreadsheet copies retain participant data and are NOT approved as a production destination. This branch must remain DRAFT and MUST NOT BE MERGED as-is.** GitHub Pages is public, so merging exposes the staging quiz entry URL in the public site.

Before a production-ready pull request:
1. Make a separate, backed-up production-ready deployment in the Kajus Questions backend, with real production Sheets only after reviewing all Apps Script RPCs for authorization and user data exposure. Keep the old production deploy intact for rollback.
2. Verify Birthday ON and OFF with a new anonymous browser, direct `/exec` access, authenticated participant sessions, save/reload, submit/score/leaderboard and both policy transitions.
3. Assess how the independent Birthday workspace password fits with the other workspace auth; shared secrets and unprotected admin policy rules are not sufficient.
4. Review unauthorized direct server function calls, rate limiting, test files, sheet sharing permissions, failure mode when Admin policy Sheet is unavailable, and client-side content confidentiality. Be aware Apps Script HTML is served before any quiz RPC checks.
5. Replace the staging URL in this branch with the audited **production protected** deployment URL, then merge.
6. Check `/birthdays/#questions` in a real browser and confirm the existing original legacy quiz URL is no longer linked publicly. Existing old `/exec` still needs disabling/retiring: removing its link does not prevent direct access.
7. Preserve rollback instructions and never overwrite the original deployment until the replacement has been validated.

The admin calendar rule preview is distinct from true production enforcement. This staging deployment has passed limited user smoke tests, not a formal security review.
