import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const AnimatedSection = ({ children, className = "" }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <section
      className={`relative w-full py-20 overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-100"
      } ${className}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
            isDark ? "bg-blue-600" : "bg-blue-200"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 ${
            isDark ? "bg-purple-600" : "bg-purple-200"
          } animate-pulse`}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <svg
            className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-500"} animate-bounce`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <div className="absolute top-40 right-20 opacity-30">
          <svg
            className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-500"} animate-pulse`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
      </div>

      {/* Section Content */}
      <div className="relative px-5 md:px-10">{children}</div>
    </section>
  );
};

export default AnimatedSection;
