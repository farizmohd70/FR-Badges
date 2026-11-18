// The address of your Cloudflare Worker, with no slash at the end.
window.FR_WORKER = 'https://fr-badge.mohdfari0022.workers.dev';

// Community made badges live in their own repo (people add badges from the site).
window.FR_COMMUNITY = 'https://raw.githubusercontent.com/farizmohd70/FR-Badges-Community/main/';
// Optional: a Cloudflare Turnstile site key (public) to turn on the "I am not a robot" check when sharing. Leave empty to skip.
window.FR_TURNSTILE = '0x4AAAAAAGCyFRTQ7RrXGf7w';

// A random anonymous maker id for this browser (12 hex characters). Nothing personal is in it.
window.frUid = async function () {
  try {
    let k = localStorage.getItem('fr_uid');
    if (!/^[0-9a-f]{32}$/.test(k || '')) { k = [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join(''); localStorage.setItem('fr_uid', k); }
    const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('frm:' + k));
    return [...new Uint8Array(d)].slice(0, 6).map(x => x.toString(16).padStart(2, '0')).join('');
  } catch (e) { return ''; }
};
