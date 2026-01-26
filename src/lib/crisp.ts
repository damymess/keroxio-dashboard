// Crisp Chat Configuration
// Documentation: https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID || '';

// Initialize Crisp chat widget
export function initCrisp() {
  if (!CRISP_WEBSITE_ID) {
    console.warn('[Crisp] No Website ID configured. Chat widget disabled.');
    return;
  }

  // Prevent double initialization
  if (window.$crisp) {
    return;
  }

  window.$crisp = [];
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

  // Load Crisp script
  const script = document.createElement('script');
  script.src = 'https://client.crisp.chat/l.js';
  script.async = true;
  document.head.appendChild(script);

  // Configure Crisp appearance after load
  script.onload = () => {
    // Set chat position to bottom-right
    window.$crisp.push(['config', 'position:reverse', false]);

    // Set locale to French
    window.$crisp.push(['config', 'locale', 'fr']);

    // Hide chat by default (optional - remove if you want it always visible)
    // window.$crisp.push(['do', 'chat:hide']);

    if (import.meta.env.DEV) {
      console.log('[Crisp] Chat widget initialized');
    }
  };
}

// Identify user in Crisp (call after login)
export function setCrispUser(email: string, nickname?: string, data?: Record<string, string | number | boolean>) {
  if (!window.$crisp) return;

  window.$crisp.push(['set', 'user:email', [email]]);

  if (nickname) {
    window.$crisp.push(['set', 'user:nickname', [nickname]]);
  }

  if (data) {
    // Set custom session data
    const sessionData: [string, string | number | boolean][] = Object.entries(data).map(([key, value]) => [key, value]);
    window.$crisp.push(['set', 'session:data', [sessionData]]);
  }
}

// Set user company (garage)
export function setCrispCompany(name: string, data?: Record<string, string | number | boolean>) {
  if (!window.$crisp) return;

  const companyData: Record<string, unknown> = { name };
  if (data) {
    Object.assign(companyData, data);
  }
  window.$crisp.push(['set', 'user:company', [companyData]]);
}

// Reset user (call on logout)
export function resetCrispUser() {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'session:reset']);
}

// Open chat widget
export function openCrispChat() {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'chat:open']);
}

// Close chat widget
export function closeCrispChat() {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'chat:close']);
}

// Show chat widget (if hidden)
export function showCrispChat() {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'chat:show']);
}

// Hide chat widget
export function hideCrispChat() {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'chat:hide']);
}

// Send a message to support (pre-fill)
export function sendCrispMessage(message: string) {
  if (!window.$crisp) return;
  window.$crisp.push(['do', 'message:send', ['text', message]]);
}

// Set a trigger event
export function triggerCrispEvent(eventName: string, data?: Record<string, unknown>) {
  if (!window.$crisp) return;
  window.$crisp.push(['set', 'session:event', [[eventName, data]]]);
}

// Check if Crisp is available
export function isCrispAvailable(): boolean {
  return Boolean(window.$crisp && CRISP_WEBSITE_ID);
}
