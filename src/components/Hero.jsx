import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import GlitchText from './GlitchText';
import NeonButton from './NeonButton';

const Hero = ({ handleNavClick }) => {
  const { theme } = useTheme();
  const [setTitleRef, titleStyle] = useFadeIn();
  const [setSubtitleRef, subtitleStyle] = useFadeIn();
  const [setButtonsRef, buttonsStyle] = useFadeIn();

  // Apply delays using data attributes
  useEffect(() => {
    const subtitleEl = setSubtitleRef.current;
    const buttonsEl = setButtonsRef.current;
    if (subtitleEl) subtitleEl.dataset.delay = '0.2s';
    if (buttonsEl) buttonsEl.dataset.delay = '0.4s';
  }, [setSubtitleRef, setButtonsRef]);

  return (
    <section className="hero-container" id="home" role="banner" aria-label="Hero section">
      <div className="cyberpunk-grid" aria-hidden="true"></div>
      <div
        className="hero-silhouette"
        onError={(e) => { e.target.style.backgroundImage = 'url(\'https://placehold.co/1920x1080/cccccc/666666?text=Image+Error\')'; }}
        aria-hidden="true"
      ></div>
      <div className="hero-content">
        <div ref={setTitleRef} style={titleStyle}>
          <GlitchText tag="h1" className="hero-title" aria-label="Vizion Wealth">
            Vizion<span className="text-[--neon-purple]" style={{ textShadow: '0 0 8px var(--neon-purple)' }}>Wealth</span>
          </GlitchText>
        </div>
        <p ref={setSubtitleRef} style={subtitleStyle} className="hero-subtitle" aria-live="polite">
          Cleveland's Premier Digital Marketing Consultant
        </p>
        <div ref={setButtonsRef} style={buttonsStyle} className="flex flex-col sm:flex-row justify-center gap-4">
          <NeonButton href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Get Started</NeonButton>
          <NeonButton href="#services" onClick={(e) => handleNavClick(e, 'services')}>Explore Services</NeonButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;