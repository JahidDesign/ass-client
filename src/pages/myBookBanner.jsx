import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; 

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <section
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://i.ibb.co/q35qv1vK/introslider-03.jpg')`,
        }}
      >
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-r from-black via-black/70 to-black/60"
              : "bg-gradient-to-r from-white/90 via-white/70 to-white/60"
          }`}
        ></div>

        {/* Content */}
        <div className="relative z-10 grid place-items-center h-full px-4 text-center">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Your{" "}
              <span
                className={`${
                  theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                }`}
              >
                Booking
              </span>{" "}
              Starts Here
            </h1>
            <p
              className={`text-lg md:text-xl ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Seamless reservations for tours, hotels, and flights — all in one
              place.
            </p>
            <button
              className={`mt-4 px-6 py-3 rounded-full font-semibold transition ${
                theme === "dark"
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-yellow-600 text-white hover:bg-yellow-500"
              }`}
            >
              Explore Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
