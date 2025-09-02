// src/components/Carousel.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const slides = [
  {
    id: 1,
    image: "https://i.ibb.co.com/nqhzDwDX/tower-building-the-palace.jpg",
    title: "The Palace Luxury Resort",
    oldPrice: "22,400",
    newPrice: "19,800",
  },
  {
    id: 2,
    image: "https://i.ibb.co.com/s9hvJLYH/sylhet-tours.jpg",
    title: "Nazimgarh Garden Resort",
    oldPrice: "12,500",
    newPrice: "10,200",
  },
  {
    id: 3,
    image: "https://i.ibb.co.com/CZSRwns/lalkhali.jpg",
    title: "Lalakhal – Sylhet",
    oldPrice: "14,000",
    newPrice: "8,200",
  },
  {
    id: 4,
    image: "https://i.ibb.co.com/LD095p9F/1160234-16011818210039217016.webp",
    title: "DuSai Resort & Spa",
    oldPrice: "16,000",
    newPrice: "13,500",
  },
];

const Carousel = () => {
  const { theme } = useContext(ThemeContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);

  // Auto-slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev < slides.length - visibleSlides ? prev + 1 : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleSlides]);

  // Adjust visible slides on resize
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 768) setVisibleSlides(1);
      else if (window.innerWidth < 1024) setVisibleSlides(2);
      else setVisibleSlides(3);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const next = () =>
    setCurrentSlide((prev) =>
      prev < slides.length - visibleSlides ? prev + 1 : 0
    );
  const prev = () =>
    setCurrentSlide((prev) =>
      prev > 0 ? prev - 1 : slides.length - visibleSlides
    );

  return (
    <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} py-12`}>
      <div className="max-w-7xl mx-auto relative overflow-hidden">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2
            className={`text-2xl md:text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-green-900"
            }`}
          >
            Discover Our Best Tour Packages in Sylhet
          </h2>
          <p
            className={`mt-2 text-sm md:text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Handpicked Travel Experiences, Custom Itineraries & Affordable Prices
            for Your Perfect Sylhet Getaway.
          </p>
        </div>

        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${
              (100 / visibleSlides) * currentSlide
            }%)`,
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`flex-shrink-0 px-4 ${
                visibleSlides === 3
                  ? "md:w-1/3"
                  : visibleSlides === 2
                  ? "md:w-1/2"
                  : "w-full"
              }`}
            >
              <div
                className={`border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                } shadow-md hover:shadow-xl transition duration-300`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3
                    className={`font-semibold text-lg ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {slide.title}
                  </h3>
                  <div className="mt-2">
                    <p
                      className={`text-sm line-through ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      ৳ {slide.oldPrice}
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      ৳ {slide.newPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav Buttons (hidden on small devices) */}
        <button
          onClick={prev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full shadow z-10 transition"
        >
          ◀
        </button>
        <button
          onClick={next}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full shadow z-10 transition"
        >
          ▶
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === idx
                  ? "bg-green-600"
                  : "bg-gray-400 dark:bg-gray-500"
              } transition`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
