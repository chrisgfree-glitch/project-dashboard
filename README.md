# Project Dashboard

A small installable web app that shows completion estimates for active projects.

Live data lives in [`data/projects.json`](data/projects.json). Edit that file and redeploy to update percentages, status, next steps, and links.

## Install on a phone

- **iPhone:** Open the live site in Safari, tap Share, then Add to Home Screen.
- **Android:** Open the live site in Chrome, tap the menu, then Add to Home screen or Install app.

## Develop

This is static HTML, CSS, and JavaScript. Any static file server works:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.
