// Run from the repo root with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { cleanURL, enableNewCategories, CATEGORIES } = require('../cleaner.js');

const ALL = CATEGORIES;
const WITHOUT_GOOGLE = ALL.filter(c => c !== 'google');
const WITHOUT_SITES = ALL.filter(c => c !== 'sites');
const clean = url => cleanURL(url, ALL, []).url;

// Silence the expected console.error from invalid URLs
test.beforeEach(() => { console.error = () => {}; });

test('removes tracking params from enabled categories', () => {
  const result = cleanURL('https://example.com/?a=1&utm_source=x&fbclid=y&gclid=z', ALL, []);
  assert.equal(result.url, 'https://example.com/?a=1');
  assert.equal(result.removedCount, 3);
});

test('removes any utm_* param when google is enabled', () => {
  const result = cleanURL('https://example.com/?a=1&utm_foo=x&UTM_Bar=y', ALL, []);
  assert.equal(result.url, 'https://example.com/?a=1');
});

test('keeps utm_* params when google is disabled', () => {
  const result = cleanURL('https://example.com/?a=1&utm_foo=x&utm_source=y&fbclid=z', WITHOUT_GOOGLE, []);
  assert.equal(result.url, 'https://example.com/?a=1&utm_foo=x&utm_source=y');
  assert.equal(result.removedCount, 1);
});

test('removes custom params', () => {
  const result = cleanURL('https://example.com/?keep=1&myparam=2', [], ['myparam']);
  assert.equal(result.url, 'https://example.com/?keep=1');
});

test('drops the trailing ? when every param is removed', () => {
  const result = cleanURL('https://example.com/page?fbclid=abc', ALL, []);
  assert.equal(result.url, 'https://example.com/page');
});

test('keeps the fragment', () => {
  const result = cleanURL('https://example.com/page?fbclid=abc#section', ALL, []);
  assert.equal(result.url, 'https://example.com/page#section');
});

test('leaves clean URLs unchanged', () => {
  const result = cleanURL('https://example.com/page?id=42', ALL, []);
  assert.equal(result.url, 'https://example.com/page?id=42');
  assert.equal(result.removedCount, 0);
});

test('returns invalid URLs unchanged', () => {
  const result = cleanURL('not a url', ALL, []);
  assert.deepEqual(result, { url: 'not a url', removedCount: 0, removed: [] });
});

test('reports what was removed and why', () => {
  const result = cleanURL('https://example.com/?a=1&utm_foo=x&fbclid=y&mine=z', ALL, ['mine']);
  assert.deepEqual(result.removed, [
    { param: 'fbclid', reason: 'Facebook click tracking' },
    { param: 'mine', reason: 'Custom parameter' },
    { param: 'utm_foo', reason: 'Campaign tracking (UTM)' }
  ]);
  assert.equal(result.removedCount, 3);
});

// Site-specific rules

test('amazon: shortens product links to /dp/ASIN', () => {
  assert.equal(
    clean('https://www.amazon.com/Some-Product-Name/dp/B08N5WRWNW/ref=sr_1_3?crid=2X&keywords=x&qid=1700&sr=8-3&th=1'),
    'https://www.amazon.com/dp/B08N5WRWNW'
  );
  assert.equal(
    clean('https://www.amazon.co.uk/gp/product/B0C1234567?pf_rd_r=ABC&psc=1'),
    'https://www.amazon.co.uk/dp/B0C1234567'
  );
});

test('amazon: cleans non-product pages but keeps the search query', () => {
  assert.equal(
    clean('https://www.amazon.de/s?k=headphones&crid=ABC&sprefix=head%2Caps%2C90&ref=nb_sb_noss'),
    'https://www.amazon.de/s?k=headphones'
  );
});

test('amazon: canonical product link counts the shortened path', () => {
  const result = cleanURL('https://www.amazon.com/Name/dp/B08N5WRWNW', ALL, []);
  assert.equal(result.url, 'https://www.amazon.com/dp/B08N5WRWNW');
  assert.deepEqual(result.removed, [{ param: 'path', reason: 'Shortened to the product link' }]);
});

test('amazon rules do not apply to look-alike domains', () => {
  assert.equal(
    clean('https://notamazon.com/x/dp/B08N5WRWNW?keep=1'),
    'https://notamazon.com/x/dp/B08N5WRWNW?keep=1'
  );
});

test('youtube: removes share IDs, keeps video, time and playlist', () => {
  assert.equal(
    clean('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42&list=PL123&si=abc123&pp=ygU'),
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42&list=PL123'
  );
  assert.equal(clean('https://youtu.be/dQw4w9WgXcQ?si=abc123'), 'https://youtu.be/dQw4w9WgXcQ');
  assert.equal(clean('https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=share'), 'https://m.youtube.com/watch?v=dQw4w9WgXcQ');
});

test('instagram: removes igsh', () => {
  assert.equal(clean('https://www.instagram.com/p/ABC123/?igsh=MWQ1ZGUx'), 'https://www.instagram.com/p/ABC123/');
});

test('x/twitter: removes s and t only on x.com and twitter.com', () => {
  assert.equal(clean('https://x.com/user/status/123?s=20&t=abcDEF'), 'https://x.com/user/status/123');
  assert.equal(clean('https://twitter.com/user/status/123?s=46'), 'https://twitter.com/user/status/123');
  // t is a timestamp elsewhere and must stay
  assert.equal(clean('https://example.com/video?t=30'), 'https://example.com/video?t=30');
});

test('tiktok: removes sharer tracking', () => {
  assert.equal(
    clean('https://www.tiktok.com/@user/video/123?is_from_webapp=1&sender_device=pc&_r=1&_t=8abc'),
    'https://www.tiktok.com/@user/video/123'
  );
});

test('spotify: removes si', () => {
  assert.equal(clean('https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=abc123'), 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC');
});

test('linkedin: removes trk and tracking IDs', () => {
  assert.equal(
    clean('https://www.linkedin.com/posts/someone_activity-123?trk=public_post&trackingId=abc%3D%3D'),
    'https://www.linkedin.com/posts/someone_activity-123'
  );
});

test('site rules are skipped when the sites category is off', () => {
  assert.equal(
    cleanURL('https://youtu.be/dQw4w9WgXcQ?si=abc123', WITHOUT_SITES, []).url,
    'https://youtu.be/dQw4w9WgXcQ?si=abc123'
  );
});

// Settings migration

test('migration: turns on new categories for users upgrading from v1.2.x', () => {
  const enabled = ['google', 'facebook', 'social'];
  assert.deepEqual(enableNewCategories(enabled, undefined), ['google', 'facebook', 'social', 'sites']);
});

test('migration: keeps categories the user turned off', () => {
  // sites is already known, so it stays off
  assert.deepEqual(enableNewCategories(['google'], CATEGORIES), ['google']);
});
