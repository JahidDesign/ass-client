import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // your firebase config

// Create context
export const AuthContext = createContext();

// Auth provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // stores user info + token
  const [loading, setLoading] = useState(true);

  // Load user + token from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // Watch Firebase auth state for cross-tab or session signouts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    });
    return () => unsubscribe();
  }, []);

  // Persist user + token whenever it updates
  useEffect(() => {
    if (user) {
      const { token, ...rest } = user;
      localStorage.setItem("user", JSON.stringify(rest));
      if (token) localStorage.setItem("token", token);
    }
  }, [user]);

  // Login function to set user + token
  const login = (userData, token) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
