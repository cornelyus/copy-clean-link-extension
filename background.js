// List of common tracking parameters
const trackingParams = [
  // Google Analytics and Google Ads
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
  
  // Facebook
  'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
  
  // Microsoft/Bing
  'msclkid', 'ms_clkid',
  
  // Twitter/X
  'twclid', 'tw_source', 'ref_src', 'ref_url',
  
  // LinkedIn
  'li_fat_id', 'lipi', 'licu',
  
  // TikTok
  'ttclid', 'tt_medium', 'tt_content',
  
  // Email Marketing
  'mc_cid', 'mc_eid', // Mailchimp
  '_hsenc', '_hsmi', // HubSpot
  'vero_id', 'vero_conv',
  
  // Amazon
  'ref', 'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
  'pd_rd_r', 'pd_rd_w', 'pd_rd_wg',
  
  // Other platforms
  'igshid', 'igsh', // Instagram
  'zanpid', // Zanox
  'kclickid', // Kenshoo
  'aclk', // AdRoll
  'src', 'ref', 'source', // Generic
  '_ga', '_gl', // Additional Google Analytics
  'pcrid', 'pmt', 'pkw', // Campaign parameters
  'ncid', 'sr_share', // Reddit
  
  // Session and conversion tracking
  'sessionid', 'session_id', 'sid',
  'cvid', 'oicd', 'clickid',
  
  // Affiliate parameters
  'affid', 'affiliate', 'aff_id', 'aff_sub'
];

// Function to clean the URL
function cleanURL(url) {
  try {
    const urlObj = new URL(url);
    
    // Remove tracking parameters
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Remove parameters that start with utm_ (catch-all)
    const allParams = Array.from(urlObj.searchParams.keys());
    allParams.forEach(param => {
      if (param.toLowerCase().startsWith('utm_')) {
        urlObj.searchParams.delete(param);
      }
    });
    
    // Return clean URL
    let cleanedURL = urlObj.toString();
    
    // Remove '?' at the end if there are no parameters
    if (cleanedURL.endsWith('?')) {
      cleanedURL = cleanedURL.slice(0, -1);
    }
    
    return cleanedURL;
  } catch (error) {
    console.error('Error cleaning URL:', error);
    return url; // Return original URL if there is an error
  }
}

// Create context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Menu for links
  chrome.contextMenus.create({
    id: 'copyCleanLink',
    title: 'Copy Clean Link',
    contexts: ['link']
  });
  
  // Menu for the current page
  chrome.contextMenus.create({
    id: 'copyCleanPageURL',
    title: 'Copy Clean Page URL',
    contexts: ['page']
  });

  chrome.contextMenus.create({
  id: 'openCleanLink',
  title: 'Open Clean Link',
  contexts: ['link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let urlToClean;
  
  if (info.menuItemId === 'copyCleanLink' || info.menuItemId === 'openCleanLink') {
    // URL of the clicked link
    urlToClean = info.linkUrl;
  } else if (info.menuItemId === 'copyCleanPageURL') {
    // URL of the current page
    urlToClean = info.pageUrl;
  }

  if (urlToClean) {
    const cleanedURL = cleanURL(urlToClean);
    
      // If opening clean link directly
    if (info.menuItemId === 'openCleanLink') {
      chrome.tabs.create({ url: cleanedURL, active: false });
    } else {
       // Copy to clipboard
      copyToClipboard(cleanedURL, tab.id);
    }
   
  }
});

// Function to copy text to clipboard
function copyToClipboard(text, tabId) {
  // Inject script into the active tab to copy
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (textToCopy) => {
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Clean URL copied:', textToCopy);
      }).catch(err => {
        console.error('Error copying:', err);
      });
    },
    args: [text]
  });
}