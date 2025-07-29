import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState("medium");

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  return (
      <ThemeContext.Provider
          value={{ isDarkMode, fontSize, toggleDarkMode, changeFontSize }}
      >
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
