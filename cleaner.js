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

// Why each category's params are removed (shown to the user)
const categoryReasons = {
  google: 'Google Analytics/Ads tracking',
  facebook: 'Facebook click tracking',
  microsoft: 'Microsoft/Bing ad tracking',
  social: 'Social media tracking',
  email: 'Email marketing tracking',
  amazon: 'Amazon referral tracking',
  generic: 'Tracking or session parameter'
};

const AMAZON_DOMAINS = [
  'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es',
  'amazon.nl', 'amazon.se', 'amazon.pl', 'amazon.com.be', 'amazon.ie', 'amazon.ca',
  'amazon.com.mx', 'amazon.com.br', 'amazon.co.jp', 'amazon.in', 'amazon.com.au',
  'amazon.sg', 'amazon.ae', 'amazon.sa', 'amazon.eg', 'amazon.com.tr'
];

// Site-specific rules, used by the 'sites' category.
// hosts match the domain and its subdomains. A param name ending in '*' is a prefix.
// canonical(urlObj) may return a shorter path; the query string is then dropped entirely.
const siteRules = [
  {
    id: 'amazon',
    hosts: AMAZON_DOMAINS,
    canonical: urlObj => {
      const match = urlObj.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?=[/?#]|$)/i);
      return match ? `/dp/${match[1]}` : null;
    },
    params: [
      { name: 'ref', reason: 'Amazon referral tracking' },
      { name: 'ref_', reason: 'Amazon referral tracking' },
      { name: 'pf_rd_*', reason: 'Amazon page placement tracking' },
      { name: 'pd_rd_*', reason: 'Amazon recommendation tracking' },
      { name: 'psc', reason: 'Amazon product selection tracking' },
      { name: 'content-id', reason: 'Amazon placement tracking' },
      { name: 'th', reason: 'Amazon variation tracking' },
      { name: 'crid', reason: 'Amazon search session tracking' },
      { name: 'sprefix', reason: 'Amazon search typing tracking' },
      { name: 'qid', reason: 'Amazon search time tracking' },
      { name: 'sr', reason: 'Amazon search rank tracking' },
      { name: 'dib', reason: 'Amazon encoded tracking data' },
      { name: 'dib_tag', reason: 'Amazon encoded tracking data' }
    ]
  },
  {
    id: 'youtube',
    hosts: ['youtube.com', 'youtu.be'],
    params: [
      { name: 'si', reason: 'YouTube share ID, can link the link to your account' },
      { name: 'is', reason: 'YouTube share ID' },
      { name: 'pp', reason: 'YouTube search tracking' },
      { name: 'feature', reason: 'YouTube referral tracking' }
    ]
  },
  {
    id: 'instagram',
    hosts: ['instagram.com'],
    params: [
      { name: 'igsh', reason: 'Instagram share ID, different for each sharer' },
      { name: 'igshid', reason: 'Instagram share ID, different for each sharer' }
    ]
  },
  {
    id: 'twitter',
    hosts: ['x.com', 'twitter.com'],
    params: [
      { name: 's', reason: 'X share source tracking' },
      { name: 't', reason: 'X share ID, can link the link to your account' }
    ]
  },
  {
    id: 'tiktok',
    hosts: ['tiktok.com'],
    params: [
      { name: '_r', reason: 'TikTok share tracking' },
      { name: '_t', reason: 'TikTok share ID' },
      { name: 'is_from_webapp', reason: 'TikTok share tracking' },
      { name: 'sender_device', reason: 'TikTok sender device tracking' },
      { name: 'sender_web_id', reason: 'TikTok sender tracking' },
      { name: 'is_copy_url', reason: 'TikTok share tracking' },
      { name: 'share_app_id', reason: 'TikTok share tracking' },
      { name: 'share_link_id', reason: 'TikTok share ID' },
      { name: 'sec_user_id', reason: 'TikTok sender account ID' },
      { name: 'u_code', reason: 'TikTok sender ID' },
      { name: 'tt_from', reason: 'TikTok share source tracking' }
    ]
  },
  {
    id: 'spotify',
    hosts: ['open.spotify.com'],
    params: [
      { name: 'si', reason: 'Spotify share ID, can link the link to your account' },
      { name: 'context', reason: 'Spotify playback context, not needed to share' }
    ]
  },
  {
    id: 'linkedin',
    hosts: ['linkedin.com'],
    params: [
      { name: 'trk', reason: 'LinkedIn tracking' },
      { name: 'trackingId', reason: 'LinkedIn tracking ID' },
      { name: 'refId', reason: 'LinkedIn referral ID' },
      { name: 'lipi', reason: 'LinkedIn page impression tracking' },
      { name: 'midToken', reason: 'LinkedIn email tracking' },
      { name: 'midSig', reason: 'LinkedIn email tracking' },
      { name: 'trkEmail', reason: 'LinkedIn email tracking' }
    ]
  }
];

// Redirect links that wrap the real destination in a query param, used by the 'unwrap' category.
// hosts match the domain and its subdomains (hostPattern is used instead when given).
// path is matched exactly, or as a prefix when it ends in '*'; no path matches any path.
const redirectRules = [
  { name: 'Google', hostPattern: /(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/, path: '/url', params: ['q', 'url'] },
  { name: 'Facebook', hosts: ['l.facebook.com', 'lm.facebook.com'], path: '/l.php', params: ['u'] },
  { name: 'Instagram', hosts: ['l.instagram.com'], params: ['u'] },
  { name: 'Outlook Safe Links', hosts: ['safelinks.protection.outlook.com'], params: ['url'] },
  { name: 'YouTube', hosts: ['youtube.com'], path: '/redirect', params: ['q'] },
  { name: 'Reddit', hosts: ['out.reddit.com'], params: ['url'] },
  { name: 'LinkedIn', hosts: ['linkedin.com'], path: '/redir/redirect', params: ['url'] },
  { name: 'Steam', hosts: ['steamcommunity.com'], path: '/linkfilter*', params: ['url', 'u'] }
];

// Nested redirects deeper than this are left as they are
const MAX_UNWRAP_DEPTH = 3;

// All categories, including the rule-based 'sites' and 'unwrap' categories
const CATEGORIES = ['sites', 'unwrap', ...Object.keys(categoryParams)];

// Categories that existed before knownCategories was stored (v1.2.1 and earlier)
const LEGACY_CATEGORIES = ['google', 'facebook', 'microsoft', 'social', 'email', 'amazon', 'generic'];

// Turn on categories added since the user's last update; ones they turned off stay off
function enableNewCategories(enabledCategories, knownCategories = LEGACY_CATEGORIES) {
  const added = CATEGORIES.filter(category =>
    !knownCategories.includes(category) && !enabledCategories.includes(category)
  );
  return [...enabledCategories, ...added];
}

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'enabledCategories',
  KNOWN_CATEGORIES: 'knownCategories',
  CUSTOM_PARAMS: 'customParams',
  STATS: 'stats'
};

function hostMatches(host, domains) {
  return domains.some(domain => host === domain || host.endsWith('.' + domain));
}

// Apply the matching site rule (if any), recording what was removed
function applySiteRules(urlObj, removed) {
  const rule = siteRules.find(r => hostMatches(urlObj.hostname, r.hosts));
  if (!rule) {
    return;
  }

  const reasonFor = name => rule.params.find(p =>
    p.name.endsWith('*') ? name.startsWith(p.name.slice(0, -1)) : p.name === name
  )?.reason;

  const canonicalPath = rule.canonical && rule.canonical(urlObj);
  if (canonicalPath) {
    if (canonicalPath !== urlObj.pathname) {
      urlObj.pathname = canonicalPath;
      removed.push({ param: 'path', reason: 'Shortened to the product link' });
    }
    new Set(urlObj.searchParams.keys()).forEach(name => {
      removed.push({ param: name, reason: reasonFor(name) || 'Not needed for the product link' });
    });
    urlObj.search = '';
    return;
  }

  new Set(urlObj.searchParams.keys()).forEach(name => {
    const reason = reasonFor(name);
    if (reason) {
      urlObj.searchParams.delete(name);
      removed.push({ param: name, reason });
    }
  });
}

function redirectRuleFor(urlObj) {
  return redirectRules.find(rule => {
    const hostOk = rule.hostPattern
      ? rule.hostPattern.test(urlObj.hostname)
      : hostMatches(urlObj.hostname, rule.hosts);
    const pathOk = !rule.path || (rule.path.endsWith('*')
      ? urlObj.pathname.startsWith(rule.path.slice(0, -1))
      : urlObj.pathname === rule.path);
    return hostOk && pathOk;
  });
}

// Replace redirect links with the URL they point to, recording each one unwrapped.
// Only http(s) destinations are accepted, so javascript: or data: URLs are never produced.
function unwrapRedirects(urlObj, removed) {
  for (let depth = 0; depth < MAX_UNWRAP_DEPTH; depth++) {
    const rule = redirectRuleFor(urlObj);
    const target = rule && rule.params.map(p => urlObj.searchParams.get(p)).find(Boolean);
    if (!target) {
      break;
    }

    let targetObj;
    try {
      targetObj = new URL(target);
    } catch {
      break;
    }
    if (targetObj.protocol !== 'http:' && targetObj.protocol !== 'https:') {
      break;
    }

    removed.push({ param: 'redirect', reason: `${rule.name} redirect removed` });
    urlObj = targetObj;
  }
  return urlObj;
}

// Clean URL based on enabled categories and custom params.
// Returns { url, removedCount, removed: [{ param, reason }] }
function cleanURL(url, enabledCategories, customParams) {
  try {
    let urlObj = new URL(url);
    const removed = [];

    // Unwrap redirect links first, so the real destination gets cleaned
    if (enabledCategories.includes('unwrap')) {
      urlObj = unwrapRedirects(urlObj, removed);
    }

    const removeParam = (param, reason) => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        removed.push({ param, reason });
      }
    };

    // Site-specific rules first
    if (enabledCategories.includes('sites')) {
      applySiteRules(urlObj, removed);
    }

    // Params from enabled categories
    enabledCategories.forEach(category => {
      (categoryParams[category] || []).forEach(param => removeParam(param, categoryReasons[category]));
    });

    // Custom params
    customParams.forEach(param => removeParam(param, 'Custom parameter'));

    // Remove any utm_* parameters (catch-all, part of the google category)
    if (enabledCategories.includes('google')) {
      new Set(urlObj.searchParams.keys()).forEach(param => {
        if (param.toLowerCase().startsWith('utm_')) {
          removeParam(param, 'Campaign tracking (UTM)');
        }
      });
    }

    // Clean up trailing '?'
    let cleanedURL = urlObj.toString();
    if (cleanedURL.endsWith('?')) {
      cleanedURL = cleanedURL.slice(0, -1);
    }

    return { url: cleanedURL, removedCount: removed.length, removed };
  } catch (error) {
    console.error('Error cleaning URL:', error);
    return { url, removedCount: 0, removed: [] };
  }
}

// Export for Node tests (module is undefined in the extension)
if (typeof module !== 'undefined') {
  module.exports = { cleanURL, enableNewCategories, categoryParams, siteRules, redirectRules, CATEGORIES, STORAGE_KEYS };
}
