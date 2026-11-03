# Public Game Show media

These files are served by GitHub Pages, not Google Apps Script or Google Drive.

Use one folder per member (lowercase member names). Upload these exact filenames where available:

- `intro.gif` — welcome animation
- `outro.gif` — thank-you animation
- `animal.png` — transparent PNG that may appear in Bounce

Other formats may be used later with a matching manifest reference. Optimize animations before uploading.

**Important:** This is a public repository. Never upload private images, API keys, passwords, or survey data.

To add a PNG animal to the Bounce rotation, add its **published** URL path to `animals.json` (example: `/assets/media/kaushik/animal.png`). Keep unuploaded files out of that manifest: otherwise the browser makes unnecessary requests. The current fallback uses randomized animal emojis without any downloads.

The scripts for the surveys should eventually use direct GitHub Pages URLs for `intro.gif` and `outro.gif`, and not read binary media from Sheets or embed Base64 in HTML.
