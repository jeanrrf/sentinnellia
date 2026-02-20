import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/useAnalytics';

const FloatingCTA: FC = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    // Don't show on the lead page itself or the dashboard
    const isHidden =
        location.pathname === '/mentoria' || location.pathname === '/leads-dashboard';

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isHidden) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 right-6 z-[150]"
                >
                    <Link
                        to="/mentoria"
                        id="floating-cta-btn"
                        onClick={() => trackEvent('cta_click', { location: 'floating_fab' })}
                        className="group flex items-center gap-3 bg-neon-500 hover:bg-neon-600 text-black font-extrabold pl-4 pr-5 py-3.5 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.7)] transition-all duration-300"
                        aria-label="Falar com Mentor — Agendar Mentoria Gratuita"
                    >
                        {/* Pulsing ring */}
                        <span className="relative flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40" />
                            <MessageCircle className="relative w-5 h-5 fill-black" />
                        </span>
                        <span className="text-sm tracking-wide">Falar com Mentor</span>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCTA;
