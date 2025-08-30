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
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2
          className={`text-3xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Manage Your Tour Packages Seamlessly
        </h2>
        <p
          className={`max-w-2xl mx-auto mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Whether you're editing itineraries or reviewing bookings, our powerful
          dashboard helps you stay organized and efficient.
        </p>
        <a
          href="/manage"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
        >
          Go to Tour Manager
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
