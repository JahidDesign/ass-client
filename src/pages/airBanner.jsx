import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // adjust path
import { motion } from "framer-motion";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);

  const overlayClass =
    theme === "dark"
      ? "bg-gradient-to-r from-black/80 via-black/60 to-black/80"
      : "bg-gradient-to-r from-black/60 via-black/40 to-black/60";
  const textColor = theme === "dark" ? "text-gray-100" : "text-white";

  return (
    <div className={theme === "dark" ? "bg-gray-900" : "bg-white"}>
      {/* Hero Banner */}
      <section
        className="relative h-[80vh] md:h-[70vh] lg:h-[75vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/845043g1/shahreen-rizvi-Kpc-L4k-YUd-U-unsplash.jpg')",
        }}
      >
        {/* Animated Overlay */}
        <motion.div
          className={`absolute inset-0 ${overlayClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* Text Content */}
        <motion.div
          className={`relative z-10 text-center px-4 max-w-3xl ${textColor}`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            <span className="text-yellow-400">Airplane</span> Ticket Booking
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Book your flights effortlessly — find the best fares for domestic and international travel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/book-flight"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
            >
              Book Now
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/learn-more"
              className="border border-white hover:bg-white hover:text-black text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        {/* Animated Airplane Icon (Optional Decorative) */}
        <motion.div
          className="absolute -bottom-10 right-10 w-24 h-24 text-yellow-400 opacity-80"
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          ✈️
        </motion.div>
      </section>
    </div>
  );
};

export default HeroSection;
