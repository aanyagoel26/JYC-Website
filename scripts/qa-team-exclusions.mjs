import fs from 'node:fs';
import assert from 'node:assert/strict';

const app = fs.readFileSync('src/main.jsx', 'utf8').toLowerCase();
const fallback = fs.readFileSync('src/content/jyc-public-fallbacks.js', 'utf8').toLowerCase();
const media = fs.readFileSync('src/jyc-team-media.js', 'utf8').toLowerCase();

assert.ok(app.includes("excludedteamnames=new set(['harisha','dhruv choudhary'])"), 'Removed team profiles must be filtered from live CMS records');
assert.ok(!fallback.includes("name:'harisha'") && !fallback.includes("name:'dhruv choudhary'"), 'Removed profiles must not return through public fallback data');
assert.ok(media.includes("'divye bajaj': '/assets/team/divye-bajaj.webp'"), 'Divye must use the approved local portrait asset');

console.log('Team exclusion and portrait mapping QA passed (3 checks)');
