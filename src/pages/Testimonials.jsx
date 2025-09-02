// src/components/Testimonials.jsx
import React, { useContext } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import Slider from "react-slick";
import { motion } from "framer-motion"; 
import { ThemeContext } from "../context/ThemeContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "ASAD KHAN",
    role: "Solo Traveler",
    text: "Fahim Holiday Homes & Tourism made our Sylhet trip effortless. Clean, cozy rooms and a great tour package. Friendly staff and smooth service made it a memorable stay!",
    image: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "SAHED ALI",
    role: "Solo Traveler",
    text: "Fahim Holiday Homes & Tourism impressed us from start to finish. Warm welcome, smooth tours, and great service. A top choice for anyone visiting Sylhet!",
    image: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "JAMAL MIA",
    role: "Solo Traveler",
    text: "Fahim Holiday Homes & Tourism impressed us from start to finish. Warm welcome, smooth tours, and great service. A top choice for anyone visiting Sylhet!",
    image: "https://i.pravatar.cc/100?img=3",
  },
];

const Testimonials = () => {
  const { theme } = useContext(ThemeContext);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
    customPaging: () => (
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
        theme === "dark" 
          ? "bg-gray-600 hover:bg-green-400" 
          : "bg-gray-300 hover:bg-green-500"
      }`} />
    ),
  };

  return (
    <section
      className={`relative py-20 overflow-hidden ${
        theme === "dark" 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGQ9Im0zNiAxNGE1IDUgMCAwIDEgNSA1djJhNSA1IDAgMCAxIC01IDVoLTJhNSA1IDAgMCAxIC01LTV2LTJhNSA1IDAgMCAxIDUtNWgyem0tMTYgMGE1IDUgMCAwIDEgNSA1djJhNSA1IDAgMCAxIC01IDVoLTJhNSA1IDAgMCAxIC01LTV2LTJhNSA1IDAgMCAxIDUtNWgyem0wLTE2YTUgNSAwIDAgMSA1IDV2MmE1IDUgMCAwIDEgLTUgNWgtMmE1IDUgMCAwIDEgLTUtNXYtMmE1IDUgMCAwIDEgNS01aDJ6bTE2IDBhNSA1IDAgMCAxIDUgNXYyYTUgNSAwIDAgMSAtNSA1aC0yYTUgNSAwIDAgMSAtNS01di0yYTUgNSAwIDAgMSA1LTVoMnptMTYgMTZhNSA1IDAgMCAxIDUgNXYyYTUgNSAwIDAgMSAtNSA1aC0yYTUgNSAwIDAgMSAtNS01di0yYTUgNSAwIDAgMSA1LTVoMnptLTE2IDMwYTUgNSAwIDAgMSA1IDV2MmE1IDUgMCAwIDEgLTUgNWgtMmE1IDUgMCAwIDEgLTUtNXYtMmE1IDUgMCAwIDEgNS01aDJ6bTE2LTE2YTUgNSAwIDAgMSA1IDV2MmE1IDUgMCAwIDEgLTUgNWgtMmE1IDUgMCAwIDEgLTUtNXYtMmE1IDUgMCAwIDEgNS01aDJ6bTAtMTZhNSA1IDAgMCAxIDUgNXYyYTUgNSAwIDAgMSAtNSA1aC0yYTUgNSAwIDAgMSAtNS01di0yYTUgNSAwIDAgMSA1LTVoMnptLTMwIDBhNSA1IDAgMCAxIDUgNXYyYTUgNSAwIDAgMSAtNSA1aC0yYTUgNSAwIDAgMSAtNS01di0yYTUgNSAwIDAgMSA1LTVoMnoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8L2c+Cjwvc3ZnPg==')] bg-repeat" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            theme === "dark" 
              ? "bg-green-400/10 text-green-400 border border-green-400/20" 
              : "bg-green-500/10 text-green-600 border border-green-500/20"
          }`}>
            ✨ Testimonials
          </div>
          
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            What Our{" "}
            <span className={`bg-gradient-to-r ${
              theme === "dark" 
                ? "from-green-400 to-emerald-400" 
                : "from-green-600 to-emerald-600"
            } bg-clip-text text-transparent`}>
              Happy Clients
            </span>{" "}
            Say
          </h2>

          <motion.p
            className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Real stories from travelers who experienced the magic of Sylhet with our personalized services, comfortable accommodations, and unforgettable tour packages.
          </motion.p>
        </motion.div>

        <div className="relative">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4">
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  className={`group relative rounded-3xl p-8 h-full transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                    theme === "dark"
                      ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-green-400/30 hover:shadow-2xl hover:shadow-green-400/10"
                      : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-green-500/30 shadow-lg hover:shadow-2xl hover:shadow-green-500/10"
                  }`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-green-400/5 to-emerald-400/5"
                      : "bg-gradient-to-br from-green-500/5 to-emerald-500/5"
                  }`} />
                  
                  <div className="relative z-10">
                    {/* Quote icon with modern styling */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-green-400/20 to-emerald-400/20 text-green-400"
                        : "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600"
                    }`}>
                      <FaQuoteLeft className="text-2xl" />
                    </div>

                    {/* Review text */}
                    <p className={`text-base md:text-lg leading-relaxed mb-8 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-700"
                    }`}>
                      "{testimonial.text}"
                    </p>

                    {/* Rating stars */}
                    <div className="flex justify-center mb-6 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.5 + (i * 0.1) 
                          }}
                          viewport={{ once: true }}
                        >
                          <FaStar className="text-yellow-400 text-lg drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </div>

                    {/* User info */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-gray-600 shadow-lg mr-4 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          theme === "dark"
                            ? "bg-green-400 text-gray-900"
                            : "bg-green-500 text-white"
                        }`}>
                          ✓
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className={`font-bold text-lg mb-1 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          {testimonial.name}
                        </h4>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className={`text-base md:text-lg mb-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Ready to create your own amazing experience?
          </p>
          <button className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
            theme === "dark"
              ? "bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 hover:shadow-lg hover:shadow-green-400/25 focus:ring-green-400/30"
              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25 focus:ring-green-500/30"
          }`}>
            Book Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;