// categoryParams, STORAGE_KEYS and cleanURL come from cleaner.js

// Get current tab URL
async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url || '';
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
  // background.js picks up the change via chrome.storage.onChanged
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
