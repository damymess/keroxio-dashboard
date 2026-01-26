import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

// Initialize PostHog
export function initPostHog() {
  if (!POSTHOG_KEY) {
    console.warn('[PostHog] No API key configured. Analytics disabled.');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Error tracking (Exception Autocapture)
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    // Session replay for debugging errors
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-mask]',
    },
    // Performance
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        console.log('[PostHog] Initialized in development mode');
      }
    },
  });

  // Setup global error tracking
  setupErrorTracking();
}

// Global error tracking
function setupErrorTracking() {
  // Capture unhandled errors
  window.onerror = (message, source, lineno, colno, error) => {
    posthog.capture('$exception', {
      $exception_message: String(message),
      $exception_source: source,
      $exception_lineno: lineno,
      $exception_colno: colno,
      $exception_stack: error?.stack,
      $exception_type: error?.name || 'Error',
    });
    return false; // Let the error propagate
  };

  // Capture unhandled promise rejections
  window.onunhandledrejection = (event) => {
    const error = event.reason;
    posthog.capture('$exception', {
      $exception_message: error?.message || String(error),
      $exception_type: error?.name || 'UnhandledPromiseRejection',
      $exception_stack: error?.stack,
    });
  };
}

// Identify user (call after login)
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  posthog.identify(userId, properties);
}

// Reset user (call on logout)
export function resetUser() {
  posthog.reset();
}

// Track custom event
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  posthog.capture(eventName, properties);
}

// Track error manually
export function trackError(error: Error, context?: Record<string, unknown>) {
  posthog.capture('$exception', {
    $exception_message: error.message,
    $exception_type: error.name,
    $exception_stack: error.stack,
    ...context,
  });
}

// Feature flags
export function isFeatureEnabled(flagKey: string): boolean {
  return posthog.isFeatureEnabled(flagKey) ?? false;
}

export { posthog };
