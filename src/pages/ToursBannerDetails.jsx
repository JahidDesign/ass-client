import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ToursBanner = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const handleExploreClick = () => {
    alert("Explore Tours clicked!");
  };

  const overlayClass = isDark ? "bg-black bg-opacity-60" : "bg-black bg-opacity-40";
  const textClass = isDark ? "text-gray-200" : "text-white";
  const buttonClass = isDark
    ? "bg-yellow-400 hover:bg-yellow-500 text-black"
    : "bg-yellow-500 hover:bg-yellow-600 text-black";

  return (
    <div
      className="w-full h-40 md:h-48 relative flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`}></div>

      {/* Content */}
      <div className={`relative text-center px-4 ${textClass}`}>
        <h1 className="text-lg md:text-2xl font-bold mb-1">
          Discover Amazing Tours
        </h1>
        <p className="text-sm md:text-lg mb-2">
          Explore top destinations with us.
        </p>
        <button
          onClick={handleExploreClick}
          className={`font-semibold py-1 px-4 rounded text-sm md:text-base ${buttonClass}`}
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default ToursBanner;
