import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, Shield, X } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { trackEvent } from '../utils/useAnalytics';

const CONSENT_KEY = 'sentinnellia_cookie_consent';

// ─── Load GA4 only after user consent ────────────────────────────────────────
function loadGA4() {
    // Replace G-XXXXXXXXXX with your real Google Analytics 4 Measurement ID
    // Get yours free at: https://analytics.google.com/
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

    if (window.GA_INITIALIZED) return;
    window.GA_INITIALIZED = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.gtag = function (...args: unknown[]) {
        // eslint-disable-next-line prefer-rest-params
        (window as unknown as { dataLayer: unknown[] }).dataLayer =
            (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
        (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
}

declare global {
    interface Window {
        GA_INITIALIZED?: boolean;
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

const CookieConsent: FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Small delay so it doesn't flash immediately on load
            const t = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(t);
        }
        if (consent === 'accepted') {
            loadGA4();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
        loadGA4();
        trackEvent('cookie_accept');
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        setVisible(false);
        trackEvent('cookie_decline');
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 120, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[200] glass-card-strong rounded-2xl p-5 border border-neon-500/20 shadow-2xl"
                    role="dialog"
                    aria-label="Aviso de Cookies"
                >
                    <button
                        onClick={handleDecline}
                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-neon-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Cookie className="w-5 h-5 text-neon-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                                <Shield size={13} className="text-neon-400" /> Privacidade &amp; Cookies
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Usamos cookies para melhorar sua experiência e analisar o tráfego anonimamente,
                                conforme a <strong className="text-gray-300">LGPD</strong>. Seus dados nunca são
                                vendidos.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAccept}
                            id="cookie-accept-btn"
                            className="flex-1 bg-neon-500 hover:bg-neon-600 text-black font-bold text-xs py-2.5 rounded-xl transition-all"
                        >
                            Aceitar
                        </button>
                        <button
                            onClick={handleDecline}
                            id="cookie-decline-btn"
                            className="flex-1 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-medium text-xs py-2.5 rounded-xl transition-all"
                        >
                            Recusar
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
