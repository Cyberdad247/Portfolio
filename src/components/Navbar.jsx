import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X } from 'lucide-react';
import GlitchText from './GlitchText';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ handleNavClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const SCROLL_THRESHOLD = 50; // Pixels to scroll before navbar changes

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
      { id: "about", label: "About" },
      { id: "services", label: "Services" },
      { id: "portfolio", label: "Portfolio" },
      { id: "blog", label: "Blog" },
      { id: "prompts", label: "Prompts" },
      { id: "contact", label: "Contact" },
  ];

  return (
    <nav id="navbar" className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container mx-auto px-4">
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="navbar-brand">
          <GlitchText tag="span">
            Vizion<span className="text-[--neon-purple]">Wealth</span>
          </GlitchText>
        </a>

        <div className="flex items-center">
          <ThemeToggle />
          <button
            className="navbar-toggle ml-3 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="navbar-menu-mobile"
            onClick={toggleMobileMenu}
            onKeyDown={handleKeyDown}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="navbar-menu hidden md:flex">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="nav-link"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div
        id="navbar-menu-mobile"
        className={`navbar-menu md:hidden fixed top-0 h-screen w-[70%] max-w-[300px] bg-[--bg-secondary] flex-col p-[80px_30px_30px] gap-[25px] transition-right duration-400 ease-in-out z-[999] shadow-[-5px_0_15px_rgba(0,0,0,0.2)] border-l border-[--bg-card-border] ${
          isMobileMenuOpen ? 'right-0' : 'right-[-100%]'
        }`}
        aria-hidden={!isMobileMenuOpen}
        role="menu"
        tabIndex={isMobileMenuOpen ? 0 : -1}
      >
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
                handleNavClick(e, item.id);
                setIsMobileMenuOpen(false); // Close menu on click
            }}
            className="nav-link text-lg text-center"
            role="menuitem"
            tabIndex={isMobileMenuOpen ? 0 : -1}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;