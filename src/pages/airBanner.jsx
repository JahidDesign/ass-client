import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/845043g1/shahreen-rizvi-Kpc-L4k-YUd-U-unsplash.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0  bg-opacity-60" />

        {/* Text Content */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-400">Airplane</span> Ticket Booking
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Book your flights with ease — Discover the best fares for domestic and international travel.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
