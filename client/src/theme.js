import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const baseURL = "http://localhost:5000";
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Effect to set the dark mode preference based on system preference
  useEffect(() => {
    // You can use the 'matchMedia' API to check if the system prefers dark mode.
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
    
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, baseURL }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext, baseURL };
