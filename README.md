# Copy Clean Link - Chrome Extension

Chrome extension that removes tracking parameters from URLs with a visual management interface.

**[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/copy-clean-link-remove-ur/jimbfjhnmbojbhihalhngfkcbmgnjafa)**

## At a glance

- **Clean, readable popup** - Calm Braun-inspired design that follows your system's light or dark mode
- **Real-time Preview** - See the URL before and after cleaning, and what was removed
- **Site-aware cleaning** - Amazon links shortened, share IDs removed, redirect links unwrapped
- **Category Management** - Switch tracking categories on/off
- **Custom Parameters** - Add your own parameters to remove
- **Usage Statistics** - Track how many links you've cleaned

## Features

### Context Menu Options
- **Copy Clean Link**: Right-click on any link and select "Copy Clean Link" to copy the URL without tracking parameters
- **Copy Clean Page URL**: Right-click on the page and select "Copy Clean Page URL" to copy the current, clean URL
- **Open Clean Link**: Right-click on any link and select "Open Clean Link" to open the URL without tracking parameters in a new background tab

### Keyboard Shortcut
- **Alt+Shift+C** copies the clean URL of the current tab. A ✓ on the toolbar icon confirms the copy (✕ means it failed, for example on `chrome://` pages)
- Change it at `chrome://extensions/shortcuts`

### Visual Management
- **Preview Interface**: See your URL before and after cleaning
- **What was removed**: A short list under the clean URL shows each removed parameter or redirect, and why (click to expand)
- **Category Switches**: Enable/disable tracking categories:
  - Site-specific rules (Amazon, YouTube, X, Instagram, TikTok, Spotify, LinkedIn)
  - Unwrap redirect links (Google, Facebook, Instagram, Outlook Safe Links, YouTube, Reddit, LinkedIn, Steam)
  - Google Analytics (utm_*, gclid)
  - Facebook (fbclid, fb_*)
  - Microsoft/Bing (msclkid)
  - Social Media (Twitter, LinkedIn, TikTok, Instagram)
  - Email Marketing (Mailchimp, HubSpot)
  - Amazon (ref, pf_rd_*, pd_rd_*)
  - Generic Tracking (sessionid, clickid, affiliate)
- **Custom Parameters**: Add your own tracking parameters
- **Statistics**: Track your cleaning activity

### Design
- **Readable first**: Plain sentence-case labels, monospace URLs, and colours that meet WCAG AA contrast
- **One accent**: A single orange for the Copy button and switches, like the indicator light on a Braun device
- **Light and dark**: Follows your system setting automatically, with no theme button

## Tracking Parameters Removed

The extension automatically removes parameters from:
- **Google Analytics**: utm_source, utm_medium, utm_campaign, utm_term, utm_content, _ga, _gl
- **Google Ads**: gclid, gclsrc, dclid, gbraid, wbraid
- **Facebook**: fbclid, fb_action_ids, fb_action_types, fb_source, fb_ref
- **Microsoft/Bing**: msclkid, ms_clkid
- **Twitter/X**: twclid, tw_source, ref_src, ref_url
- **LinkedIn**: li_fat_id, lipi, licu
- **TikTok**: ttclid, tt_medium, tt_content
- **Instagram**: igshid, igsh
- **Email Marketing**: mc_cid, mc_eid (Mailchimp), _hsenc, _hsmi (HubSpot), vero_id, vero_conv
- **Amazon**: ref, ref_, pf_rd_r, pf_rd_p, pf_rd_m, pf_rd_s, pf_rd_t, pf_rd_i, pd_rd_r, pd_rd_w, pd_rd_wg
- **Session Tracking**: sessionid, session_id, sid
- **Affiliate**: affid, affiliate, aff_id, aff_sub, zanpid, kclickid, aclk
- **Generic**: cvid, oicd, clickid, src, source, pcrid, pmt, pkw, ncid, sr_share
- Plus any custom parameters you add

### Site-specific rules

Some parameters are only tracking on certain sites (for example `t` is a share ID on X but a timestamp on YouTube), so these are removed only on the site they belong to:
- **Amazon**: product links are shortened to `amazon.<tld>/dp/<product ID>`; other pages lose ref, pf_rd_*, pd_rd_*, crid, sprefix, qid, sr and similar
- **YouTube**: si, is, pp, feature (video, time and playlist are kept)
- **X/Twitter**: s, t
- **Instagram**: igsh, igshid
- **TikTok**: _r, _t, is_from_webapp, sender_device, share and sender IDs
- **Spotify**: si, context
- **LinkedIn**: trk, trackingId, refId, lipi, email tracking IDs

### Redirect unwrapping

Many sites send links through their own redirect page, which records the click. These are replaced with the real destination, which is then cleaned as usual. No network request is made: the destination is already in the link.
- **Google**: `google.*/url?q=…`
- **Facebook / Instagram**: `l.facebook.com/l.php?u=…`, `l.instagram.com/?u=…`
- **Outlook Safe Links**: `*.safelinks.protection.outlook.com/?url=…`
- **YouTube**: `youtube.com/redirect?q=…`
- **Reddit**: `out.reddit.com/…?url=…`
- **LinkedIn**: `linkedin.com/redir/redirect?url=…`
- **Steam**: `steamcommunity.com/linkfilter/?url=…`

Only `http` and `https` destinations are used. Anything else leaves the link as it is.

## How to Install

### Method 1: Chrome Web Store (Recommended)

1. Open **[Copy Clean Link on the Chrome Web Store](https://chromewebstore.google.com/detail/copy-clean-link-remove-ur/jimbfjhnmbojbhihalhngfkcbmgnjafa)**
2. Click **Add to Chrome**
3. Done! Updates are installed automatically

### Method 2: Manual Installation (for development)

1. **Get the code**: clone this repository, or on GitHub click **Code → Download ZIP** (or download a release tag) and unzip it

2. **Open Chrome** and go to `chrome://extensions/`

3. **Enable "Developer mode"** in the top right corner

4. **Click on "Load unpacked"**

5. **Select the folder** that contains `manifest.json`

6. **Done!** The extension is installed. After changing the code, click the reload icon on its card

## How to Use

### Using the Popup Interface (Recommended)
1. Click the extension icon in your toolbar
2. View your current URL, its cleaned version and what was removed
3. Customize which categories to clean using the switches
4. Click the orange "Copy Clean URL" button
5. Add custom parameters if needed

### Using the Keyboard Shortcut
1. Press **Alt+Shift+C** on any page
2. The clean URL of the page is copied to the clipboard
3. The toolbar icon briefly shows ✓

### Using Context Menu
#### Clean a link:
1. Right-click on any link
2. Select "Copy Clean Link"
3. The clean link is automatically copied to the clipboard

#### Clean the current URL:
1. Right-click anywhere on the page
2. Select "Copy Clean Page URL"
3. The clean URL is automatically copied to the clipboard

#### Open a clean link:
1. Right-click on any link
2. Select "Open Clean Link"
3. The clean link is opened in a new background tab

## Example

**Original URL:**
```
https://example.com/article?utm_source=facebook&utm_medium=social&fbclid=IwAR123xyz&utm_campaign=promo
```

**Clean URL:**
```
https://example.com/article
```

**Removed Parameters:** 4 (utm_source, utm_medium, fbclid, utm_campaign)

## Customization

### Switch Categories
Open the popup and use the switches to enable/disable specific tracking categories. Your preferences are saved automatically.

### Add Custom Parameters
1. Open the popup
2. Scroll to "Custom Parameters" section
3. Type your parameter name (e.g., `my_tracking_param`)
4. Click "Add"
5. The parameter will be removed from all future URLs

### Reset to Defaults
Click "Reset to Defaults" at the bottom of the popup to restore all original settings and reset the statistics.

## Privacy

- The extension runs locally in your browser
- It does not send data to external servers
- It does not collect personal information
- All settings are stored locally in your browser
- Open source - you can view all the code
- See [PRIVACY-POLICY.md](PRIVACY-POLICY.md) for full details

## Extension Files

- `manifest.json` - Extension configuration
- `cleaner.js` - Shared URL cleaning logic and tracking parameter lists
- `background.js` - Context menus, keyboard shortcut, toolbar badge, and settings on install/update
- `popup.html` - Popup interface structure
- `popup.css` - Popup styling (Braun-inspired, light and dark)
- `popup.js` - Popup functionality
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons
- `tests/` - Tests for the URL cleaning logic (not included in the store package)
- `README.md` - This file
- `PRIVACY-POLICY.md` - Privacy policy

### Running the tests

Requires Node.js 18 or later, with no dependencies to install:

```sh
node --test
```

## What's New

### Version 2.0.0 (Current): New design
- **Redesigned popup**: calm Braun-inspired look with warm neutral panels and a single orange accent
- **Light and dark mode**: follows your system setting automatically
- **More readable**: sentence-case labels, each category shows its parameters underneath, no emoji or short codes
- **Accessible**: text and switch colours meet WCAG AA contrast
- Includes everything from 1.3.0 (site-specific rules, redirect unwrapping, what was removed, Alt+Shift+C shortcut)

### Version 1.3.0: Share-safe links
- **Site-specific rules**: Amazon product links shortened to `/dp/<ID>`; share and sender IDs removed on YouTube, X, Instagram, TikTok, Spotify and LinkedIn
- **Redirect unwrapping**: Google, Facebook, Instagram, Outlook Safe Links, YouTube, Reddit, LinkedIn and Steam redirect links are replaced by their real destination
- **What was removed**: the popup lists each removed parameter or redirect and why
- **Keyboard shortcut**: Alt+Shift+C copies the clean URL of the current tab
- ✓/✕ on the toolbar icon confirms right-click and shortcut copies
- New categories are turned on automatically for existing users; categories you turned off stay off
- Fixed: stats counted copies that failed
- Fixed: custom parameter names are shown as plain text

### Version 1.2.1
- Fixed: the popup now removes all `utm_*` parameters, matching the context menu
- `utm_*` parameters are only removed when the Google Analytics category is enabled, as its label says
- Fixed: "Could not establish connection" error when changing settings in the popup
- URL cleaning logic shared between popup and context menu (`cleaner.js`)

### Version 1.2
- **New UI**: Retro skeuomorphic design with amber VFD displays
- Physical toggle switches with realistic animations
- Brushed metal panels and industrial aesthetic
- LED-style alphanumeric indicators (GA, FB, MS, etc.)
- Improved text contrast on amber displays
- Glowing text effects for authentic VFD look
- Hardware-inspired design elements throughout
- Updated manifest with better SEO description

### Version 1.1
- Added visual popup interface
- Category management with toggle controls
- Custom parameter support
- Usage statistics tracking
- Modern, clean design
- Settings persistence

### Version 1.0
- Initial release
- Context menu integration
- Basic URL cleaning
- Open clean link feature

## Design Inspiration

The current UI is inspired by:
- Dieter Rams' work at Braun and his principle "less, but better"
- Warm off-white panels and a single orange indicator colour
- Physical-feeling controls (a raised key, sliding switches) without decoration

Earlier versions (up to 1.3) used a retro skeuomorphic design with amber VFD displays.

## License

Free for personal and commercial use.

## Contribute

Feel free to modify and improve the extension!

### Report Issues
If you find any bugs or have suggestions, please open an issue on GitHub.

---

**Note**: This extension is inspired by the "Copy Link Without Site Tracking" feature in Firefox, enhanced with site-aware cleaning, redirect unwrapping and visual management.

Made for a cleaner, more private web.
