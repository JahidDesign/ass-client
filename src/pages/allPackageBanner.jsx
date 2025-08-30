import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  // Dynamic styles based on theme
  const overlayStyle =
    theme === "dark"
      ? "absolute inset-0  bg-opacity-60"
      : "absolute inset-0  bg-opacity-40";

  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <div className={theme === "dark" ? "bg-gray-900" : "bg-white"}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[70vh] bg-cover bg-top flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/TqTt0Gcs/jakob-owens-Dh-S2f0-QO7z4-unsplash.jpg')",
        }}
      >
        {/* Dark/light overlay */}
        <div className={overlayStyle}></div>

        {/* Text Content */}
        <div className={`relative z-10 text-center px-4 ${textColor}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our <span className="text-yellow-400">Tour Packages</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Discover handpicked travel packages for your perfect getaway — from serene nature escapes to vibrant city adventures.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
