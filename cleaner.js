// Shared URL cleaning logic - loaded by background.js (importScripts) and popup.html

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

    // Remove any utm_* parameters (catch-all, part of the google category)
    const allParams = Array.from(urlObj.searchParams.keys());
    allParams.forEach(param => {
      if (enabledCategories.includes('google') && param.toLowerCase().startsWith('utm_')) {
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

// Export for Node tests (module is undefined in the extension)
if (typeof module !== 'undefined') {
  module.exports = { cleanURL, categoryParams, STORAGE_KEYS };
}
