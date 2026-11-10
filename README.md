# PULPO Production — website

A hand-written rebuild of the Wix Studio site (`margoalss0.wixstudio.com/my-site-3`) as plain HTML, CSS and JavaScript. No framework, no build step: what you edit is what gets deployed.

## Quick start

```bash
npm run fetch-images   # one time: downloads the photos and partner logos from Wix into ./images
npm run dev            # local preview at http://localhost:3000
```

Node 18+ is only needed for those two helper commands. The site itself is static files.

## Project structure

```
index.html              all page content (text, images, links) — edit copy here
css/styles.css          all styling; colours and fonts are tokens at the top (:root)
js/main.js              mobile menu, sticky-stack sizing, fade-in on scroll
images/                 illustrations included; photos and logos added by fetch-images
scripts/fetch-images.mjs  maps each local image name to its Wix media id
```

## Common edits

| Want to… | Do this |
|---|---|
| Change a colour everywhere | Edit the variable in `:root` at the top of `css/styles.css` |
| Change fonts | Swap the Google Fonts `<link>` in `index.html` and `--font-display` / `--font-body` |
| Edit a service | Each one is a `<section class="service …">` block in `index.html` |
| Add/remove gallery photos | Add or delete a `<figure>` inside `.gallery-grid` (any aspect ratio works) |
| Add a partner logo | Add an `<li>` to `.logo-row` |
| Change the stats | Edit the `.spotlight` block |
| Change the stacking strips | `--stack-step` in `css/styles.css` (24px desktop, 16px mobile); each section's order is its `style="--stack:N"` in `index.html` |

## Placeholders to fill in

These were template leftovers on the Wix site:

- **Instagram / LinkedIn** links in the footer pointed to Wix Studio's own accounts — they are `#` now (search for `TODO`).
- **Terms / Privacy / Cookie** were plain text with no pages behind them — linked to `#` for now.
- **"GET TICKETS"** button scrolls to the contact section; change the `href` if it should go to a ticketing page.
- **Copyright** read "© 2035 by Name of Site" — it now shows the current year and "PULPO Production".

## Deploying

Live at **https://pulpoproduction.com**, hosted on Cloudflare Pages and connected to the GitHub repo `nzhang05/pulpo`.

Every push to `main` redeploys automatically (about a minute):

```bash
git add -A
git commit -m "Describe the change"
git push
```

Cloudflare Pages build settings: framework preset **None**, no build command, output directory `/`.
