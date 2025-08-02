import React from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaUser, FaCalendarAlt } from "react-icons/fa";

const inputClass = "w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative h-[64vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/KjPpS8pH/madison-olling-6wmx-DOa-AO4-unsplash.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0  bg-opacity-60"></div>

        {/* Text Content */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where to <span className="text-yellow-400">Fly?</span>
          </h1>
          <p className="text-lg mb-6">
            Find Cheap Flights, Airline Tickets in Bangladesh
          </p>
        </div>
      </section>

      {/* Search Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-6xl mx-auto -mt-28 z-20 relative text-black">
        {/* Trip Type Buttons */}
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          {["One Way", "Round Trip", "Multi City"].map((type, index) => (
            <button
              key={index}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                type === "Round Trip"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form Fields */}
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

          {/* Traveller */}
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

        {/* Fare Type and Submit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Fare Options */}
          <div className="flex gap-6 text-sm font-medium">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="fare"
                value="regular"
                defaultChecked
                className="mr-2"
              />
              Regular Fare
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="fare" value="student" className="mr-2" />
              Student Fare
            </label>
          </div>

          {/* Submit Button */}
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-all">
            🔍 Search Flights
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const featuredPackages = [
    {
      id: 1,
      image: 'https://source.unsplash.com/400x250/?beach,tour',
      name: 'Dhaka to Cox’s Bazar Tour',
      guide: { name: 'Mr. Alam', photo: 'https://i.pravatar.cc/40?img=1' },
      duration: '3 Days, 2 Nights',
      departure: '2025-07-01',
      price: '$199',
    },
    // Add 5 more mock packages like above...
  ];

  return (
    <div className="text-black">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
        <p className="text-lg mb-6">Explore curated travel experiences across Bangladesh with expert guides.</p>
        <button
          onClick={() => navigate('/packages')}
          className="bg-white text-blue-600 font-medium px-6 py-2 rounded hover:bg-gray-200 transition"
        >
          Explore All Packages
        </button>
      </section>

      {/* Featured Packages */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow p-4">
              <img src={pkg.image} alt={pkg.name} className="rounded mb-4 w-full h-48 object-cover" />
              <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <img src={pkg.guide.photo} alt={pkg.guide.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-700">{pkg.guide.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Duration: {pkg.duration}</p>
              <p className="text-sm text-gray-600 mb-1">Departure: {pkg.departure}</p>
              <p className="text-sm text-gray-900 font-medium mb-3">Price: {pkg.price}</p>
              <button
                onClick={() => navigate(`/packages/${pkg.id}`)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/packages')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Show All
          </button>
        </div>
      </section>

      {/* Extra Section 1: Why Choose Us */}
      <section className="bg-gray-100 py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          We offer hand-picked tours with certified local guides, transparent pricing, and 24/7 customer support.
        </p>
      </section>

      {/* Extra Section 2: Testimonials */}
      <section className="bg-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">What Our Travelers Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700 mb-2">
              "The trip to Cox’s Bazar was amazing! Everything was well-organized and the guide was super friendly."
            </p>
            <span className="text-gray-900 font-semibold">— Sarah K.</span>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700 mb-2">
              "Highly recommend this platform. It’s easy to book and the experiences are unforgettable."
            </p>
            <span className="text-gray-900 font-semibold">— Tanvir R.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
