# College Projects — interactive compatibility preview

The Personal / College Projects view loads five existing public IT201 assignment entry pages into separate iframes. It keeps inactive frames mounted to avoid restarting UI state when switching tabs.

**This is an interactive compatibility preview, NOT a privacy or backend migration.** All original `/IT201/` files remain published on GitHub Pages and may be opened directly. The `window.__collegeProjectsUnlocked` flag is a convenience guard for existing wrappers, not authentication. The parent Personal model login does not protect the underlying assignment source or data.

## Source audit (verified repository)
- Assignment 1: public `MyFirstHTML.html`, heritage webpage. Browser-rendered.
- Assignment 2: public `smileGalore.html`, CSS and `sg.js`, form validation/account verification; includes hardcoded sample credential examples.
- Assignment 3: browser-based reconstruction of PHP/MySQL database tables, sample patient/appointment data, tabs; **not** the original PHP backend.
- Assignment 4: browser session-only compatibility dental account and appointment workflows, **not** original PHP/MySQL.
- Assignment 5: localStorage-based browser chat demo, **not** real-time multi-user chat; original server-side Chat/Core implementation missing.

## Test after merging
1. Sign in via `/private/?workspace=Personal` then open College Projects.
2. Click assignments 1–5. Confirm each page renders and its own controls work.
3. Assignment 2: test form validation. Assignment 3: patient/appointment tabs. Assignment 4: registration/scheduling/cancel. Assignment 5: send/clear message.
4. Switch away from and back to assignment 5: draft state should persist in the mounted iframe; stored chat data persists in same browser.
5. Confirm original Personal Analytics, Portfolio, Resume and Kajus Questions unaffected.

## Required before genuine protected/production deployment
- Decide whether source code for each browser-delivered interactive assignment is allowed to be public. Client JavaScript sent to browsers cannot be secret.
- Remove any sample password or patient-like records that should not be public. Audit current static URLs and Git history.
- For private server data/actions, implement authenticated API operations at the backend and migrate the interactive frontends to those APIs.
- Rebuild the original PHP/MySQL or chat services only if exact original behavior (versus compatibility demos) is required; confirm APIs, schema and missing server-side dependencies.
- Remove/replace public direct routes only after each protected replacement is complete and tested.
