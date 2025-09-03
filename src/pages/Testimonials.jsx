import React, { useState, useEffect, useContext } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

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
    role: "Family Traveler",
    text: "Outstanding service and beautiful accommodations. Our family had an amazing time exploring Sylhet with their expert guidance. Highly recommended!",
    image: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "MARIA ISLAM",
    role: "Adventure Seeker",
    text: "Perfect blend of comfort and adventure. The team knows Sylhet inside out and created an unforgettable experience for our group.",
    image: "https://i.pravatar.cc/100?img=4",
  },
];

const TestimonialCard = ({ testimonial, theme }) => (
  <div
    className={`group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 transition-all duration-500 ${
      theme === "dark"
        ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 hover:border-green-400/40 hover:shadow-xl hover:shadow-green-400/10"
        : "bg-white shadow-md border border-gray-200 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10"
    } hover:scale-105 hover:-translate-y-2`}
  >
    <div
      className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-green-400/10 text-green-400 group-hover:bg-green-400/20"
          : "bg-green-500/10 text-green-600 group-hover:bg-green-500/20"
      }`}
    >
      <Quote className="text-base sm:text-lg" />
    </div>

    <p className={`text-sm sm:text-base mb-4 sm:mb-5 ${theme === "dark" ? "text-gray-100" : "text-gray-700"}`}>
      "{testimonial.text}"
    </p>

    <div className="flex mb-3 space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="text-yellow-400 text-sm sm:text-base fill-current" />
      ))}
    </div>

    <div className="flex items-center">
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
      />
      <div className="ml-3 text-left flex-1 min-w-0">
        <h4 className={`font-bold text-sm sm:text-base truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {testimonial.name}
        </h4>
        <p className={`text-xs sm:text-sm truncate ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {testimonial.role}
        </p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const { theme } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`relative py-8 md:py-16 overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 text-center">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-black mb-8 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          What Our{" "}
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Happy Clients
          </span>{" "}
          Say
        </h2>

        {/* Desktop & Tablet Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} theme={theme} />
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="w-full flex-shrink-0 px-2">
                <TestimonialCard testimonial={t} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
