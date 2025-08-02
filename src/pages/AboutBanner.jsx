import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative h-[50vh] bg-cover bg-bottom flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/NgC4NcCq/big-home-gallery-2-1.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0  bg-opacity-50"></div>

        {/* Text Content */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-400">About</span> Us
          </h1>
          <p className="text-lg">
            Discover who we are, what we stand for, and how we make travel experiences unforgettable.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
