import React, { useContext } from "react";
import { Plane, Hotel, MapPin, Sun, Moon } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

// Reusable highlight card
const Highlight = ({ icon, text, theme, variant }) => {
  const base =
    "flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg transform";

  const variants = {
    blue:
      theme === "dark"
        ? "bg-blue-900/30 border-blue-500/30 text-blue-300 hover:bg-blue-800/40"
        : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    red:
      theme === "dark"
        ? "bg-red-900/30 border-red-500/30 text-red-300 hover:bg-red-800/40"
        : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    green:
      theme === "dark"
        ? "bg-green-900/30 border-green-500/30 text-green-300 hover:bg-green-800/40"
        : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  };

  return (
    <div className={`${base} ${variants[variant]}`}>
      {icon}
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );
};

const AboutMe = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <section
      className={`w-full relative ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800 shadow-lg transition"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">
        {/* Full Image (Left) */}
        <div className="relative h-[400px] md:h-[600px] w-full">
          <img
            src="https://i.ibb.co/nNWcJw2T/Tanguar-Haor.png"
            alt="Tanguar Haor"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Content (Right) */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-12 gap-8">
          <div className="space-y-6">
            <span
              className={`text-sm uppercase font-semibold tracking-widest ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              } animate-pulse`}
            >
              Your trusted travel & hotel booking partner in Sylhet
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to Jahid Holiday Homes & Tourism
            </h2>
          </div>

          <p
            className={`text-base md:text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Explore the beauty of{" "}
            <span className="font-bold text-green-600 relative">
              Sylhet
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-blue-500"></span>
            </span>{" "}
            with our thoughtfully crafted tour packages, comfortable hotels, and personalized travel services. Whether you're seeking serene landscapes, cultural experiences, or adventurous activities, we provide tailored itineraries to make your trip unforgettable.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Highlight icon={<Plane className="w-5 h-5" />} text="Tours" theme={theme} variant="blue" />
            <Highlight icon={<Hotel className="w-5 h-5" />} text="Hotels" theme={theme} variant="red" />
            <Highlight icon={<MapPin className="w-5 h-5" />} text="Travel Services" theme={theme} variant="green" />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg relative overflow-hidden group">
              <span className="relative z-10">More About Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <button
              className={`border-2 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group ${
                theme === "dark"
                  ? "border-green-400 text-green-400 hover:bg-green-900/30 hover:border-green-300"
                  : "border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700"
              }`}
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
