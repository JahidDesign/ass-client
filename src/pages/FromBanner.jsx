import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/YGzLzxY/What-are-some-hidden-gems-off-the-beaten-path-in-Sylhet.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0  bg-opacity-60"></div>

        {/* Text Content */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our <span className="text-yellow-400">Tour Packages</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Discover handpicked travel packages for your perfect getaway — from serene nature escapes to vibrant city adventures.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
