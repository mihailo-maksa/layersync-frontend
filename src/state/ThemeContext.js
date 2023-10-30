import React, { useState } from "react";

export const ThemeContext = React.createContext({
  isDarkMode: false,
  switchTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("mode"))
  );

  const switchTheme = () => {
    if (JSON.parse(localStorage.getItem("mode"))) {
      setIsDarkMode(true);
      localStorage.setItem("mode", JSON.stringify(true));
    } else {
      setIsDarkMode(false);
      localStorage.setItem("mode", JSON.stringify(false));
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
