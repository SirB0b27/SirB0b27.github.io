# Original Personal workspace — authenticated preview

- Reuses original Personal HTML/CSS and original Personal Analytics rendering logic, including navigation, charts, tables and themes.
- Loads Personal Analytics JSON using the server-authorized `action:model` endpoint after existing GitHub-hosted login.
- Routes login at `/private/?workspace=Personal` to `/private/personal/#home`.
- Does **not** import public `data/personal-analytics.js` into the protected preview.
- The original College Projects tabs remain visible, but assignment iframe previews and external assignment links have been intentionally disabled in this preview until each assignment file can be moved to authenticated storage. This avoids claiming public GitHub assignment pages are private.
- This is NOT a production privacy cutover. Existing public `/personal/`, assignment URLs, and `data/` remain accessible, as does public Git history.
- Token handoff uses same-origin sessionStorage as the existing Portfolio preview. Review XSS risks and session lifecycle before production.
- Existing `/private/portfolio/`, `/birthdays/`, homepage and Apps Script source are unchanged.

## Manual test after GitHub Pages publishes this PR
1. Sign in at `/private/?workspace=Personal`. Confirm redirect to `/private/personal/#home`.
2. Verify the original Personal navigation, Analytics charts/tables, theme controls and zoom.
3. Open College Projects; tabs and descriptive placeholders should be present but assignment content is intentionally unavailable.
4. Check expired/missing token returns to the GitHub-hosted Personal login.
5. Ensure the existing public Personal page and Birthdays continue working. Never paste tokens or passwords into issues or chat.
