import React from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const inputClass =
  "w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const TravelHeroBanner = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Background */}
      <section
        className="relative h-[65vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/KjPpS8pH/madison-olling-6wmx-DOa-AO4-unsplash.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0  bg-opacity-50"></div>

        {/* Heading */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where to <span className="text-yellow-400">Fly?</span>
          </h1>
          <p className="text-lg">Find Cheap Flights & Tickets in Bangladesh</p>
        </div>
      </section>

      {/* Search Card */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-8 -mt-28">
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-10">
          {/* Trip Types */}
          <div className="flex justify-center flex-wrap gap-4 mb-6">
            {["One Way", "Round Trip", "Multi City"].map((type) => (
              <button
                key={type}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  type === "Round Trip"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-6">
            {/* From */}
            <div>
              <label className="text-xs font-semibold mb-1 block">From</label>
              <div className="relative">
                <FaPlaneDeparture className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value="DAC - Dhaka"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="text-xs font-semibold mb-1 block">To</label>
              <div className="relative">
                <FaPlaneArrival className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value="CXB - Cox's Bazar"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Departure */}
            <div>
              <label className="text-xs font-semibold mb-1 block">Departure</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  defaultValue="2025-06-07"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Return */}
            <div>
              <label className="text-xs font-semibold mb-1 block">Return</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  defaultValue="2025-06-09"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label className="text-xs font-semibold mb-1 block">Traveller</label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <select className={`${inputClass} pl-10`}>
                  <option>1 Traveller</option>
                  <option>2 Travellers</option>
                  <option>3 Travellers</option>
                </select>
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="text-xs font-semibold mb-1 block">Class</label>
              <select className={inputClass}>
                <option>Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
          </div>

          {/* Fare Options + Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Radio Options */}
            <div className="flex gap-6 text-sm font-medium">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="fare"
                  defaultChecked
                  className="mr-2"
                />
                Regular Fare
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="fare" className="mr-2" />
                Student Fare
              </label>
            </div>

            {/* Search Button */}
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-all">
              🔍 Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelHeroBanner;
