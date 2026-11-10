import assert from 'node:assert/strict';
import { resolveSiteOrigin } from './site-origin.mjs';

// The frontend release validates explicit canonical-origin normalization and
// safe local fallback only. Deployment-provider behavior is outside this UI QA.
assert.equal(resolveSiteOrigin({ VITE_CANONICAL_ORIGIN: 'https://www.jyc.example/path/' }), 'https://www.jyc.example');
assert.equal(resolveSiteOrigin({ JYC_CANONICAL_ORIGIN: 'https://www.jyc.example/' }), 'https://www.jyc.example');
assert.equal(resolveSiteOrigin({}), 'http://localhost:5173');
assert.throws(() => resolveSiteOrigin({ VITE_CANONICAL_ORIGIN: 'javascript:alert(1)' }), /HTTP/);
assert.throws(() => resolveSiteOrigin({ VITE_CANONICAL_ORIGIN: 'https://user:pass@example.com' }), /credential-free/);
console.log('PASS: canonical origin normalization and safe local fallback (5 cases)');
