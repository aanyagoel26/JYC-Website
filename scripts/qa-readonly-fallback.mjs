import fs from 'node:fs';
import assert from 'node:assert/strict';

const main=fs.readFileSync('src/main.jsx','utf8');
const styles=fs.readFileSync('src/styles.css','utf8');
const fallbacks=fs.readFileSync('src/content/jyc-public-fallbacks.js','utf8');
const registry=fs.readFileSync('src/jyc-hub-registry.js','utf8');

assert.ok(main.includes('function readOnlySiteFallback(reason,sourceData)'), 'read-only fallback helper must exist');
assert.ok(main.includes('allowContentFallback:true,allowGalleryFallback:false,allowTeamFallback:true'), 'offline fallback must use published public content without unreviewed PDF gallery media');
assert.ok(main.includes("return {...base,__readOnlyFallback:true,__fallbackReason:reason"), 'fallback state must be explicit');
assert.ok(main.includes("return readOnlySiteFallback('Live Supabase is not configured.')"), 'missing Supabase configuration must fall back safely');
assert.ok(main.includes('return readOnlySiteFallback(missingRpc?'), 'RPC failures must fall back safely');
assert.ok(main.includes("if(data.__readOnlyFallback)throw Error('JYC is in read-only public mode."), 'content writes must be blocked in read-only mode');
assert.ok(main.includes('data.__readOnlyFallback||!online||error'), 'read-only fallback state must be visible to visitors');
assert.ok(main.includes('Limited public mode · showing curated public content.'), 'fallback banner must disclose limited mode');
assert.ok(main.includes('delete safeNext.__readOnlyFallback;delete safeNext.__fallbackReason;'), 'fallback metadata must never be persisted to Supabase');
assert.ok(main.includes('const fallback=readOnlySiteFallback(reason);setData(fallback);writeSiteCache(fallback);'), 'timeout and runtime load failures must also use fallback content');
assert.ok(styles.includes('.connection-notice.fallback'), 'read-only notice must have a responsive style');
assert.ok(fallbacks.includes('PUBLIC_EVENT_FALLBACK') && fallbacks.includes('PUBLIC_TEAM_FALLBACK'), 'curated public fallback records must exist');
assert.ok(registry.includes('publicationStatus'), 'published hub registry status must be present');
assert.ok(main.includes('hasCorePublicContent') && main.includes('hasPublishedRows'), 'partial or unpublished-only collections must be completed from curated fallback in read-only mode');
console.log('PASS: read-only public fallback is source-gated, disclosed, and blocks writes');
