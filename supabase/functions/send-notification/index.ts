function readNamedKey(envName,fallbackEnv){const raw=Deno.env.get(envName);if(raw){try{const parsed=JSON.parse(raw);if(parsed?.default)return parsed.default}catch{}}return Deno.env.get(fallbackEnv)||''}
const getPublishableKey=()=>readNamedKey('SUPABASE_PUBLISHABLE_KEYS','SUPABASE_ANON_KEY');
const getSecretKey=()=>readNamedKey('SUPABASE_SECRET_KEYS','SUPABASE_SERVICE_ROLE_KEY');
import webpush from 'npm:web-push'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = new Set(
  (Deno.env.get('SITE_ORIGINS') || Deno.env.get('SITE_ORIGIN') || 'http://localhost:5173').split(',')
    .map((x) => x.trim())
    .filter(Boolean)
)
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'null',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin'
})
const reply = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', 'X-Content-Type-Options': 'nosniff' } })

Deno.serve(async req => {
  const origin = req.headers.get('Origin')
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (origin && !allowedOrigins.has(origin)) return reply({ error: 'Origin not allowed.' }, 403, origin)

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const service = getSecretKey()
    const anon = getPublishableKey()
    if (!url || !service || !anon) return reply({ error: 'Server configuration is incomplete.' }, 500, origin)

    const adminClient = createClient(url, service)
    const userClient = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } })
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) return reply({ error: 'Authentication required.' }, 401, origin)

    const { data: caller } = await adminClient.from('jyc_admins').select('role,is_active').eq('user_id', user.id).maybeSingle()
    if (!caller?.is_active || !['super_admin','jyc_admin'].includes(caller.role)) return reply({ error: 'Not authorized.' }, 403, origin)

    const contentLength = Number(req.headers.get('Content-Length') || 0)
    if (contentLength > 12000) return reply({ error: 'Request is too large.' }, 413, origin)

    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const privateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const subject = Deno.env.get('VAPID_SUBJECT') || 'mailto:jyc.website@gmail.com'
    if (!publicKey || !privateKey) return reply({ error: 'VAPID secrets are not configured on the Edge Function.' }, 500, origin)
    webpush.setVapidDetails(subject, publicKey, privateKey)

    const raw = await req.text()
    if (new TextEncoder().encode(raw).byteLength > 12000) return reply({ error: 'Request is too large.' }, 413, origin)
    let body: any
    try { body = JSON.parse(raw) } catch { return reply({ error: 'Invalid JSON request.' }, 400, origin) }
    const payload = JSON.stringify({
      title: String(body.title || 'JYC Update').slice(0, 80),
      body: String(body.message || 'A new JYC update is available.').slice(0, 240),
      url: String(body.url || '/').slice(0, 300)
    })
    const { data: subs, error } = await adminClient.from('jyc_push_subscriptions').select('id,endpoint,subscription')
    if (error) throw error

    let sent = 0, removed = 0
    for (const s of subs || []) {
      try {
        await webpush.sendNotification(s.subscription, payload)
        sent++
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await adminClient.from('jyc_push_subscriptions').delete().eq('id', s.id)
          removed++
        }
      }
    }
    return reply({ ok: true, sent, removed }, 200, origin)
  } catch (e) {
    return reply({ error: e instanceof Error ? e.message : 'Server error.' }, 500, origin)
  }
})
