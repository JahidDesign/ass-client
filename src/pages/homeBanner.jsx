// src/pages/homeBanner.jsx
import React, { useContext } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaUser, FaCalendarAlt } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const TravelHeroBanner = () => {
  const { theme } = useContext(ThemeContext);

  const inputClass = `w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
    ${theme === "dark" ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`;

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Hero Background */}
      <section
        className="relative h-[65vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/KjPpS8pH/madison-olling-6wmx-DOa-AO4-unsplash.jpg')",
        }}
      >
        <div className="absolute inset-0  bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sylhet<span className="text-yellow-400">Tourist</span>Spot
          </h1>
          <p className="text-lg">Restaurants, Resorts & Hotels in Sylhet</p>
        </div>
      </section>

      {/* Search Card */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-8 -mt-28">
        <div className={`${theme === "dark" ? "bg-gray-800 shadow-xl" : "bg-white shadow-xl"} rounded-3xl p-6 sm:p-10`}>
          {/* Trip Types */}
          <div className="flex justify-center flex-wrap gap-4 mb-6">
            {["One Way", "Round Trip", "Multi City"].map((type) => (
              <button
                key={type}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  type === "Round Trip"
                    ? "bg-blue-600 text-white shadow"
                    : theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-black"
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
              <label htmlFor="from" className="text-xs font-semibold mb-1 block">From</label>
              <div className="relative">
                <FaPlaneDeparture className="absolute top-3 left-3 text-gray-400" />
                <input id="from" type="text" readOnly value="DAC - Dhaka" className={`pl-10 ${inputClass}`} />
              </div>
            </div>

            {/* To */}
            <div>
              <label htmlFor="to" className="text-xs font-semibold mb-1 block">To</label>
              <div className="relative">
                <FaPlaneArrival className="absolute top-3 left-3 text-gray-400" />
                <input id="to" type="text" readOnly value="CXB - Cox's Bazar" className={`pl-10 ${inputClass}`} />
              </div>
            </div>

            {/* Departure */}
            <div>
              <label htmlFor="departure" className="text-xs font-semibold mb-1 block">Departure</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input id="departure" type="date" defaultValue="2025-06-07" className={`pl-10 ${inputClass}`} />
              </div>
            </div>

            {/* Return */}
            <div>
              <label htmlFor="return" className="text-xs font-semibold mb-1 block">Return</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input id="return" type="date" defaultValue="2025-06-09" className={`pl-10 ${inputClass}`} />
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label htmlFor="travellers" className="text-xs font-semibold mb-1 block">Travellers</label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <select id="travellers" className={`pl-10 ${inputClass}`}>
                  <option>1 Traveller</option>
                  <option>2 Travellers</option>
                  <option>3 Travellers</option>
                </select>
              </div>
            </div>

            {/* Class */}
            <div>
              <label htmlFor="class" className="text-xs font-semibold mb-1 block">Class</label>
              <select id="class" className={inputClass}>
                <option>Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
          </div>

          {/* Fare Options + Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm font-medium">
              <label className="inline-flex items-center">
                <input type="radio" name="fare" defaultChecked className="mr-2" />
                Regular Fare
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="fare" className="mr-2" />
                Student Fare
              </label>
            </div>

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
