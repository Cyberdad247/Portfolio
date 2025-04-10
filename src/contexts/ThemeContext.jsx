import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export // --- Constants ---
const THEME_STORAGE_KEY = 'vizionWealthTheme';

// --- Theme Context ---
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default to dark

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    // Update body class whenever the theme state changes
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    }
    // Save the theme preference to local storage
    localStorage.setItem('vizionWealthTheme', theme);
  }, [theme]); // Re-run this effect when the theme state changes

  // Memoized theme toggling function
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []); // No dependencies, function definition doesn't change

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}