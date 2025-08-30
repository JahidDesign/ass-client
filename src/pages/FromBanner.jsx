// src/components/HeroSection.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/YGzLzxY/What-are-some-hidden-gems-off-the-beaten-path-in-Sylhet.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-black bg-opacity-60" : "bg-black bg-opacity-40"
          }`}
        ></div>

        {/* Text Content */}
        <div className="relative z-10 text-center px-4">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Our{" "}
            <span className="text-yellow-400">Tour Packages</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Discover handpicked travel packages for your perfect getaway — from serene nature escapes to vibrant city adventures.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
