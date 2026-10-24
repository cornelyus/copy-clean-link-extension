// Shared categoryParams, STORAGE_KEYS and cleanURL
importScripts('cleaner.js');

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

// Clean the URL using the stored settings
async function cleanURLWithSettings(url) {
  const settings = await loadSettings();
  return cleanURL(url, settings.enabledCategories, settings.customParams);
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
    const { url: cleanedURL, removedCount } = await cleanURLWithSettings(urlToClean);

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

// Clear cache when settings change (from the popup or elsewhere)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    cachedSettings = null;
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
