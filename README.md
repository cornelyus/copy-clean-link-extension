```markdown
# Copy Clean Link - Chrome Extension

Chrome extension that removes tracking parameters from URLs when copying links or opening them.

## 🎯 Features

- **Copy Clean Link**: Right-click on any link and select "Copy Clean Link" to copy the URL without tracking parameters.
- **Copy Clean Page URL**: Right-click on the page and select "Copy Clean Page URL" to copy the current, clean URL.
- **Open Clean Link**: Right-click on any link and select "Open Clean Link" to open the URL without tracking parameters in a new background tab.

## 🧹 Removed Parameters

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
- And many others...

## 📦 How to Install

### Method 1: Manual Installation (Developer Mode)

1. **Download all files** of this extension into a folder on your computer.

2. **Open Chrome** and go to `chrome://extensions/`

3. **Enable "Developer mode"** in the top right corner.

4. **Click on "Load unpacked"**

5. **Select the folder** where you saved the extension files.

6. **Done!** The extension is installed and ready to use.

## 🚀 How to Use

### Clean a link:
1. Right-click on any link.
2. Select "Copy Clean Link".
3. The clean link is automatically copied to the clipboard.

### Clean the current URL:
1. Right-click anywhere on the page.
2. Select "Copy Clean Page URL".
3. The clean URL is automatically copied to the clipboard.

### Open a clean link:
1. Right-click on any link.
2. Select "Open Clean Link".
3. The clean link is opened in a new background tab.

## 📝 Example

**Original URL:**
```

[https://exemplo.com/artigo?utm\_source=facebook\&utm\_medium=social\&fbclid=IwAR123xyz\&utm\_campaign=promo](https://exemplo.com/artigo?utm_source=facebook&utm_medium=social&fbclid=IwAR123xyz&utm_campaign=promo)

```

**Clean URL:**
```

[https://exemplo.com/artigo](https://exemplo.com/artigo)

```

## 🔒 Privacy

- The extension runs locally in your browser.
- It does not send data to external servers.
- It does not collect personal information.
- Open source - you can view all the code.

## 🛠️ Extension Files

- `manifest.json` - Extension configuration
- `background.js` - URL cleaning logic
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons
- `README.md` - This file

## 📄 License

Free for personal and commercial use.

## 🤝 Contribute

Feel free to modify and improve the extension!

### Add more tracking parameters:
Edit the `trackingParams` array in `background.js` and add the parameters you want to remove.

---

**Note**: This extension is inspired by the "Copy Clean Link" feature in Firefox.
```