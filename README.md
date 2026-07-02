# Boekweit Transport — Website

Static, dependency-free redesign of the Boekweit Transport B.V. marketing site. Plain HTML/CSS/JS, no build step.

## Structure

```
index.html               Home
diensten.html             Services (all 10, one page)
historie.html             Company history
certificeringen.html      Certifications & permits
downloads.html            Documents
contact.html               Contact form + map
css/style.css              Shared design system
js/main.js                 Hero slider, nav, scroll-reveal, counters
assets/images/              Site imagery (logo, hero photos, service photos)
tests/check-links.js       Zero-dependency checker: verifies every local href/src
                            and #anchor across all pages resolves to a real file/id
```

## Run locally

No build tooling required — any static file server works:

```bash
npm start
# or: python -m http.server 8080
```

Then open http://localhost:8080.

## Tests

```bash
npm test
```

Walks every `*.html` file and confirms all local links, stylesheets, scripts,
images, and same-page/cross-page `#anchor` targets actually exist. Runs
automatically in CI on every push/PR via `.github/workflows/test.yml`.
