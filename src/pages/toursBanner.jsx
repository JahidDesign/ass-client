import React, { useContext } from "react";
import { FaMapMarkedAlt, FaHeadset, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const textClass = isDark ? "text-gray-200" : "text-black";
  const overlayClass = isDark ? "bg-black/70" : "bg-black/60";
  

  return (
    <div className={isDark ? "bg-gray-900" : "bg-white"}>
      {/* Hero Banner Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://i.ibb.co/fdk9BqmB/outside-building.jpg')",
        }}
        aria-label="Tours Hero Banner"
      >
        {/* Dark Overlay */}
        <div className={`absolute inset-0 ${overlayClass}`} />

        {/* Hero Content */}
        <div className={`relative z-10 text-center px-4 ${textClass}`}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Explore Our <span className="text-yellow-400">Tours</span>
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Discover breathtaking destinations, curated packages, and stress-free travel experiences just for you.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
