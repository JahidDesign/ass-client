import React, { useContext } from "react";
import { FaGlobe, FaPlane, FaUmbrellaBeach, FaUsers } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext"; // adjust path if needed

const AboutSection = () => {
  const { theme } = useContext(ThemeContext);

  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-[#f5f5f5]";
  const textClass = theme === "dark" ? "text-gray-100" : "text-black";
  const cardBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardTextClass = theme === "dark" ? "text-gray-200" : "text-gray-700";

  return (
    <section className={`${bgClass} py-16 px-6 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className={`text-4xl font-bold mb-4 ${textClass}`}>About Our Travel Agency</h2>
        <p className={`text-lg max-w-3xl mx-auto ${cardTextClass}`}>
          We are a passionate team of travel enthusiasts dedicated to helping
          you discover the world. Whether you're dreaming of sandy beaches,
          vibrant cities, or tranquil mountains, we make your dream vacation
          a reality.
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto text-center">
        <div className={`p-6 rounded-lg shadow-md ${cardBgClass}`}>
          <FaGlobe className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>Global Reach</h3>
          <p className={cardTextClass}>
            Explore over 100+ destinations worldwide with hand-picked packages.
          </p>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${cardBgClass}`}>
          <FaPlane className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>Seamless Travel</h3>
          <p className={cardTextClass}>
            We handle everything from flights to stays to ensure stress-free adventures.
          </p>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${cardBgClass}`}>
          <FaUmbrellaBeach className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>Unique Experiences</h3>
          <p className={cardTextClass}>
            Our custom packages offer unforgettable moments curated just for you.
          </p>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${cardBgClass}`}>
          <FaUsers className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>Customer First</h3>
          <p className={cardTextClass}>
            Our 24/7 support and friendly team make your satisfaction our top priority.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
