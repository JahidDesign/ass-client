import React from "react";
import { FaMapMarkedAlt, FaHeadset, FaUsers, FaCalendarCheck } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://i.ibb.co/fdk9BqmB/outside-building.jpg')",
        }}
        aria-label="Tours Hero Banner"
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0  bg-opacity-60" />

        {/* Hero Content */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Explore Our <span className="text-yellow-400">Tours</span>
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Discover breathtaking destinations, curated packages, and stress-free travel experiences just for you.
          </p>
        </div>
      </section>

      {/* Features Section (Optional) */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center">
          <FaMapMarkedAlt className="text-3xl text-blue-600 mb-2" />
          <h3 className="font-semibold text-lg">Custom Itineraries</h3>
          <p className="text-sm text-gray-600">Designed to match your preferences and budget.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaCalendarCheck className="text-3xl text-green-600 mb-2" />
          <h3 className="font-semibold text-lg">Flexible Scheduling</h3>
          <p className="text-sm text-gray-600">Choose travel dates that work best for you.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaHeadset className="text-3xl text-purple-600 mb-2" />
          <h3 className="font-semibold text-lg">24/7 Support</h3>
          <p className="text-sm text-gray-600">We’re always here to assist you during your journey.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaUsers className="text-3xl text-red-600 mb-2" />
          <h3 className="font-semibold text-lg">Group or Solo</h3>
          <p className="text-sm text-gray-600">Perfect options whether you're alone or with others.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
