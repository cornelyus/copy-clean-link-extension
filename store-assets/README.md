# Chrome Web Store assets

Screenshots and promo tiles for the store listing, rendered from the real popup (`popup.html`, `popup.css`, `popup.js`, `cleaner.js`). Fake `chrome.*` APIs in `stub.js` stand in for the extension. This folder is not part of the extension package.

## Images (`output/`)

| File | Store slot | Size |
|---|---|---|
| `1-share-safe.png` … `5-dark-shortcut.png` | Screenshots (upload in this order) | 1280×800 |
| `small-promo-440x280.png` | Small promo tile | 440×280 |
| `marquee-1400x560.png` | Marquee promo tile | 1400×560 |

All are 24-bit PNG without alpha, as the store requires.

## Regenerating after a UI change

Needs Chromium or Google Chrome, and ImageMagick (`convert`). From the repo root:

```sh
python3 store-assets/render.py
```

- **Captions and example links:** `SCREENSHOTS` in `render.py`.
- **Layouts:** `templates/screenshot.html` (caption + popup) and `templates/promo.html` (tiles).
- **Popup state** for each shot (current URL, switched-off categories, expanded "removed" list, scroll position): see the parameters at the top of `stub.js`.

The popup is rendered with the fonts installed on your machine, so the images look the way the popup looks for you.

## Store description

The text for the listing's description field is in [`listing.md`](listing.md).
