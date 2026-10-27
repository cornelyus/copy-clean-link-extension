# Chrome Web Store assets

Screenshots and promo tiles for the store listing, rendered from the real popup (`popup.html`, `popup.css`, `popup.js`, `cleaner.js`). Fake `chrome.*` APIs in `stub.js` stand in for the extension. This folder is not part of the extension package.

## Extension icon (`icon/`)

`icon/icon.svg` is the source for `icon48.png` and `icon128.png` (a 96px tile inside 16px of transparent padding, as Chrome recommends). `icon/icon-16.svg` is a separate drawing for the toolbar: the same link on whole pixels, set lower to leave room for the dot, so it stays sharp at 16px. The orange dot on the left is the same accent as the dot in the popup header and the store images. `render.py` writes all three PNGs to the repo root.

`icon128.png` is also the store icon.

## Images (`output/`)

| File | Store slot | Size |
|---|---|---|
| `1-share-safe.png` … `5-dark-shortcut.png` | Screenshots (upload in this order) | 1280×800 |
| `small-promo-440x280.png` | Small promo tile | 440×280 |
| `marquee-1400x560.png` | Marquee promo tile | 1400×560 |

All are 24-bit PNG without alpha, as the store requires.

## Regenerating after a UI change

Needs Chromium or Google Chrome, and ImageMagick (`convert`). From the repo root, this regenerates the icons and every store image:

```sh
python3 store-assets/render.py
```

- **Captions and example links:** `SCREENSHOTS` in `render.py`.
- **Layouts:** `templates/screenshot.html` (caption + popup) and `templates/promo.html` (tiles).
- **Popup state** for each shot (current URL, switched-off categories, expanded "removed" list, scroll position): see the parameters at the top of `stub.js`.

The popup is rendered with the fonts installed on your machine, so the images look the way the popup looks for you.

## Store description

The text for the listing's description field is in [`listing.md`](listing.md).
