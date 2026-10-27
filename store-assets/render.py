#!/usr/bin/env python3
"""Render the extension icons and the Chrome Web Store images from the real popup.

Usage (from the repo root):  python3 store-assets/render.py
Needs: chromium (or google-chrome) and ImageMagick's `convert`.
Writes icon16/48/128.png (transparent) to the repo root, and 24-bit PNGs
without alpha, as the store requires, to store-assets/output/.
"""
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlencode

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
BUILD = HERE / 'build'
OUTPUT = HERE / 'output'

# Screenshots (1280×800). Every key besides title/sub/theme/h is passed to the popup.
SCREENSHOTS = [
    ('1-share-safe', {
        'title': 'Share links, not your data.',
        'sub': 'Removes tracking from links before you copy or share them, and shows exactly what it removed.',
        'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42&si=Ab3dEf9GhIj&utm_source=newsletter&utm_medium=email&fbclid=IwAR0xyz',
        'open': '1',
        'h': '600',
    }),
    ('2-amazon', {
        'title': 'Short, clean Amazon links.',
        'sub': 'Product links shrink to amazon.com/dp/… without referral, search or placement tracking.',
        'url': 'https://www.amazon.com/Wireless-Noise-Cancelling-Headphones-Bluetooth/dp/B0C8PSMPTH/ref=sr_1_3?crid=2Y8K4Q&keywords=wireless+headphones&qid=1729800000&sprefix=wireless%2Caps%2C180&sr=8-3&th=1',
        'open': '1',
        'h': '600',
    }),
    ('3-redirects', {
        'title': 'Unwraps redirect links.',
        'sub': 'Google, Facebook, Outlook Safe Links and more: get the real destination without ever visiting the redirect.',
        'url': 'https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Freport%3Futm_source%3Dnewsletter%26utm_campaign%3Doctober&data=05%7C02%7Cuser%40example.com%7C8f2c&sdata=Qm9vZ2xl&reserved=0',
        'open': '1',
        'h': '600',
    }),
    ('4-categories', {
        'title': 'You decide what gets removed.',
        'sub': 'Switch categories on or off, or add your own parameters. Everything stays on your device.',
        'url': 'https://example.com/article?utm_source=newsletter&fbclid=IwAR0xyz',
        'off': 'microsoft,amazon',
        'scroll': '.categories-section',
        'h': '600',
    }),
    ('5-dark-shortcut', {
        'title': 'Light or dark. One shortcut.',
        'sub': 'Follows your system theme. Press Alt+Shift+C to copy the clean link of any page.',
        'theme': 'dark',
        'url': 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=Ab3dEf9GhIj&utm_source=copy-link',
        'h': '440',
    }),
]

# Extension icons: (name, source SVG in icon/, size). 16px has its own drawing
ICONS = [
    ('icon16', 'icon-16.svg', 16),
    ('icon48', 'icon.svg', 48),
    ('icon128', 'icon.svg', 128),
]

# Promo tiles: (name, size parameter, width, height)
PROMOS = [
    ('small-promo-440x280', 'small', 440, 280),
    ('marquee-1400x560', 'marquee', 1400, 560),
]


def find_browser():
    for name in ('chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'):
        path = shutil.which(name)
        if path:
            return path
    raise SystemExit('Chromium or Google Chrome is required')


def build_popup():
    """Copy popup.html with fake chrome.* APIs; also a dark-mode variant."""
    BUILD.mkdir(exist_ok=True)
    html = (ROOT / 'popup.html').read_text()
    html = html.replace('href="popup.css"', 'href="../../popup.css"')
    html = html.replace('<script src="cleaner.js"></script>',
                        '<script src="../../cleaner.js"></script>\n  <script src="../stub.js"></script>')
    html = html.replace('<script src="popup.js"></script>', '<script src="../../popup.js"></script>')
    (BUILD / 'popup.html').write_text(html)

    # Dark variant: force the dark tokens instead of relying on the system setting
    css = (ROOT / 'popup.css').read_text().replace('@media (prefers-color-scheme: dark)', '@media all')
    (BUILD / 'popup-dark.css').write_text(css)
    (BUILD / 'popup-dark.html').write_text(html.replace('href="../../popup.css"', 'href="popup-dark.css"'))


def render(browser, page, query, width, height, name, out_dir=OUTPUT, alpha=False):
    raw = BUILD / f'{name}.raw.png'
    url = (HERE / 'templates' / page).as_uri() + '?' + urlencode(query)
    # Headless windows have a minimum width and lose some height to browser UI,
    # so render with room to spare and crop the fixed-size page from the top-left
    subprocess.run([
        browser, '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
        '--allow-file-access-from-files', '--force-device-scale-factor=1',
        *(['--default-background-color=00000000'] if alpha else []),
        f'--window-size={max(width, 800)},{height + 300}', '--virtual-time-budget=4000',
        f'--screenshot={raw}', url,
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Crop to the exact size; the store wants 24-bit PNG with no alpha channel
    out = out_dir / f'{name}.png'
    fmt = ['PNG32:'] if alpha else ['-alpha', 'off', 'PNG24:']
    subprocess.run(['convert', str(raw), '-crop', f'{width}x{height}+0+0', '+repage',
                    *fmt[:-1], f'{fmt[-1]}{out}'], check=True)
    print(f'{out.relative_to(ROOT)}  {width}x{height}')


def main():
    browser = find_browser()
    OUTPUT.mkdir(exist_ok=True)
    build_popup()
    for name, src, size in ICONS:
        render(browser, 'icon.html', {'src': src, 'size': size}, size, size, name, ROOT, alpha=True)
    for name, query in SCREENSHOTS:
        render(browser, 'screenshot.html', query, 1280, 800, name)
    for name, size, width, height in PROMOS:
        render(browser, 'promo.html', {'size': size}, width, height, name)


if __name__ == '__main__':
    main()
