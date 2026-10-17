# Phase 18B — Public route and bypass audit (no live changes)

Verified after PR #21 merged. This audit deliberately does not change working routes, login, the public Birthday quiz, or GitHub Pages deployment.

| Route / data | Current exposure | Migration requirement |
|---|---|---|
| `/` | Public home. Portfolio/Personal links still point to Apps Script HTML app | Switch to GitHub-hosted login only after complete migrated views function |
| `/private/` | GitHub-hosted login, protected starter model view | Keep for preview; do not treat as sole gate |
| `/private/portfolio/` | Uses original Portfolio markup and renderers; reads authenticated Drive models | Verify session expiration, authorization, XSS and all menu links |
| `/portfolio/` | Legacy client-side sessionStorage gate | Remove direct public data dependencies and legacy auth; otherwise bypass |
| `/personal/` | Legacy client-side sessionStorage gate, public `data/personal-analytics.js` | Migrate original Personal UI and all content to authenticated backend before cutover |
| `/resume/` | Public HTML loads `data/portfolio-data.js` | Migrate protected resume, photo/media and print/export functionality |
| `/birthdays/` | Public navigation iframe points to quiz Apps Script /exec | Password prompt on GitHub alone cannot protect direct /exec. Change upstream quiz to require verifiable backend authorization or keep Birthdays explicitly public |
| `/data/portfolio-data.js`, `/data/education-catalog.js`, `/data/personal-analytics.js` | Static public JavaScript on Pages | Stop publishing these after validation; audit existing Git history and forks separately |

## Safe release gates

1. Inventory all direct URLs, attached media and every JS fetch/iframe/embed. Review whether any actual secrets or sensitive data are already public; deletion from tip does not remove history.
2. Complete original Personal and Resume page rendering against authenticated Drive models, preserving original appearance. Do not replace with generic cards.
3. Review the Birthday Apps Script project and design session/policy checks at the *quiz backend*. Do not change its working questionnaire until staging validation is complete.
4. Implement a separate carefully scoped public-read response for OFF policy periods. Never substitute a fake client-side bypass or publicly share private Drive files.
5. Make server-side enforcement apply to each protected request; verify policy ON/OFF at the scheduled New York boundaries, revocation, rate limits and cached sessions.
6. Test navigation and direct links in private/incognito browsers. Reject missing/wrong-workspace/expired tokens; test public OFF path and immediate ON revocation.
7. Plan a coordinated cutover of homepage links, direct routes, assets and backed-up rollback; separate the public Git history exposure review.

## Current conclusion

PR #21 only tested access decisions. No existing public URLs are protected by those tests. Birthday remains public. The admin calendar continues to record preview rules only.
