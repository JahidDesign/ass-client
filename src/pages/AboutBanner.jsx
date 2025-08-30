// src/components/HeroSection.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  const overlayColor = theme === "dark" ? "bg-black/60" : "bg-black/50";

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-black"}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[50vh] bg-cover bg-bottom flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/NgC4NcCq/big-home-gallery-2-1.jpg')",
        }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayColor}`}></div>

        {/* Text Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-400">About</span> Us
          </h1>
          <p className="text-lg">
            Discover who we are, what we stand for, and how we make travel experiences unforgettable.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
