import { AnimatePresence, motion } from 'framer-motion';
import { Fingerprint, FolderCode, Github, Globe, GraduationCap, Home, Menu, MessageSquare, PhoneCall, Settings, X } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '../utils/scroll';
import { trackEvent } from '../utils/useAnalytics';

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { name: 'Soluções', href: '#features', isRoute: false, icon: <Settings size={14} /> },
    { name: 'Projetos', href: '#projects', isRoute: false, icon: <FolderCode size={14} /> },
    { name: 'Contato', href: '#about', isRoute: false, icon: <PhoneCall size={14} /> },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, link: any) => {
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
        // Pequeno delay para garantir que a home carregou antes de scrollar
        setTimeout(() => smoothScrollTo(targetId), 100);
      } else {
        smoothScrollTo(targetId);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-black/50 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group"
          onClick={(e) => handleNavClick(e, { href: '/', isRoute: true })}
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-neon-600 to-neon-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all duration-300">
            <span className="text-black font-bold text-lg">⚡</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-tight">
              SENTINNELL <span className="text-neon-400">IA</span>
            </span>
            <span className="text-xs text-neon-400 font-medium">Revolução em IA</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isMentorship = link.href === '/mentoria';
            const Component: any = link.isRoute ? Link : 'a';
            return (
              <Component
                key={link.name}
                to={link.isRoute ? link.href : undefined}
                href={!link.isRoute ? link.href : undefined}
                onClick={(e: any) => handleNavClick(e, link)}
                className={`text-sm font-medium transition-colors relative flex items-center gap-1.5 after:content-[''] after:absolute after:w-0 after:h-px after:bottom-[-4px] after:left-0 after:transition-all ${isMentorship
                  ? 'text-neon-400 after:bg-neon-500 bg-neon-500/10 px-3 py-1 rounded-full border border-neon-500/30 hover:after:w-full hover:border-neon-500/60'
                  : 'text-gray-400 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] after:bg-neon-500 hover:after:w-full'
                  }`}
              >
                {link.icon}
                {link.name}
              </Component>
            );
          })}
          <Link
            to="/mentoria"
            id="navbar-cta-contact"
            onClick={() => trackEvent('mentorship_click', { location: 'navbar' })}
            className="flex items-center gap-2 bg-neon-500 hover:bg-neon-600 text-black px-4 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] animate-pulse-slow"
          >
            <MessageSquare size={14} />
            <span>Entre em Contato</span>
          </Link>
          <a
            href="https://github.com/jeanrrf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-neon-600 px-4 py-2 rounded-full border border-white/10 hover:border-neon-500 transition-all text-sm font-medium hover:text-black"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          {/* Subtle Admin Access */}
          <Link
            to="/leads-dashboard"
            className="w-8 h-8 flex items-center justify-center text-white/10 hover:text-neon-400/50 transition-colors"
            title="Acesso Admin"
          >
            <Fingerprint size={16} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
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
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-3">
              {navLinks.map((link) => {
                const isMentorship = link.href === '/mentoria';
                const Component: any = link.isRoute ? Link : 'a';
                return (
                  <Component
                    key={link.name}
                    to={link.isRoute ? link.href : undefined}
                    href={!link.isRoute ? link.href : undefined}
                    onClick={(e: any) => handleNavClick(e, link)}
                    className={`px-4 py-2 text-base font-medium rounded-lg transition-colors flex items-center gap-3 ${isMentorship
                      ? 'bg-neon-500/20 text-neon-400 border border-neon-500/30 hover:bg-neon-500/30'
                      : 'text-gray-300 hover:text-neon-400 hover:bg-white/5'
                      }`}
                  >
                    {link.icon}
                    {link.name}
                  </Component>
                );
              })}
              <a
                href="https://github.com/jeanrrf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neon-400 font-medium px-4 py-2 pt-4 border-t border-white/10 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Github size={18} /> Acessar GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
