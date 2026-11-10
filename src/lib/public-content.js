export function mergePublicEvents(liveEvents, fallbackEvents, allowFallback = true) {
  const live = Array.isArray(liveEvents) ? liveEvents : [];
  if (!allowFallback) return live;
  const fallback = Array.isArray(fallbackEvents) ? fallbackEvents : [];
  const liveIds = new Set(live.filter(event => event?.id != null).map(event => String(event.id)));
  return [...live, ...fallback.filter(event => event?.id == null || !liveIds.has(String(event.id)))];
}
