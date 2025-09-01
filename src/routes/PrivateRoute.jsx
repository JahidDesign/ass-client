import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Shield } from "lucide-react"; 

const LoadingScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Pulsing shield */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center animate-pulse shadow-2xl">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 animate-ping"></div>
      </div>

      {/* Text */}
      <div className="text-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Checking Authentication
        </h2>
        <p
          className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Please wait a moment...
        </p>
      </div>

      {/* Bouncing dots */}
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;

  return user && user.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
