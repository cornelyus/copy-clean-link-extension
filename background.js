// Shared categoryParams, CATEGORIES, STORAGE_KEYS, cleanURL and formatForCopy
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
    STORAGE_KEYS.STATS,
    STORAGE_KEYS.COPY_FORMAT
  ]);

  cachedSettings = {
    enabledCategories: result[STORAGE_KEYS.CATEGORIES] || CATEGORIES,
    customParams: result[STORAGE_KEYS.CUSTOM_PARAMS] || [],
    stats: result[STORAGE_KEYS.STATS] || { cleanedCount: 0, paramsRemoved: 0 },
    copyFormat: result[STORAGE_KEYS.COPY_FORMAT] || DEFAULT_COPY_FORMAT
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

// Set up context menus and settings when the extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  createContextMenus();
  await initializeSettings();
});

// Set defaults on first install, and turn on categories added in an update.
// Categories the user turned off themselves stay off.
async function initializeSettings() {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.CATEGORIES,
    STORAGE_KEYS.KNOWN_CATEGORIES
  ]);

  if (!result[STORAGE_KEYS.CATEGORIES]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.CATEGORIES]: CATEGORIES,
      [STORAGE_KEYS.KNOWN_CATEGORIES]: CATEGORIES,
      [STORAGE_KEYS.CUSTOM_PARAMS]: [],
      [STORAGE_KEYS.STATS]: { cleanedCount: 0, paramsRemoved: 0 }
    });
    return;
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.CATEGORIES]: enableNewCategories(
      result[STORAGE_KEYS.CATEGORIES],
      result[STORAGE_KEYS.KNOWN_CATEGORIES]
    ),
    [STORAGE_KEYS.KNOWN_CATEGORIES]: CATEGORIES
  });
}

function createContextMenus() {
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
}

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

  if (!urlToClean) {
    return;
  }

  // If opening clean link directly
  if (info.menuItemId === 'openCleanLink') {
    const { url: cleanedURL, removedCount } = await cleanURLWithSettings(urlToClean);
    chrome.tabs.create({ url: cleanedURL, active: false });
    await updateStats(removedCount);
  } else if (info.menuItemId === 'copyCleanLink') {
    // The title is the link's text, looked up only when the copy format needs it
    const getTitle = async () => info.linkText || info.selectionText || getLinkText(tab.id, info.frameId, info.linkUrl);
    await cleanAndCopy(urlToClean, tab.id, getTitle);
  } else {
    await cleanAndCopy(urlToClean, tab.id, async () => tab.title);
  }
});

// Find the visible text of the clicked link. Chrome doesn't pass it to context menu
// handlers, so look for a link with the same address in the frame that was clicked.
async function getLinkText(tabId, frameId, linkUrl) {
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId || 0] },
      func: (href) => {
        const link = Array.from(document.links).find(a => a.href === href);
        return link ? (link.innerText || link.title || link.getAttribute('aria-label') || '') : '';
      },
      args: [linkUrl]
    });
    return injection?.result || '';
  } catch (error) {
    return '';
  }
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== 'copy-clean-url') {
    return;
  }

  // tab is not always passed, so fall back to the active tab
  const activeTab = tab || (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  if (activeTab?.url) {
    await cleanAndCopy(activeTab.url, activeTab.id, async () => activeTab.title);
  }
});

// Clean a URL, copy it in the chosen format and show the result on the toolbar badge.
// getTitle is only called when the format uses a title.
async function cleanAndCopy(url, tabId, getTitle) {
  const { url: cleanedURL, removedCount } = await cleanURLWithSettings(url);
  const { copyFormat } = await loadSettings();
  const title = copyFormat === 'plain' ? '' : await getTitle();
  const copied = await copyToClipboard(formatForCopy(cleanedURL, title, copyFormat), tabId);

  if (copied) {
    await updateStats(removedCount);
  }
  showBadge(tabId, copied);
}

// Briefly show ✓ or ✕ on the toolbar icon
function showBadge(tabId, success) {
  chrome.action.setBadgeBackgroundColor({ tabId, color: success ? '#2e7d32' : '#c62828' });
  chrome.action.setBadgeText({ tabId, text: success ? '✓' : '✕' });
  setTimeout(() => chrome.action.setBadgeText({ tabId, text: '' }), 1500);
}

// Function to copy text to clipboard, returns true on success
async function copyToClipboard(text, tabId) {
  // Inject script into the active tab to copy
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (textToCopy) => navigator.clipboard.writeText(textToCopy).then(() => true, () => false),
      args: [text]
    });
    return injection?.result === true;
  } catch (error) {
    // Injection is blocked on chrome:// pages and the Chrome Web Store.
    // Expected, and shown to the user as ✕ on the badge, so not logged as an error
    console.info('Cannot copy on this page:', error.message);
    return false;
  }
}

// Clear cache when settings change (from the popup or elsewhere)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    cachedSettings = null;
  }
});
