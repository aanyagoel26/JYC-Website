export function resolveSiteOrigin(env = process.env) {
  const first = (...values) => values.map(value => String(value || '').trim()).find(Boolean) || '';
  const explicit = first(env.VITE_CANONICAL_ORIGIN, env.JYC_CANONICAL_ORIGIN, env.VITE_SITE_URL);
  // A Vercel preview hostname is never a canonical origin. Require the project production URL or an explicit override.
  const deployment = first(env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL === '1' ? '' : env.VERCEL_URL);
  const candidate = explicit || deployment || (env.VERCEL === '1' ? '' : 'http://localhost:5173');
  if (!candidate) {
    throw new Error('Canonical origin is missing. Set VITE_CANONICAL_ORIGIN or provide Vercel deployment URL metadata.');
  }
  const normalized = /^[a-z][a-z\d+.-]*:\/\//i.test(candidate) ? candidate : 'https://' + candidate;
  let parsed;
  try { parsed = new URL(normalized); }
  catch { throw new Error('Canonical origin must be a valid HTTP(S) origin.'); }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('Canonical origin must be a credential-free HTTP(S) origin without a path, query or fragment.');
  }
  if (env.VERCEL === '1' && (parsed.protocol !== 'https:' || ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname))) {
    throw new Error('A Vercel build must resolve to an HTTPS deployment or explicitly configured production origin.');
  }
  return parsed.origin;
}
