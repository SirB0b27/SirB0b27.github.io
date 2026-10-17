# Original Resume migration — authenticated preview

The preview at /private/resume/ copies the existing Resume HTML/CSS and the original Resume renderer/controls, including templates, zoom, editing, printing/export and the browser's IndexedDB photo library. It now initializes the original `PORTFOLIO_DATA` model only **after** a Portfolio session token has been verified by the Apps Script `model` endpoint.

Open the original Portfolio preview after logging in: `/private/?workspace=Portfolio`, then select Resume in its sidebar.

## Important limitations
- No back-end changes are needed for this preview. No login credentials are checked into GitHub.
- The Resume photo library uses the browser's existing IndexedDB and LocalStorage. Photos may persist locally; they are **not yet moved to protected Google Drive** and storage should not be assumed secure. Review before production.
- Direct public `/resume/`, `/portfolio/`, static data files, and historical GitHub content remain publicly reachable.
- Personal College Projects and Birthday access bypass are still pending.
- Session token is stored in sessionStorage for per-tab navigation, so production security review for client-side injection and session invalidation is still required.
- No live homepage or original public Resume page changed.

## Browser tests
- Verify login -> Portfolio -> Resume.
- Compare original Resume and new preview in the same desktop viewport: templates, colors, zoom, summary editing, print/PDF, exports.
- Test photo adding, selecting, and deleting in a clean separate browser profile; browser-local photo data is not a server-side media migration.
- Expired/missing Portfolio session redirects to GitHub-hosted Portfolio login.
- Original Birthday quiz unaffected.
