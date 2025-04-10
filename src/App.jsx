import React, { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Banner from './components/Banner';
import About from './components/About';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => { console.log('SW registered: ', registration.scope); })
          .catch(error => { console.log('SW registration failed: ', error); });
      });
    }
  }, []);

  const handleNavClick = (e, targetId) => {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
          const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;
          window.scrollTo({ top: targetPosition < 0 ? 0 : targetPosition, behavior: 'smooth' });
      }
  };

  return (
    <ThemeProvider>
        <Navbar handleNavClick={handleNavClick} />
        <ErrorBoundary>
          <main>
            <Hero handleNavClick={handleNavClick} />
            <Banner
                src="https://placehold.co/1200x350/777777/ffffff/png?text=About+Us+Banner+(aboutussection.jpeg)"
                alt="Silhouettes of marketers in a futuristic, purple-lit digital corridor"
            />
            <About />
            {/* Render Placeholder Sections */}
            <PlaceholderSection id="services" name="Services" color="rgba(0,0,255,0.1)" />
            <PlaceholderSection id="portfolio" name="Portfolio" color="rgba(255,255,0,0.1)" />
            <PlaceholderSection id="blog" name="Blog" color="rgba(0,255,255,0.1)" />
            <PlaceholderSection id="prompts" name="Prompts" color="rgba(255,0,255,0.1)" />
            <PlaceholderSection id="contact" name="Contact" color="rgba(128,128,128,0.1)" />
        </main>
        </ErrorBoundary>
    </ThemeProvider>
  );
}

const PlaceholderSection = ({ id, name, color }) => (
    <div id={id} style={{ minHeight: '80vh', backgroundColor: color, paddingTop: '80px' }}>
        <h1 className="text-center pt-20 text-4xl opacity-50">{name} Placeholder</h1>
    </div>
);

export default App;