export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem("bws_session_id");
  if (!sessionId) {
    sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem("bws_session_id", sessionId);
  }
  return sessionId;
}

export function logActivity(type: string, payload: any = {}) {
  if (typeof window === 'undefined') return;
  const sessionId = getSessionId();
  
  // Fire and forget POST
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      actionType: type,
      path: window.location.pathname,
      details: payload
    })
  }).catch(e => console.error('Failed to log activity to backend', e));
}
