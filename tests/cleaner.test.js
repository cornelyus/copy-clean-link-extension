// Run from the repo root with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { cleanURL, categoryParams } = require('../cleaner.js');

const ALL = Object.keys(categoryParams);
const WITHOUT_GOOGLE = ALL.filter(c => c !== 'google');

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
  assert.deepEqual(result, { url: 'not a url', removedCount: 0 });
});
