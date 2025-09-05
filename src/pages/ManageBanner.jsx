// src/components/HeroSection.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Hero Banner Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/q3t7Phrn/928569781.jpg')",
        }}
        aria-label="Tour Management Banner"
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0  bg-opacity-50" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Tour <span className="text-yellow-400">Management</span>
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Simplify your tour bookings, track packages, and take control of
            your travel experience with ease.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      
    </div>
  );
};

export default HeroSection;
