import React, { useContext } from "react";
import { FaMapMarkedAlt, FaHeadset, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const textClass = isDark ? "text-gray-200" : "text-black";
  const overlayClass = isDark ? "bg-black/70" : "bg-black/60";
  const featureTextClass = isDark ? "text-gray-300" : "text-gray-600";

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

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center">
          <FaMapMarkedAlt className="text-3xl text-blue-600 mb-2" />
          <h3 className="font-semibold text-lg">Custom Itineraries</h3>
          <p className={`text-sm ${featureTextClass}`}>Designed to match your preferences and budget.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaCalendarCheck className="text-3xl text-green-600 mb-2" />
          <h3 className="font-semibold text-lg">Flexible Scheduling</h3>
          <p className={`text-sm ${featureTextClass}`}>Choose travel dates that work best for you.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaHeadset className="text-3xl text-purple-600 mb-2" />
          <h3 className="font-semibold text-lg">24/7 Support</h3>
          <p className={`text-sm ${featureTextClass}`}>We’re always here to assist you during your journey.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaUsers className="text-3xl text-red-600 mb-2" />
          <h3 className="font-semibold text-lg">Group or Solo</h3>
          <p className={`text-sm ${featureTextClass}`}>Perfect options whether you're alone or with others.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
