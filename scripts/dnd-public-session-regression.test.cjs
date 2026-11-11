const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const source = fs.readFileSync('dnd/app.js', 'utf8');
const helperSource = [
  source.match(/const apiToken = .*?;\n/)?.[0],
  source.match(/function validShareToken\(value\)\{.*?\}\n/)?.[0],
  source.match(/function shareUrl\(value\)\{.*?\}\n/)?.[0],
  'globalThis.helpers={apiToken,validShareToken,shareUrl};',
].join('');

function helpers(href = 'https://sirb0b27.github.io/dnd/?old=1#section') {
  const context = {URL, location: {href}};
  vm.runInNewContext(helperSource, context);
  return context.helpers;
}

test('public-session link uses the backend camelCase token contract', () => {
  const api = helpers();
  const token = 'a'.repeat(96);
  assert.equal(api.apiToken({shareToken: token}, 'shareToken', 'share_token'), token);
  assert.equal(api.shareUrl(token), `https://sirb0b27.github.io/dnd/?share=${token}`);
});

test('legacy snake_case responses remain compatible', () => {
  const api = helpers();
  const token = 'b'.repeat(96);
  assert.equal(api.apiToken({public_token: token}, 'publicToken', 'public_token'), token);
  assert.equal(api.validShareToken(token), true);
});

test('missing and undefined tokens cannot produce a public-session URL', () => {
  const api = helpers();
  for (const token of ['', 'undefined', 'null', 'short']) {
    assert.equal(Boolean(api.validShareToken(token)), false);
    assert.throws(() => api.shareUrl(token), /did not return a valid public-session link/);
  }
});
