#!/usr/bin/env node
/**
 * Zero-dependency static-site checker for Boekweit Transport.
 * Walks every *.html file in the repo root and verifies:
 *   - every local href/src (css, js, images, other pages) resolves to a real file
 *   - every "#id" / "page.html#id" fragment target actually exists in the DOM
 *   - every <img src="..."> resolves to a real file
 * External links (http/https), mailto:, tel:, and bare "#" placeholders are skipped.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

const ATTR_RE = /\b(?:href|src)="([^"]*)"/g;
const ID_RE = /\bid="([^"]+)"/g;

let errors = 0;
let checked = 0;

function isSkippable(ref) {
  return (
    ref === '' ||
    ref === '#' ||
    ref.startsWith('http://') ||
    ref.startsWith('https://') ||
    ref.startsWith('//') ||
    ref.startsWith('mailto:') ||
    ref.startsWith('tel:') ||
    ref.startsWith('javascript:') ||
    ref.startsWith('data:')
  );
}

function idsIn(file) {
  const content = fs.readFileSync(file, 'utf8');
  const ids = new Set();
  let m;
  while ((m = ID_RE.exec(content)) !== null) ids.add(m[1]);
  return ids;
}

const idCache = new Map();
function getIds(file) {
  if (!idCache.has(file)) idCache.set(file, idsIn(file));
  return idCache.get(file);
}

for (const htmlFile of htmlFiles) {
  const fullPath = path.join(ROOT, htmlFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  let m;
  while ((m = ATTR_RE.exec(content)) !== null) {
    const ref = m[1];
    if (isSkippable(ref)) continue;
    checked++;

    const [filePart, hashPart] = ref.split('#');

    // Same-page fragment: "#autolaadkranen"
    if (filePart === '') {
      if (!getIds(fullPath).has(hashPart)) {
        console.error(`[BROKEN ANCHOR] ${htmlFile}: #${hashPart} not found in this page`);
        errors++;
      }
      continue;
    }

    // Local file reference (page, css, js, image)
    const targetPath = path.join(ROOT, decodeURIComponent(filePart));
    if (!fs.existsSync(targetPath)) {
      console.error(`[MISSING FILE] ${htmlFile}: "${ref}" -> ${filePart} does not exist`);
      errors++;
      continue;
    }

    // Cross-page fragment: "diensten.html#autolaadkranen"
    if (hashPart && filePart.endsWith('.html')) {
      if (!getIds(targetPath).has(hashPart)) {
        console.error(`[BROKEN ANCHOR] ${htmlFile}: "${ref}" -> id="${hashPart}" not found in ${filePart}`);
        errors++;
      }
    }
  }
}

console.log(`Checked ${checked} local references across ${htmlFiles.length} HTML files.`);
if (errors > 0) {
  console.error(`\n${errors} broken reference(s) found.`);
  process.exit(1);
} else {
  console.log('All local links, assets, and anchors resolve correctly.');
  process.exit(0);
}
