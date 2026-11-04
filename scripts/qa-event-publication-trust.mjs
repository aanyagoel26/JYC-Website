import assert from 'node:assert/strict';
import { PUBLIC_EVENT_FALLBACK, JAI_OFFICIAL_MEDIA } from '../src/content/jyc-public-fallbacks.js';
import { mergePublicEvents } from '../src/lib/public-content.js';
import { JYC_HUB_SOURCE_REGISTRY } from '../src/jyc-hub-registry.js';
import fs from 'node:fs';

const unverifiedFallbackIds = [
  'ride-hack-2026','ebullience-2026','reverberance-2026','rangmanch-2026',
  'cybersrishti-2026','codeclash-2026','vamfest-2026','aakriti-art-fiesta-2026',
  'kshitij-sports-2026','panache-runway-2026','grand-conclave-2026'
];
for (const id of unverifiedFallbackIds) {
  const event = PUBLIC_EVENT_FALLBACK.find(item => item.id === id);
  assert.ok(event, `fallback record exists for ${id}`);
  assert.equal(event.published, false, `${id} must remain unpublished until event-level sources verify its details`);
}

const jai = PUBLIC_EVENT_FALLBACK.find(item => item.id === 'jai-2026-jaypee-agentic-ai-hackathon');
assert.equal(jai?.published, true);
assert.equal(jai?.featured, false, 'completed JAI event must not remain featured');
assert.equal(jai?.pinned, false, 'completed JAI event must not remain pinned');

assert.equal(JAI_OFFICIAL_MEDIA.find(item => item.id === 'jai-2026-campus')?.mediaKind, 'photo');
assert.equal(JAI_OFFICIAL_MEDIA.find(item => item.id === 'jai-2026-qr')?.mediaKind, 'qr');
assert.ok(JAI_OFFICIAL_MEDIA.filter(item => item.id !== 'jai-2026-campus').every(item => item.mediaKind && item.mediaKind !== 'photo'));

for (const name of ['Arcadia', 'Neural Nexus']) {
  const hub = JYC_HUB_SOURCE_REGISTRY.find(item => item.name === name);
  assert.equal(hub?.publicationStatus, 'draft', `${name} remains publication-gated until its official identity is verified`);
}
const mainSource = fs.readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
assert.ok(mainSource.includes("filter(([name])=>publicHubNames.has(name))"), 'static fallback clubs must follow the source registry publication gate');
assert.ok(mainSource.includes("published:false,status:'source-material'"), 'source-only clubs must not become public profiles');

const liveApproved = { id: 'ride-hack-2026', published: true, title: 'Organiser-approved live record' };
const merged = mergePublicEvents([liveApproved], PUBLIC_EVENT_FALLBACK);
assert.equal(merged.find(item => item.id === liveApproved.id), liveApproved, 'live CMS publication must override hidden fallback');
assert.equal(mergePublicEvents([liveApproved], PUBLIC_EVENT_FALLBACK, false).length, 1, 'fallbacks must be disabled when requested');
assert.equal(mergePublicEvents([], PUBLIC_EVENT_FALLBACK).length, PUBLIC_EVENT_FALLBACK.length);

console.log(`PASS: public content publication trust (${unverifiedFallbackIds.length} gated fallbacks, typed media, live CMS precedence)`);
