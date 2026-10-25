// Fake chrome.* APIs so popup.html can be rendered outside the extension.
// Loaded after cleaner.js (it uses CATEGORIES) and before popup.js by build/popup.html.
// The scenario comes from the page's query string:
//   url    URL of the "current tab"
//   off    comma-separated categories to switch off
//   open   1 to expand the "removed" list
//   scroll CSS selector to scroll into view (e.g. .categories-section)
const params = new URLSearchParams(location.search);

const store = {
  customParams: ['my_ref'],
  stats: { cleanedCount: 1284, paramsRemoved: 3917 }
};
if (params.get('off')) {
  const off = params.get('off').split(',');
  store.enabledCategories = CATEGORIES.filter(c => !off.includes(c));
}

window.chrome = {
  tabs: {
    query: async () => [{ url: params.get('url') || 'https://example.com/', title: 'Example' }]
  },
  storage: {
    local: {
      get: async keys => {
        const result = {};
        [].concat(keys).forEach(k => { if (store[k] !== undefined) result[k] = store[k]; });
        return result;
      },
      set: async obj => Object.assign(store, obj)
    }
  },
  commands: { getAll: async () => [{ name: 'copy-clean-url', shortcut: 'Alt+Shift+C' }] }
};

window.addEventListener('load', () => setTimeout(() => {
  if (params.get('open')) {
    document.getElementById('removedDetails').open = true;
  }
  if (params.get('scroll')) {
    document.querySelector(params.get('scroll')).scrollIntoView();
  }
}, 50));
