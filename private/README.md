# GitHub-native private workspaces — staged integration

This is an **unreleased prototype**, NOT a completed secure migration. The published home page still redirects to Apps Script, and the existing Portfolio/Personal GitHub files are still public.

## Architecture
- GitHub Pages renders the page shell, sidebar, login and sections.
- A Cloudflare Worker provides a same-policy-constrained HTTPS JSON bridge.
- The existing Google Apps Script handles **all** login, reset, logout and session checks. `gpGetWorkspaceContent` checks session before Drive reads.
- Protected JSON files remain **Restricted** in Google Drive.
- Do not embed Apps Script HTML or use an iframe. No Apps Script UI banner appears when only fetching JSON.

## Setup / test, in order
1. Add `private/backend/BrowserApi.gs` as a **new .gs file** in the EXISTING private workspace Apps Script project, keeping all existing files. Save. Do not share any passwords.
2. Deploy a **new version** of that Apps Script Web App, Execute as **Me**, access **Anyone** (only after security review). The web app must be remotely callable by the Worker; private Drive files must remain restricted. Each protected operation is authenticated inside Apps Script; deploying "Anyone" is not access control on its own.
3. Create a Cloudflare Worker using `private/backend/cloudflare-worker.js`; configure its `SCRIPT_URL` as a Worker secret/binding with the Apps Script **/exec** URL. Do not put credentials in Worker or GitHub. The Worker code can be public; the binding value is deployment config.
4. Set `API_URL` in `private/index.html` on this **feature branch** to the Worker HTTPS URL; leave it empty until the Worker is deployed. The current page intentionally refuses to send passwords without a configured endpoint.
5. Test the Worker/API in a test environment: valid and invalid Portfolio/Personal login, switching workspaces, expired token and wrong-workspace token rejection, password recovery and code expiration, logout, unexpected actions, oversized request, revoked session, and anonymous content request.
6. Migrate portfolio and personal data from public GitHub JS into the Drive JSON schema. Current ContentService strips everything other than title, subtitle, sections, paragraphs and items — full navigation, interactive charts, resume files and media need additional authenticated endpoints and migration work.
7. Only after all tests pass, replace the current home links with `private/?workspace=Portfolio` and `private/?workspace=Personal` and merge. Do not remove the existing GitHub pages before verifying the new UI retains all required functionality.

## Security / operational cautions
- GitHub Pages is public and cannot enforce private access itself. Never commit protected content, raw credentials, session tokens, reset codes, API secrets or authenticated response caches.
- The browser keeps the token only in JS memory. Reloading prompts a new login. A token may be exposed to other JS executing on the same page; review scripts, CSP, browser extensions and dependencies before production.
- Origin filtering is **not** an authentication control. Script authentication and authorization must remain server-side. The Worker must not cache replies or log request bodies.
- Apps Script's CacheService is not a robust production-grade session database or globally durable rate-limit store. Assess scaling and abuse resistance before making the service public.
- Deleting files from the latest GitHub commit does not erase public Git history, forks or archives. Audit data exposure and consider rotating compromised secrets.
- A JSON POST forwarded to Apps Script may encounter Google redirect behavior; verify end-to-end Worker runtime before any production cutover.
- This stage has not been browser or live backend tested. The GitHub UI is an initial shell and does **not** reproduce all existing portfolio/personal screens.

## Recovery and rollback
Until full cutover, live GitHub home remains unchanged; rollback means do not merge this branch. If a future cutover fails, revert the homepage link commit and disable the Worker.
