import fs from 'node:fs';
import assert from 'node:assert/strict';

const app = fs.readFileSync('src/main.jsx', 'utf8').toLowerCase();
const fallback = fs.readFileSync('src/content/jyc-public-fallbacks.js', 'utf8').toLowerCase();
const media = fs.readFileSync('src/jyc-team-media.js', 'utf8').toLowerCase();

assert.ok(app.includes("excludedteamnames=new set(['harisha','dhruv choudhary'])"), 'Removed team profiles must be filtered from live CMS records');
assert.ok(!fallback.includes("name:'harisha'") && !fallback.includes("name:'dhruv choudhary'"), 'Removed profiles must not return through public fallback data');
assert.ok(media.includes("'divye bajaj': '/assets/team/divye-bajaj.webp'"), 'Divye must use the approved local portrait asset');

assert.ok(app.includes('id="team-directory"'), 'Team directory must have a stable in-page navigation target');
assert.ok(app.includes("meta.publicationStatus==='published'"), 'Team hub directory must exclude unpublished source entries');
assert.ok(app.includes("const roleOf=m=>[m.role,m.position,m.title].filter(Boolean).join"), 'Team grouping must consider all available role fields');
assert.ok(app.includes("const faculty=members.filter(m=>/faculty|advisor/i.test(roleOf(m)))"), 'Student coordinators must not be misclassified as faculty guides');
assert.ok(app.includes("Browse profiles <span aria-hidden=\"true\">↓</span>"), 'Team hero must link directly to the people directory');

console.log('Team exclusion, publication boundary, directory navigation and portrait mapping QA passed (8 checks)');
