import { AnimatePresence, motion } from 'framer-motion';
import {
  Fingerprint,
  FolderCode,
  Github,
  Globe,
  GraduationCap,
  Home,
  Menu,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  X
} from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { OFFICIAL_CONTACT, getWhatsAppDirectUrl } from '../utils/leadSync';
import { smoothScrollTo } from '../utils/scroll';
import { trackEvent } from '../utils/useAnalytics';
import ContactModal from './ContactModal';
import Logo from './Logo';

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/', isRoute: true, icon: <Home size={14} /> },
    { name: 'Mentoria', href: '/mentoria', isRoute: true, icon: <GraduationCap size={14} /> },
    { name: 'Ecossistema', href: '#ecosystem', isRoute: false, icon: <Globe size={14} /> },
    { name: 'Projetos', href: '#projects', isRoute: false, icon: <FolderCode size={14} /> },
    { name: 'Contato', href: '#contact-modal', isRoute: false, isModal: true, icon: <PhoneCall size={14} /> },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>,
    link: any
  ) => {
    if (link.isModal) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      setIsContactModalOpen(true);
      return;
    }

    if (link.isRoute) {
      if (link.href === '/' && location.pathname === '/') {
        e.preventDefault();
        smoothScrollTo('home');
      } else {
        setIsMobileMenuOpen(false);
      }
    } else {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      const targetId = link.href.replace('#', '');

      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => smoothScrollTo(targetId), 100);
      } else {
        smoothScrollTo(targetId);
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-4 bg-black/70 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="cursor-pointer"
            onClick={(e) => handleNavClick(e, { href: '/', isRoute: true })}
          >
            <Logo size={36} showText={true} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isMentorship = link.href === '/mentoria';
              if (link.isModal) {
                return (
                  <button
                    key={link.name}
                    onClick={(e) => handleNavClick(e, link)}
                    className="text-sm font-medium transition-colors relative flex items-center gap-1.5 text-gray-400 hover:text-white"
                  >
                    {link.icon}
                    {link.name}
                  </button>
                );
              }
              const Component: any = link.isRoute ? Link : 'a';
              return (
                <Component
                  key={link.name}
                  to={link.isRoute ? link.href : undefined}
                  href={!link.isRoute ? link.href : undefined}
                  onClick={(e: any) => handleNavClick(e, link)}
                  className={`text-sm font-medium transition-colors relative flex items-center gap-1.5 after:content-[''] after:absolute after:w-0 after:h-px after:bottom-[-4px] after:left-0 after:transition-all ${
                    isMentorship
                      ? 'text-neon-400 after:bg-neon-500 bg-neon-500/10 px-3 py-1 rounded-full border border-neon-500/30 hover:after:w-full hover:border-neon-500/60'
                      : 'text-gray-400 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] after:bg-neon-500 hover:after:w-full'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Component>
              );
            })}

            {/* Direct Contact Button */}
            <button
              onClick={() => {
                trackEvent('mentorship_click', { location: 'navbar_btn' });
                setIsContactModalOpen(true);
              }}
              id="navbar-cta-contact"
              className="flex items-center gap-2 bg-neon-500 hover:bg-neon-600 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95"
            >
              <MessageSquare size={14} />
              <span>Entre em Contato</span>
            </button>

            {/* WhatsApp Direct */}
            <a
              href={getWhatsAppDirectUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30 transition-all text-xs font-mono"
              title="WhatsApp Direto"
            >
              <MessageCircle size={14} />
              <span className="hidden lg:inline">{OFFICIAL_CONTACT.whatsappDisplay}</span>
            </a>

            <a
              href="https://github.com/jeanrrf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10 transition-all text-xs font-medium text-gray-300 hover:text-white"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>

            {/* Admin Access */}
            <Link
              to="/leads-dashboard"
              className="w-7 h-7 flex items-center justify-center text-white/20 hover:text-neon-400 transition-colors"
              title="Painel Administrativo de Leads"
            >
              <Fingerprint size={16} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-900/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-3">
                {navLinks.map((link) => {
                  const isMentorship = link.href === '/mentoria';
                  if (link.isModal) {
                    return (
                      <button
                        key={link.name}
                        onClick={(e) => handleNavClick(e, link)}
                        className="px-4 py-2.5 text-base font-medium rounded-lg text-left transition-colors flex items-center gap-3 text-gray-300 hover:text-neon-400 hover:bg-white/5"
                      >
                        {link.icon}
                        {link.name}
                      </button>
                    );
                  }
                  const Component: any = link.isRoute ? Link : 'a';
                  return (
                    <Component
                      key={link.name}
                      to={link.isRoute ? link.href : undefined}
                      href={!link.isRoute ? link.href : undefined}
                      onClick={(e: any) => handleNavClick(e, link)}
                      className={`px-4 py-2.5 text-base font-medium rounded-lg transition-colors flex items-center gap-3 ${
                        isMentorship
                          ? 'bg-neon-500/20 text-neon-400 border border-neon-500/30'
                          : 'text-gray-300 hover:text-neon-400 hover:bg-white/5'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Component>
                  );
                })}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsContactModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-neon-500 text-black py-3 rounded-xl font-bold text-sm uppercase tracking-wider mt-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  <MessageSquare size={16} /> Falar com Jean Rosso
                </button>

                <a
                  href={getWhatsAppDirectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-mono font-bold"
                >
                  <MessageCircle size={16} /> WhatsApp: {OFFICIAL_CONTACT.whatsappDisplay}
                </a>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <a
                    href="https://github.com/jeanrrf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
                  >
                    <Github size={16} /> GitHub
                  </a>
                  <Link
                    to="/leads-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-400 font-mono"
                  >
                    <Fingerprint size={14} /> Admin
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
