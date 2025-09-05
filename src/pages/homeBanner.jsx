// src/pages/homeBanner.jsx
import React, { useContext } from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const TravelHeroBanner = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const inputClass = `w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
    ${isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`;

  return (
    <div className={isDark ? "bg-gray-900 text-white" : "bg-white text-black"}>
      {/* Hero Background */}
      <section
        className="relative h-[65vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/Y4tmq5k4/IMG-20190728-123806.jpg')",
        }}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-black/60" : "bg-white/40"
          }`}
        ></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sylhet<span className="text-yellow-400">Tourist</span>Spot
          </h1>
          <p className="text-lg">Restaurants, Resorts & Hotels in Sylhet</p>
        </div>
      </section>

      {/* Search Card */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-8 -mt-28">
        <div
          className={`relative w-full overflow-hidden rounded-3xl shadow-xl p-6 sm:p-10 ${
            isDark
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
              : "bg-gradient-to-br from-blue-50 via-white to-indigo-100"
          }`}
        >
          {/* Trip Types */}
          <div className="flex justify-center flex-wrap gap-4 mb-6">
            {["One Way", "Round Trip", "Multi City"].map((type) => (
              <button
                key={type}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  type === "Round Trip"
                    ? "bg-blue-600 text-white shadow"
                    : isDark
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
              <label
                htmlFor="from"
                className="text-xs font-semibold mb-1 block"
              >
                From
              </label>
              <div className="relative">
                <FaPlaneDeparture className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="from"
                  type="text"
                  readOnly
                  value="DAC - Dhaka"
                  className={`pl-10 ${inputClass}`}
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label htmlFor="to" className="text-xs font-semibold mb-1 block">
                To
              </label>
              <div className="relative">
                <FaPlaneArrival className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="to"
                  type="text"
                  readOnly
                  value="CXB - Cox's Bazar"
                  className={`pl-10 ${inputClass}`}
                />
              </div>
            </div>

            {/* Departure */}
            <div>
              <label
                htmlFor="departure"
                className="text-xs font-semibold mb-1 block"
              >
                Departure
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="departure"
                  type="date"
                  defaultValue="2025-06-07"
                  className={`pl-10 ${inputClass}`}
                />
              </div>
            </div>

            {/* Return */}
            <div>
              <label
                htmlFor="return"
                className="text-xs font-semibold mb-1 block"
              >
                Return
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="return"
                  type="date"
                  defaultValue="2025-06-09"
                  className={`pl-10 ${inputClass}`}
                />
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label
                htmlFor="travellers"
                className="text-xs font-semibold mb-1 block"
              >
                Travellers
              </label>
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
              <label
                htmlFor="class"
                className="text-xs font-semibold mb-1 block"
              >
                Class
              </label>
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

          {/* Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
                isDark ? "bg-blue-600" : "bg-blue-200"
              } animate-pulse`}
            ></div>
            <div
              className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 ${
                isDark ? "bg-purple-600" : "bg-purple-200"
              } animate-pulse`}
            ></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 opacity-30">
              <svg
                className={`w-6 h-6 ${
                  isDark ? "text-blue-400" : "text-blue-500"
                } animate-bounce`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div className="absolute top-40 right-20 opacity-30">
              <svg
                className={`w-8 h-8 ${
                  isDark ? "text-purple-400" : "text-purple-500"
                } animate-pulse`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelHeroBanner;
