// src/components/TravelAbout.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const TravelAbout = () => {
  const { theme } = useContext(ThemeContext);

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const headingColor = theme === "dark" ? "text-blue-400" : "text-blue-800";

  return (
    <section className={`${bgColor} py-16 px-4 md:px-10`}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Image */}
        <div>
          <img
            src="https://i.ibb.co/TDK5Fsv8/hanin-abouzeid-aeq8g-J5-Zkc-A-unsplash.jpg"
            alt="Travel illustration"
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        {/* Right: Text Content */}
        <div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${headingColor}`}>
            Discover the World with Us
          </h2>
          <p className={`text-lg mb-6 leading-relaxed ${textColor}`}>
            At <strong>GlobeTrek Travel</strong>, we believe that travel is more than a destination—it's a journey of discovery. 
            Whether you're planning a family vacation, honeymoon, solo adventure, or business trip, we are here to make your travel seamless and unforgettable.
          </p>
          <ul className={`list-disc list-inside space-y-2 ${textColor}`}>
            <li>Curated flight & hotel packages for every budget</li>
            <li>Expert advice and 24/7 customer support</li>
            <li>Special discounts on early bookings</li>
            <li>Secure online booking and instant confirmation</li>
          </ul>

          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default TravelAbout;
