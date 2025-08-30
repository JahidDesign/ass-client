import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const userName = user?.displayName || "Traveler";

  return (
    <div className={isDark ? "bg-gray-900 text-gray-200" : "bg-white text-black"}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[50vh] bg-cover bg-bottom flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/pjZkHXfB/simon-berger-twuk-N12-EN7c-unsplash.jpg')",
        }}
      >
        {/* Dark/Light overlay */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-black/70"
              : "bg-black/30"
          }`}
        ></div>

        {/* Text Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-green-300" : "text-white"}`}>
            Welcome to <span className="text-yellow-400">{userName}</span>
          </h1>
          <p className={`text-lg mb-6 ${isDark ? "text-gray-200" : "text-white"}`}>
            Beyond Borders, Beyond Expectations
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
