import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if needed

const HeroSection = () => {
  const { theme } = useContext(ThemeContext); // light or dark

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[50vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/fzZgFM5m/vitalii-khodzinskyi-G0-CL4-UAm-Fqs-unsplash.jpg')",
        }}
      >
        {/* Overlay adapts to theme */}
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-black/70" : "bg-black/50"
          }`}
        />

        {/* Text Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-400">Contact</span> Us
          </h1>
          <p
            className={`text-lg max-w-xl mx-auto ${
              theme === "dark" ? "text-gray-200" : "text-gray-100"
            }`}
          >
            We'd love to hear from you — Reach out with any questions, suggestions, or booking inquiries.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
