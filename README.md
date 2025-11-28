# Copy Clean Link - Chrome Extension

Chrome extension that removes tracking parameters from URLs with a visual management interface.

## v1.1: Visual Management Interface

- **Interactive Popup** - Click the extension icon to open a modern interface
- **Real-time Preview** - See before/after URL cleaning
- **Category Management** - Toggle tracking categories on/off
- **Custom Parameters** - Add your own parameters to remove
- **Usage Statistics** - Track how many URLs you've cleaned

## 🎯 Features

### Context Menu Options
- **Copy Clean Link**: Right-click on any link and select "Copy Clean Link" to copy the URL without tracking parameters
- **Copy Clean Page URL**: Right-click on the page and select "Copy Clean Page URL" to copy the current, clean URL
- **Open Clean Link**: Right-click on any link and select "Open Clean Link" to open the URL without tracking parameters in a new background tab

### Visual Management
- **Preview Interface**: See your URL before and after cleaning
- **Category Toggles**: Enable/disable tracking categories:
  - 📊 Google Analytics (utm_*, gclid)
  - 📘 Facebook (fbclid, fb_*)
  - 🔷 Microsoft/Bing (msclkid)
  - 📱 Social Media (Twitter, LinkedIn, TikTok, Instagram)
  - 📧 Email Marketing (Mailchimp, HubSpot)
  - 📦 Amazon (ref, pf_rd_*, pd_rd_*)
  - 🔍 Generic Tracking (sessionid, clickid, affiliate)
- **Custom Parameters**: Add your own tracking parameters
- **Statistics**: Track your cleaning activity

## 🧹 Tracking Parameters Removed

The extension automatically removes parameters from:
- **Google Analytics**: utm_source, utm_medium, utm_campaign, utm_term, utm_content
- **Google Ads**: gclid, gclsrc, dclid, gbraid, wbraid
- **Facebook**: fbclid, fb_action_ids, fb_action_types
- **Microsoft/Bing**: msclkid
- **Twitter/X**: twclid, tw_source
- **LinkedIn**: li_fat_id, lipi
- **TikTok**: ttclid
- **Email Marketing**: mc_cid, mc_eid (Mailchimp), _hsenc, _hsmi (HubSpot)
- **Amazon**: ref, pf_rd_*, pd_rd_*
- **Instagram**: igshid, igsh
- **Session Tracking**: sessionid, session_id, sid
- **Affiliate**: affid, affiliate, aff_id, aff_sub
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
2. View your current URL and its cleaned version
3. Customize which categories to clean
4. Click "Copy Clean URL" to copy the cleaned version
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
Open the popup and use checkboxes to enable/disable specific tracking categories. Your preferences are automatically saved.

### Add Custom Parameters
1. Open the popup
2. Scroll to "Custom Parameters" section
3. Type your parameter name (e.g., `my_tracking_param`)
4. Click "Add"
5. The parameter will be removed from all future URLs

### Reset to Defaults
Click the "Reset to Defaults" button in the popup to restore all original settings.

## 🔒 Privacy

- The extension runs locally in your browser
- It does not send data to external servers
- It does not collect personal information
- All settings are stored locally
- Open source - you can view all the code

## 🛠️ Extension Files

- `manifest.json` - Extension configuration
- `background.js` - URL cleaning logic and context menu
- `popup.html` - Popup interface structure
- `popup.css` - Popup styling
- `popup.js` - Popup functionality
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons
- `README.md` - This file

## 📊 What's New

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

## 📄 License

Free for personal and commercial use.

## 🤝 Contribute

Feel free to modify and improve the extension! 

### Report Issues
If you find any bugs or have suggestions, please open an issue on GitHub.

---

**Note**: This extension is inspired by the "Copy Clean Link" feature in Firefox, enhanced with visual management capabilities.

Made for a cleaner, more private web.