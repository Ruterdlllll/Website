# Ipê — Brazilian Jewelry Store

Interactive design prototype for Ipê, a Brazilian handcrafted jewelry brand. Built as a self-contained
HTML "Design Component" — `support.js` loads React, ReactDOM and Babel from unpkg at runtime and renders
`index.html` client-side. No build step, but also no backend: cart, wishlist and checkout are all
in-memory demo state.

## Status: prototype, not production

This is a clickable mockup for reviewing design direction. Before treating it as a real storefront it
still needs:

- A real checkout flow (the "Checkout" button currently has no handler) and a payment processor
- Working footer pages (Sustainability, Contact, Journal, Shipping, Returns, Warranty)
- A privacy policy / cookie notice / terms (the brand copy is Netherlands-based, so GDPR applies)
- Server-rendered or static HTML instead of client-side Babel/JSX, for SEO and faster first paint

## Files

- `index.html` — the storefront (Home / Shop / Product / About / Cart)
- `support.js` — the runtime that parses and renders `index.html`

## Viewing locally

```bash
python3 -m http.server 8000
# or: npx serve .
```

Then visit `http://localhost:8000/`.
