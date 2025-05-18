import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Pricing', target: 'pricing' },
    { label: 'Services', target: 'services' },
    { label: 'Trainers', target: 'trainers' },
    { label: 'About Us', target: 'about-us' },
    { label: 'FAQs', target: 'faqs' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}     
      transition={{ type: 'spring', stiffness: 70, damping: 25, delay: 0.3, mass: 0.5 }} 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-xl shadow-2xl border-b border-neutral-800/50'
          : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <motion.div
            initial={{ filter: 'none' }} 
            animate={{ filter: 'none' }} 
            transition={{ duration: 0.25, ease: 'easeInOut' }} 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            <img
              src="/assets/images/Logo.png"
              alt="Amigos Fitness Gym"
              className="h-12 w-12 lg:h-14 lg:w-14 rounded-full object-cover" 
            />
            <h1 className="text-xl lg:text-2xl font-bold text-white hidden sm:block">
              Amigo's <span className="text-[#bfa14a]">Fitness Gym</span>
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  text-neutral-300 hover:text-[#bfa14a] hover:bg-neutral-800/60 focus:outline-none focus:ring-2 focus:ring-[#bfa14a]/50"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 120 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg
              bg-neutral-800/50 text-white hover:bg-neutral-700/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#bfa14a]/50"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="times"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="bars"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="lg:hidden border-t border-neutral-800/50 bg-neutral-950/95 backdrop-blur-xl shadow-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.target)}
                  className="block w-full px-4 py-3 rounded-lg text-left text-base font-medium
                    text-neutral-300 hover:text-[#bfa14a] hover:bg-neutral-800/60 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#bfa14a]/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 120 }}
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;