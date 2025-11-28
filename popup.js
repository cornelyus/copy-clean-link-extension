// Category mappings - which params belong to which category
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

// Get current tab URL
async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url || '';
}

// Clean URL based on enabled categories and custom params
function cleanURL(url, enabledCategories, customParams) {
  try {
    const urlObj = new URL(url);
    let removedCount = 0;

    // Collect all params to remove
    const paramsToRemove = new Set();

    // Add params from enabled categories
    enabledCategories.forEach(category => {
      if (categoryParams[category]) {
        categoryParams[category].forEach(param => paramsToRemove.add(param));
      }
    });

    // Add custom params
    customParams.forEach(param => paramsToRemove.add(param));

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
      if (param.toLowerCase().startsWith('utm_') && !urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        removedCount++;
      }
    });

    // Clean up trailing '?'
    let cleanedURL = urlObj.toString();
    if (cleanedURL.endsWith('?')) {
      cleanedURL = cleanedURL.slice(0, -1);
    }

    return { url: cleanedURL, removedCount };
  } catch (error) {
    console.error('Error cleaning URL:', error);
    return { url, removedCount: 0 };
  }
}

// Load settings from storage
async function loadSettings() {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.CATEGORIES,
    STORAGE_KEYS.CUSTOM_PARAMS,
    STORAGE_KEYS.STATS
  ]);

  return {
    enabledCategories: result[STORAGE_KEYS.CATEGORIES] || Object.keys(categoryParams),
    customParams: result[STORAGE_KEYS.CUSTOM_PARAMS] || [],
    stats: result[STORAGE_KEYS.STATS] || { cleanedCount: 0, paramsRemoved: 0 }
  };
}

// Save settings to storage
async function saveSettings(settings) {
  await chrome.storage.local.set({
    [STORAGE_KEYS.CATEGORIES]: settings.enabledCategories,
    [STORAGE_KEYS.CUSTOM_PARAMS]: settings.customParams,
    [STORAGE_KEYS.STATS]: settings.stats
  });

  // Notify background script of settings change
  chrome.runtime.sendMessage({
    action: 'updateSettings',
    settings: {
      enabledCategories: settings.enabledCategories,
      customParams: settings.customParams
    }
  });
}

// Update preview
async function updatePreview() {
  const originalUrl = await getCurrentTabUrl();
  const settings = await loadSettings();
  
  const { url: cleanedUrl, removedCount } = cleanURL(
    originalUrl,
    settings.enabledCategories,
    settings.customParams
  );

  document.getElementById('originalUrl').textContent = originalUrl || 'No URL available';
  document.getElementById('cleanUrl').textContent = cleanedUrl || 'No URL available';

  // Update copy button state
  const copyBtn = document.getElementById('copyBtn');
  if (originalUrl === cleanedUrl) {
    copyBtn.style.opacity = '0.6';
    copyBtn.style.cursor = 'not-allowed';
    document.getElementById('copyBtnText').textContent = '✓ Already Clean';
  } else {
    copyBtn.style.opacity = '1';
    copyBtn.style.cursor = 'pointer';
    document.getElementById('copyBtnText').textContent = `📋 Copy Clean URL (${removedCount} params)`;
  }
}

// Update statistics display
function updateStatsDisplay(stats) {
  document.getElementById('cleanedCount').textContent = stats.cleanedCount;
  document.getElementById('paramsRemoved').textContent = stats.paramsRemoved;
}

// Initialize checkboxes
async function initializeCheckboxes() {
  const settings = await loadSettings();
  
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    const category = checkbox.dataset.category;
    checkbox.checked = settings.enabledCategories.includes(category);
  });
}

// Render custom parameters
function renderCustomParams(customParams) {
  const container = document.getElementById('customParamsList');
  container.innerHTML = '';

  customParams.forEach(param => {
    const tag = document.createElement('div');
    tag.className = 'custom-param-tag';
    tag.innerHTML = `
      <span>${param}</span>
      <button class="remove-param" data-param="${param}">✕</button>
    `;
    container.appendChild(tag);
  });

  // Add event listeners to remove buttons
  container.querySelectorAll('.remove-param').forEach(btn => {
    btn.addEventListener('click', async () => {
      const param = btn.dataset.param;
      const settings = await loadSettings();
      settings.customParams = settings.customParams.filter(p => p !== param);
      await saveSettings(settings);
      renderCustomParams(settings.customParams);
      await updatePreview();
    });
  });
}

// Initialize popup
async function initialize() {
  const settings = await loadSettings();

  // Update preview
  await updatePreview();

  // Initialize checkboxes
  await initializeCheckboxes();

  // Render custom params
  renderCustomParams(settings.customParams);

  // Update stats
  updateStatsDisplay(settings.stats);

  // Event: Copy button
  document.getElementById('copyBtn').addEventListener('click', async () => {
    const originalUrl = await getCurrentTabUrl();
    const settings = await loadSettings();
    
    const { url: cleanedUrl, removedCount } = cleanURL(
      originalUrl,
      settings.enabledCategories,
      settings.customParams
    );

    // Copy to clipboard
    await navigator.clipboard.writeText(cleanedUrl);

    // Update stats
    settings.stats.cleanedCount++;
    settings.stats.paramsRemoved += removedCount;
    await saveSettings(settings);
    updateStatsDisplay(settings.stats);

    // Visual feedback
    const btn = document.getElementById('copyBtn');
    const btnText = document.getElementById('copyBtnText');
    btn.classList.add('copied');
    btnText.textContent = '✓ Copied!';
    
    setTimeout(() => {
      btn.classList.remove('copied');
      updatePreview();
    }, 2000);
  });

  // Event: Category checkboxes
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
      const settings = await loadSettings();
      const category = checkbox.dataset.category;

      if (checkbox.checked) {
        if (!settings.enabledCategories.includes(category)) {
          settings.enabledCategories.push(category);
        }
      } else {
        settings.enabledCategories = settings.enabledCategories.filter(c => c !== category);
      }

      await saveSettings(settings);
      await updatePreview();
    });
  });

  // Event: Add custom parameter
  document.getElementById('addParamBtn').addEventListener('click', async () => {
    const input = document.getElementById('customParam');
    const param = input.value.trim();

    if (param) {
      const settings = await loadSettings();
      
      if (!settings.customParams.includes(param)) {
        settings.customParams.push(param);
        await saveSettings(settings);
        renderCustomParams(settings.customParams);
        await updatePreview();
      }

      input.value = '';
    }
  });

  // Event: Enter key on input
  document.getElementById('customParam').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('addParamBtn').click();
    }
  });

  // Event: Reset button
  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (confirm('Reset all settings to defaults?')) {
      const defaultSettings = {
        enabledCategories: Object.keys(categoryParams),
        customParams: [],
        stats: { cleanedCount: 0, paramsRemoved: 0 }
      };

      await saveSettings(defaultSettings);
      await initializeCheckboxes();
      renderCustomParams(defaultSettings.customParams);
      updateStatsDisplay(defaultSettings.stats);
      await updatePreview();
    }
  });
}

// Run on popup open
document.addEventListener('DOMContentLoaded', initialize);
