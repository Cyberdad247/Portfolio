import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) {
      return <button className="text-xl p-1 ml-4 opacity-0" disabled aria-hidden="true"></button>;
  }

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={theme === 'dark'}
      className="text-[--theme-toggle-color] hover:text-[--theme-toggle-hover-color] transition-colors duration-300 text-xl p-1 ml-4"
    >
      <span className={theme === 'dark' ? 'block' : 'hidden'}><Sun size={20} /></span>
      <span className={theme === 'light' ? 'block' : 'hidden'}><Moon size={20} /></span>
    </button>
  );
};

export default ThemeToggle;