# Copy Clean Link - Chrome Extension

Chrome extension that removes tracking parameters from URLs with a visual management interface.

## v1.2: Retro Skeuomorphic UI

- **Amber VFD Display** - Vintage hardware aesthetic with glowing amber displays
- **Interactive Popup** - Click the extension icon to open the interface
- **Real-time Preview** - See before/after URL cleaning on authentic displays
- **Physical Toggle Switches** - Realistic hardware-style switches
- **Category Management** - Toggle tracking categories on/off
- **Custom Parameters** - Add your own parameters to remove
- **Usage Statistics** - Track cleaning activity on LED-style displays

## 🎯 Features

### Context Menu Options
- **Copy Clean Link**: Right-click on any link and select "Copy Clean Link" to copy the URL without tracking parameters
- **Copy Clean Page URL**: Right-click on the page and select "Copy Clean Page URL" to copy the current, clean URL
- **Open Clean Link**: Right-click on any link and select "Open Clean Link" to open the URL without tracking parameters in a new background tab

### Visual Management
- **Preview Interface**: See your URL before and after cleaning on VFD-style displays
- **Category Toggles**: Enable/disable tracking categories with physical toggle switches:
  - GA - Google Analytics (utm_*, gclid)
  - FB - Facebook (fbclid, fb_*)
  - MS - Microsoft/Bing (msclkid)
  - SM - Social Media (Twitter, LinkedIn, TikTok, Instagram)
  - EM - Email Marketing (Mailchimp, HubSpot)
  - AZ - Amazon (ref, pf_rd_*, pd_rd_*)
  - GN - Generic Tracking (sessionid, clickid, affiliate)
- **Custom Parameters**: Add your own tracking parameters
- **Statistics**: Track your cleaning activity on amber LED displays

### Design Aesthetic
- **Skeuomorphic Interface**: Realistic hardware controls and displays
- **Amber VFD Displays**: Vintage Vacuum Fluorescent Display aesthetic
- **Brushed Metal Panels**: Industrial control panel look
- **Physical Switches**: Authentic toggle switch animations
- **Industrial Design**: Inspired by 1970s-80s audio equipment and hardware

## 🧹 Tracking Parameters Removed

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
- And many others...

## 📦 How to Install

### Method 1: Manual Installation (Developer Mode)

1. **Download all files** of this extension into a folder on your computer

2. **Open Chrome** and go to `chrome://extensions/`

3. **Enable "Developer mode"** in the top right corner

4. **Click on "Load unpacked"**

5. **Select the folder** where you saved the extension files

6. **Done!** The extension is installed and ready to use

### Method 2: Chrome Web Store (Coming Soon)

We're working on publishing this extension to the Chrome Web Store for easier installation.

## 🚀 How to Use

### Using the Popup Interface (Recommended)
1. Click the extension icon in your toolbar
2. View your current URL and its cleaned version on the amber VFD displays
3. Customize which categories to clean using the physical toggle switches
4. Click the orange "Copy Clean URL" button
5. Add custom parameters if needed

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

## 📝 Example

**Original URL:**
```
https://example.com/article?utm_source=facebook&utm_medium=social&fbclid=IwAR123xyz&utm_campaign=promo
```

**Clean URL:**
```
https://example.com/article
```

**Removed Parameters:** 4 (utm_source, utm_medium, fbclid, utm_campaign)

## 🎨 Customization

### Toggle Categories
Open the popup and use the physical toggle switches to enable/disable specific tracking categories. Watch them slide with smooth animations! Your preferences are automatically saved.

### Add Custom Parameters
1. Open the popup
2. Scroll to "Custom Parameters" section
3. Type your parameter name in the amber display (e.g., `my_tracking_param`)
4. Click "Add"
5. The parameter will be removed from all future URLs

### Reset to Defaults
Click the red "Reset to Defaults" button in the popup to restore all original settings.

## 🔒 Privacy

- The extension runs locally in your browser
- It does not send data to external servers
- It does not collect personal information
- All settings are stored locally in your browser
- Open source - you can view all the code
- See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for full details

## 🛠️ Extension Files

- `manifest.json` - Extension configuration
- `cleaner.js` - Shared URL cleaning logic and tracking parameter lists
- `background.js` - Context menu handling
- `popup.html` - Popup interface structure
- `popup.css` - Popup styling (skeuomorphic amber VFD theme)
- `popup.js` - Popup functionality
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons
- `README.md` - This file
- `PRIVACY_POLICY.md` - Privacy policy

## 📊 What's New

### Version 1.2.1 (Current)
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

## 🎨 Design Inspiration

The current UI is inspired by:
- 1970s-80s VFD (Vacuum Fluorescent Display) technology
- Vintage calculators and audio equipment
- Industrial control panels
- Classic analog hardware interfaces
- Authentic skeuomorphic design principles

## 📄 License

Free for personal and commercial use.

## 🤝 Contribute

Feel free to modify and improve the extension!

### Report Issues
If you find any bugs or have suggestions, please open an issue on GitHub.

---

**Note**: This extension is inspired by the "Copy Clean Link" feature in Firefox, enhanced with visual management capabilities and a unique retro hardware aesthetic.

Made for a cleaner, more private web. 🔗✨
