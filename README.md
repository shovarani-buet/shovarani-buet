# Shova Rani — Academic Portfolio

A static, dependency-free academic website for GitHub Pages. No build step, no framework,
no third-party requests — plain HTML/CSS/JS.

## Structure

```
index.html         Home (hero only)
academics.html     Education, thesis, projects, industrial attachment
research.html      Interests, positions & supervisors
publications.html  Papers, posters & articles (incl. abstract modals)
projects.html      Applied engineering work
experience.html    Positions & training
awards.html        Honors & recognition (filterable)
skills.html        Technical & professional skills
leadership.html    Leadership & volunteering
story.html         From Brahmanbaria to BUET + press coverage
gallery.html       Full categorized photo gallery with lightbox
cv.html            Embedded CV preview + download + crawlable outline
contact.html       Contact info & referees
404.html           Custom not-found page
assets/
  css/site.css     All styling (design tokens, layout, dark mode, print)
  js/site.js       All behavior (~250 lines, no dependencies)
  fonts/           Unused — the site renders in Georgia (system font), no self-hosted fonts
  docs/            shova-rani-cv.pdf (the downloadable CV)
  img/             Processed photos (-800.webp / -1600.webp / -800.jpg fallback)
  video/           capstone-3d-simulation.mp4 (click-to-play, not autoloaded)
assets_raw/        Original, unprocessed source photos and the source CV — kept
                   as a reference; not linked from any page. Safe to keep private
                   or remove from the deployed site if you don't want raw files public.
```

Every page shares the same header/nav/footer markup (13 nav items, one page per section) and
loads the same `assets/css/site.css` / `assets/js/site.js`.

## Publish status

- Live at: https://shovarani-buet.github.io/shovarani-buet/
- Canonical URLs, Open Graph tags, `robots.txt`, and `sitemap.xml` already point there.
- If you'll use a **custom domain**, add a `CNAME` file at the repo root containing just
  the domain (e.g. `shovarani.com`), and update the URLs above to match.
- `assets_raw/` still holds the original CV and untouched photos, published as-is in the repo.

## Common updates

- **Add a publication**: duplicate a `.pub-card` block in `publications.html` under the right
  `.pub-group` (Conference Papers / Under Review / Posters / Magazine Article), and add a
  matching `<dialog class="modal" id="modal-...">` block further down the same file for its
  abstract + citation text.
- **Add an award**: duplicate an `.award-item` block in `awards.html`. Set
  `data-award-cat` to one or more of `academic scholarship athletics debate leadership`
  (space-separated) so it responds to the filter chips.
- **Swap the portrait**: replace `assets/img/portrait/shova-portrait-*.webp` (keep the
  same filenames, or update the `<img src>` in the hero section of `index.html`). The
  portrait renders as a circle (`border-radius: 50%` via `.hero-portrait` in `site.css`).
- **Add a gallery photo**: drop a processed image into the right `assets/img/<category>/`
  folder, then add a matching `<button data-lb-open data-full="..." data-caption="...">`
  block in `gallery.html`.
- **Update the CV file**: replace `assets/docs/shova-rani-cv.pdf` with the new PDF (same
  filename), and update the "current as of" date on `cv.html`.
- **Re-process a photo**: the original Pillow script used to generate the `-800`/`-1600`
  WebP + JPEG fallback set is not part of this repo (it was a one-off build script). Any
  standard image resize/convert tool works — just keep the `<name>-800.webp` /
  `<name>-1600.webp` / `<name>-800.jpg` naming convention so existing `<img>` tags keep
  working, or update the `src` attributes to match new filenames.

## Deploying to GitHub Pages

1. Push this folder to a repo named `<username>.github.io` (for a user site) — or any repo
   name, then enable Pages in **Settings → Pages → Deploy from branch** for a project site.
2. The `.nojekyll` file at the root tells GitHub Pages to serve files as-is (skip Jekyll
   processing) — keep it.
3. No build step is required; the site is served directly from the branch root.

## Notes

- One project card (copper-modified zeolite filtration, "Team ZEO GAURO") is marked
  `TODO VERIFY` in `projects.html` — its venue, date, and Shova's exact role weren't on the CV
  and were inferred from a team poster photo. Confirm or remove before publishing widely.
- Emails in `index.html`/`contact.html`/`cv.html` are assembled client-side from
  `data-email-user`/`data-email-domain` attributes to reduce scraping; they render as plain
  `mailto:` links once JavaScript runs, and as visible plain text if it doesn't.
