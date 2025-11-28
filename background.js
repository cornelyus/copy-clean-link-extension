// Category mappings - same as in popup.js
const categoryParams = {
  google: [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid', '_ga', '_gl'
  ],
  facebook: [
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref'
  ],
  microsoft: [
    'msclkid', 'ms_clkid'
  ],
  social: [
    'twclid', 'tw_source', 'ref_src', 'ref_url', // Twitter
    'li_fat_id', 'lipi', 'licu', // LinkedIn
    'ttclid', 'tt_medium', 'tt_content', // TikTok
    'igshid', 'igsh' // Instagram
  ],
  email: [
    'mc_cid', 'mc_eid', // Mailchimp
    '_hsenc', '_hsmi', // HubSpot
    'vero_id', 'vero_conv'
  ],
  amazon: [
    'ref', 'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
    'pd_rd_r', 'pd_rd_w', 'pd_rd_wg'
  ],
  generic: [
    'sessionid', 'session_id', 'sid',
    'cvid', 'oicd', 'clickid',
    'affid', 'affiliate', 'aff_id', 'aff_sub',
    'zanpid', 'kclickid', 'aclk',
    'src', 'source',
    'pcrid', 'pmt', 'pkw',
    'ncid', 'sr_share'
  ]
};

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'enabledCategories',
  CUSTOM_PARAMS: 'customParams',
  STATS: 'stats'
};

// Cache for settings
let cachedSettings = null;

// Load settings from storage
async function loadSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }

  const result = await chrome.storage.local.get([
    STORAGE_KEYS.CATEGORIES,
    STORAGE_KEYS.CUSTOM_PARAMS,
    STORAGE_KEYS.STATS
  ]);

  cachedSettings = {
    enabledCategories: result[STORAGE_KEYS.CATEGORIES] || Object.keys(categoryParams),
    customParams: result[STORAGE_KEYS.CUSTOM_PARAMS] || [],
    stats: result[STORAGE_KEYS.STATS] || { cleanedCount: 0, paramsRemoved: 0 }
  };

  return cachedSettings;
}

// Function to clean the URL based on settings
async function cleanURL(url) {
  try {
    const urlObj = new URL(url);
    const settings = await loadSettings();
    let removedCount = 0;

    // Collect all params to remove
    const paramsToRemove = new Set();

    // Add params from enabled categories
    settings.enabledCategories.forEach(category => {
      if (categoryParams[category]) {
        categoryParams[category].forEach(param => paramsToRemove.add(param));
      }
    });

    // Add custom params
    settings.customParams.forEach(param => paramsToRemove.add(param));

    // Remove the parameters
    paramsToRemove.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        removedCount++;
      }
    });

    // Remove any utm_* parameters (catch-all)
    const allParams = Array.from(urlObj.searchParams.keys());
    allParams.forEach(param => {
      if (param.toLowerCase().startsWith('utm_')) {
        urlObj.searchParams.delete(param);
        removedCount++;
      }
    });

    // Return clean URL
    let cleanedURL = urlObj.toString();

    // Remove '?' at the end if there are no parameters
    if (cleanedURL.endsWith('?')) {
      cleanedURL = cleanedURL.slice(0, -1);
    }

    return { url: cleanedURL, removedCount };
  } catch (error) {
    console.error('Error cleaning URL:', error);
    return { url, removedCount: 0 };
  }
}

// Update stats
async function updateStats(removedCount) {
  const settings = await loadSettings();
  settings.stats.cleanedCount++;
  settings.stats.paramsRemoved += removedCount;

  await chrome.storage.local.set({
    [STORAGE_KEYS.STATS]: settings.stats
  });

  cachedSettings = settings;
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

  // Menu to open clean link
  chrome.contextMenus.create({
    id: 'openCleanLink',
    title: 'Open Clean Link',
    contexts: ['link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let urlToClean;

  if (info.menuItemId === 'copyCleanLink' || info.menuItemId === 'openCleanLink') {
    // URL of the clicked link
    urlToClean = info.linkUrl;
  } else if (info.menuItemId === 'copyCleanPageURL') {
    // URL of the current page
    urlToClean = info.pageUrl;
  }

  if (urlToClean) {
    const { url: cleanedURL, removedCount } = await cleanURL(urlToClean);

    // If opening clean link directly
    if (info.menuItemId === 'openCleanLink') {
      chrome.tabs.create({ url: cleanedURL, active: false });
      await updateStats(removedCount);
    } else {
      // Copy to clipboard
      await copyToClipboard(cleanedURL, tab.id);
      await updateStats(removedCount);
    }
  }
});

// Function to copy text to clipboard
async function copyToClipboard(text, tabId) {
  // Inject script into the active tab to copy
  try {
    await chrome.scripting.executeScript({
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
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateSettings') {
    // Clear cache when settings change
    cachedSettings = null;
    console.log('Settings updated');
  }
});

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get([STORAGE_KEYS.CATEGORIES]);
  
  // Set default categories if not already set
  if (!result[STORAGE_KEYS.CATEGORIES]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.CATEGORIES]: Object.keys(categoryParams),
      [STORAGE_KEYS.CUSTOM_PARAMS]: [],
      [STORAGE_KEYS.STATS]: { cleanedCount: 0, paramsRemoved: 0 }
    });
  }
});
