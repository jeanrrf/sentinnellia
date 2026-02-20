// useAnalytics.ts
// Custom hook to wrap Google Analytics 4 (gtag) events
// All events are anonymous — no PII is sent to GA4.

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        GA_INITIALIZED?: boolean;
    }
}

type EventName =
    | 'page_view'
    | 'mentorship_click'
    | 'form_start'
    | 'form_submit'
    | 'form_abandon'
    | 'exit_intent_shown'
    | 'cta_click'
    | 'cookie_accept'
    | 'cookie_decline';

interface EventParams {
    [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: EventName, params?: EventParams): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', event, params ?? {});
    }
}

export function useAnalytics() {
    return { trackEvent };
}
