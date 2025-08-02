import React from "react";
import { FaGlobe, FaPlane, FaUmbrellaBeach, FaUsers } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="bg-[#f5f5f5] py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-black mb-4">
          About Our Travel Agency
        </h2>
        <p className="text-gray-800 text-lg max-w-3xl mx-auto">
          We are a passionate team of travel enthusiasts dedicated to helping
          you discover the world. Whether you're dreaming of sandy beaches,
          vibrant cities, or tranquil mountains, we make your dream vacation
          a reality.
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto text-center">
        <div className="p-6 rounded-lg shadow-md bg-white">
          <FaGlobe className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-black">Global Reach</h3>
          <p className="text-gray-700">
            Explore over 100+ destinations worldwide with hand-picked packages.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-white">
          <FaPlane className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-black">Seamless Travel</h3>
          <p className="text-gray-700">
            We handle everything from flights to stays to ensure stress-free adventures.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-white">
          <FaUmbrellaBeach className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-black">Unique Experiences</h3>
          <p className="text-gray-700">
            Our custom packages offer unforgettable moments curated just for you.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-white">
          <FaUsers className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-black">Customer First</h3>
          <p className="text-gray-700">
            Our 24/7 support and friendly team make your satisfaction our top priority.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
