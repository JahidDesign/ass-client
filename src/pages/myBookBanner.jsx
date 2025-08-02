import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      <section
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://i.ibb.co/q35qv1vK/introslider-03.jpg')`,
        }}
      >
        {/* Gradient or solid dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/60"></div>

        {/* Grid Content */}
        <div className="relative z-10 grid place-items-center h-full px-4 text-center text-white">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Your <span className="text-yellow-400">Booking</span> Starts Here
            </h1>
            <p className="text-lg md:text-xl text-white">
              Seamless reservations for tours, hotels, and flights — all in one place.
            </p>
            <button className="mt-4 px-6 py-3 bg-yellow-500 text-black rounded-full font-semibold hover:bg-yellow-400 transition">
              Explore Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
