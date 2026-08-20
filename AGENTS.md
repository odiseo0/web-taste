# Project guide

This project is a personal design reference library. Keep it simple and use plain HTML, CSS, and JavaScript. Do not add external libraries unless the user asks for them.

## Content folders

- `image-references/`: Graphic design, texture, art, print, maps, adverts, and other visual references.
- `web-references/`: Screenshots of websites and interfaces.
- `color-palettes/`: Palette images, usually with two colors.

Do not rename, move, edit, or delete source files unless the user asks.

## Add new references

Before editing `index.html`, compare the files in each content folder with the paths already used in the page. Add only missing files.

For each image reference, add a card to `#images` with:

- A useful title.
- A clear design type in `.kicker`.
- Accurate alternative text.
- A short description of the subject, layout, and feeling.
- Three specific vocabulary phrases in the HTML. `script.js` expands this list to five when the page loads.

For each saved website screenshot, add the same card structure to `#web`. Describe the page type, hierarchy, content system, and useful design traits.

For a live website, add a `.site-card` with its domain, a short analysis, three vocabulary phrases, and a safe external link. Inspect the current website before describing it.

For each palette, identify the two main background colors. Add a palette card to `#palettes` with:

- Two color fields.
- HEX values.
- RGB values.
- Short color names.
- A `data-source` path to the source palette image.

After adding content, update the brand total and the three section counts in the page header.

## Use references well

Treat each item as a source of principles, not as a template to copy.

Study and describe:

- Hierarchy and focal point.
- Grid, spacing, scale, and reading order.
- Type roles and label systems.
- Color balance and contrast.
- Image treatment, texture, and depth.
- Mood, pace, and visual tension.
- Interaction patterns for web references.

The website inspiration prompt must translate these traits into an original website. It must not copy the source brand, text, images, identity, or exact layout.

Image references also receive a detailed image prompt for an original website asset. Website references do not show an image prompt.

Keep prompts specific. State the purpose, feeling, visual system, page structure, interaction needs, responsive behavior, and access needs.

## Checks

After each update:

1. Confirm that every new file has one library entry.
2. Confirm that all local paths exist.
3. Check the JavaScript with `node --check script.js`.
4. Confirm that the item counts match the cards.
5. Check `git status` without staging files.

Never stage, commit, pull, push, or change Git history unless the user asks.
