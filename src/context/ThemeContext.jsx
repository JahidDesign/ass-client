import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children, user }) => {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Update theme when logged-in user changes
  useEffect(() => {
    if (!user) return;
    const userTheme = user.theme || "light"; // optional: read from user object
    if (userTheme !== theme) setTheme(userTheme);
  }, [user]);

  // Apply theme to <html> and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle function
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
