import { supabase } from './lib/supabase';

export const SITE_CACHE_KEY = 'jyc-site-cache-v15';
export const SITE_CACHE_META_KEY = 'jyc-site-cache-meta-v15';
export const SAVED_EVENT_PREFIX = 'jyc-saved-event-';
export const SAVED_CLUB_PREFIX = 'jyc-saved-club-';
export const REMINDER_PREFIX = 'jyc-local-reminder-';

const read = (key, fallback = null) => {
  try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch { return fallback; }
};
const PERSISTABLE_KEY = /^(?:jyc-site-cache-v15|jyc-site-cache-meta-v15|jyc-saved-event-[a-zA-Z0-9_-]{1,120}|jyc-saved-club-[a-zA-Z0-9_-]{1,120}|jyc-local-reminder-[a-zA-Z0-9_-]{1,120})$/;
const PRIVATE_VALUE_FIELD = /(?:access.?token|refresh.?token|authorization|password|passwd|secret|session.?key|credential|api.?key|user.?id|account.?id|contact.?email|contact.?phone|private.?key|admin.?note)/i;
function containsPrivateValue(value, depth = 0) {
  if (depth > 8 || value == null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(item => containsPrivateValue(item, depth + 1));
  return Object.entries(value).some(([key, item]) => PRIVATE_VALUE_FIELD.test(key) || containsPrivateValue(item, depth + 1));
}
const write = (key, value) => {
  try {
    if (!PERSISTABLE_KEY.test(String(key))) return false;
    const serialized = String(value);
    if (key === SITE_CACHE_KEY) {
      const parsed = JSON.parse(serialized);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || containsPrivateValue(parsed)) return false;
    } else if (key.startsWith(REMINDER_PREFIX)) {
      const parsed = JSON.parse(serialized);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || containsPrivateValue(parsed)) return false;
    } else if (key === SITE_CACHE_META_KEY && !Number.isFinite(Date.parse(serialized))) {
      return false;
    } else if ((key.startsWith(SAVED_EVENT_PREFIX) || key.startsWith(SAVED_CLUB_PREFIX)) && serialized !== '1') {
      return false;
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch { return false; }
};
const remove = key => { try { localStorage.removeItem(key); return true; } catch { return false; } };
const reminderTimers = new Map();

export function readSiteCache() {
  try {
    const raw = read(SITE_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  } catch { return null; }
}

const PRIVATE_CACHE_FIELD = /(?:^|_)(?:access.?token|refresh.?token|authorization|password|passwd|secret|session|credential|api.?key|user.?id|account.?id|contact.?email|contact.?phone|phone|email|private|submission|registration.?data|admin.?note|certificate|certificates|client.?cert|private.?key|public.?key)(?:$|_)/i;

// The offline cache is for public presentation only. Keep the data useful for
// rendering while refusing to persist identity, authentication, or submission
// fields that might be added to the RPC response in a future schema change.
function publicCacheSnapshot(value, depth = 0) {
  if (depth > 8) return undefined;
  if (value == null || typeof value !== 'object') {
    return typeof value === 'function' || typeof value === 'symbol' ? undefined : value;
  }
  if (Array.isArray(value)) return value.map(item => publicCacheSnapshot(item, depth + 1)).filter(item => item !== undefined);
  const safe = {};
  for (const [key, item] of Object.entries(value)) {
    const normalizedKey = key.replace(/[A-Z]/g, letter => '_' + letter.toLowerCase()).toLowerCase();
    if (PRIVATE_CACHE_FIELD.test(normalizedKey)) continue;
    const sanitized = publicCacheSnapshot(item, depth + 1);
    if (sanitized !== undefined) safe[key] = sanitized;
  }
  return safe;
}

export function writeSiteCache(data) {
  try {
    const snapshot = publicCacheSnapshot(data);
    if (!snapshot || typeof snapshot !== 'object') return;
    write(SITE_CACHE_KEY, JSON.stringify(snapshot));
    write(SITE_CACHE_META_KEY, new Date().toISOString());
  } catch {}
}

export function siteCacheAge() {
  const raw = read(SITE_CACHE_META_KEY);
  if (!raw) return null;
  const age = Date.now() - new Date(raw).getTime();
  return Number.isFinite(age) ? Math.max(0, age) : null;
}

export function formatCacheAge(ms) {
  if (ms == null) return '';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function setSaved(kind, id, value) {
  const key = `${kind === 'club' ? SAVED_CLUB_PREFIX : SAVED_EVENT_PREFIX}${id}`;
  if (value) write(key, '1'); else remove(key);
  window.dispatchEvent(new CustomEvent('jyc-saved-changed', { detail: { kind, id, saved: value } }));
}

export function isSaved(kind, id) {
  return read(`${kind === 'club' ? SAVED_CLUB_PREFIX : SAVED_EVENT_PREFIX}${id}`) === '1';
}

export function subscribeSaved(callback) {
  const onCustom = () => callback();
  const onStorage = e => {
    if (e.key?.startsWith(SAVED_CLUB_PREFIX) || e.key?.startsWith(SAVED_EVENT_PREFIX)) callback();
  };
  window.addEventListener('jyc-saved-changed', onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('jyc-saved-changed', onCustom);
    window.removeEventListener('storage', onStorage);
  };
}

export function googleCalendarUrl(event) {
  const compact = (date, time, fallback = '00:00') => {
    if (!date) return '';
    const d = String(date).replaceAll('-', '');
    const raw = String(time || fallback).trim();
    const [hhRaw, mmRaw] = raw.split(':');
    const hh = String(Math.max(0, Math.min(23, Number(hhRaw || 0)))).padStart(2, '0');
    const mm = String(Math.max(0, Math.min(59, Number(mmRaw || 0)))).padStart(2, '0');
    return `${d}T${hh}${mm}00`;
  };
  const start = compact(event.date, event.start);
  if (!start) return '';
  const startDate = new Date(`${event.date}T${event.start || '09:00'}:00`);
  const endDate = event.end ? new Date(`${event.date}T${event.end}:00`) : new Date(startDate.getTime() + 60 * 60 * 1000);
  const end = event.end ? compact(event.date, event.end) : compact(event.date, endDate.toTimeString().slice(0,5));
  if (!end) return '';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'JYC Event',
    dates: `${start}/${end}`,
    details: event.description || '',
    location: event.venue || ''
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function localReminderKey(eventId) { return `${REMINDER_PREFIX}${eventId}`; }

export function hasLocalReminder(eventId) {
  return Boolean(read(localReminderKey(eventId)));
}

export function clearLocalReminder(eventId) {
  const timer = reminderTimers.get(eventId);
  if (timer) window.clearTimeout(timer);
  reminderTimers.delete(eventId);
  remove(localReminderKey(eventId));
  window.dispatchEvent(new CustomEvent('jyc-reminder-changed', { detail: { eventId, enabled: false } }));
}

export async function scheduleEventReminder(event, userId = null) {
  if (!event?.id || !event?.date) throw new Error('This event does not have a valid date yet.');
  const start = new Date(`${event.date}T${event.start || '09:00'}:00`);
  const reminderAt = new Date(start.getTime() - 60 * 60 * 1000);
  if (reminderAt.getTime() <= Date.now()) throw new Error('This event starts in less than an hour.');

  if (userId) {
    const { error } = await supabase.from('jyc_event_reminders').upsert({
      event_id: String(event.id), user_id: userId, reminder_at: reminderAt.toISOString()
    }, { onConflict: 'event_id,user_id,reminder_at' });
    if (error) throw error;
  }

  write(localReminderKey(event.id), JSON.stringify({ eventId: event.id, reminderAt: reminderAt.toISOString(), title: event.title, url: `/events/${event.id}` }));
  armLocalReminder(event);
  window.dispatchEvent(new CustomEvent('jyc-reminder-changed', { detail: { eventId: event.id, enabled: true } }));
  return reminderAt;
}

export function armLocalReminder(event) {
  if (!event?.id || !event?.date) return;
  const raw = read(localReminderKey(event.id));
  if (!raw) return;
  let reminder;
  try { reminder = JSON.parse(raw); } catch { return; }
  if (reminderTimers.has(event.id)) window.clearTimeout(reminderTimers.get(event.id));
  const delay = new Date(reminder.reminderAt).getTime() - Date.now();
  if (!Number.isFinite(delay) || delay <= 0) return;
  if (delay > 2147483647) {
    const timer = window.setTimeout(() => armLocalReminder(event), 2147483647);
    reminderTimers.set(event.id, timer);
    return;
  }
  const timer = window.setTimeout(async () => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(`JYC reminder · ${event.title}`, {
          body: 'Your event starts in about an hour.',
          icon: '/JYC%20Logo(4).png',
          tag: `jyc-${event.id}`
        });
        notification.onclick = () => { window.focus(); window.location.href = `/events/${event.id}`; };
      }
    } finally { clearLocalReminder(event.id); }
  }, delay);
  reminderTimers.set(event.id, timer);
}

export function armStoredReminders(events = []) {
  events.forEach(event => { if (hasLocalReminder(event.id)) armLocalReminder(event); });
}
