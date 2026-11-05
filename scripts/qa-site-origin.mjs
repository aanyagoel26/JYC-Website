import assert from 'node:assert/strict';
import { resolveSiteOrigin } from './site-origin.mjs';

assert.equal(resolveSiteOrigin({ VITE_CANONICAL_ORIGIN: 'https://www.jyc.example/path/', VERCEL_PROJECT_PRODUCTION_URL: 'preview.vercel.app' }), 'https://www.jyc.example');
assert.equal(resolveSiteOrigin({ VERCEL: '1', VERCEL_PROJECT_PRODUCTION_URL: 'jyc-production.vercel.app', VERCEL_URL: 'jyc-preview.vercel.app' }), 'https://jyc-production.vercel.app');
assert.throws(() => resolveSiteOrigin({ VERCEL: '1', VERCEL_URL: 'jyc-preview.vercel.app' }), /Canonical origin is missing/);
assert.equal(resolveSiteOrigin({}), 'http://localhost:5173');
assert.throws(() => resolveSiteOrigin({ VERCEL: '1' }), /Canonical origin is missing/);
assert.throws(() => resolveSiteOrigin({ VITE_CANONICAL_ORIGIN: 'javascript:alert(1)' }), /HTTP\(S\)/);
assert.throws(() => resolveSiteOrigin({ VITE_CANONICAL_ORIGIN: 'https://user:pass@example.com' }), /credential-free/);
console.log('PASS: canonical origin resolver (7 cases)');
