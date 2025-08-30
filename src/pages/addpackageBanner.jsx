import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if needed

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);
  const bgOverlay = theme === "dark" ? " bg-opacity-60" : " bg-opacity-40";
  const textColor = theme === "dark" ? "text-gray-100" : "text-white";

  return (
    <div className={theme === "dark" ? "bg-gray-900" : "bg-white"}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[50vh] bg-cover bg-bottom flex items-center justify-center transition-colors duration-300"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/DxqQXHg/561766903.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className={`absolute inset-0 ${bgOverlay} transition-colors duration-300`}></div>

        {/* Text Content */}
        <div className={`relative z-10 text-center px-4 ${textColor}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Why<span className="text-yellow-400">Travel</span> With Us?
          </h1>
          <p className="text-lg mb-6">
            Beyond Borders, Beyond Expectations
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
