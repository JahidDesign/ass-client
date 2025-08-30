import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children, user }) => {
  
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;

      if (user?.theme) return user.theme; // user saved preference

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [userToggled, setUserToggled] = useState(false);

  
  useEffect(() => {
    if (user?.theme && !userToggled) {
      setTheme(user.theme);
    }
  }, [user, userToggled]);

 
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    if (userToggled) localStorage.setItem("theme", theme);
  }, [theme, userToggled]);

  
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
    setUserToggled(true); // mark as user preference
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
