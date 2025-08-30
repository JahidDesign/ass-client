// src/components/Carousel.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const slides = [
  { id: 1, image: "https://i.ibb.co/XrMJw11d/pexels-rezwan-nobi-741721-1633318.jpg", title: "Nature 1", description: "Nature first" },
  { id: 2, image: "https://i.ibb.co/Kj4syCNr/pexels-ferdous-5151051.jpg", title: "Nature 2", description: "Nature second" },
  { id: 3, image: "https://i.ibb.co/LhcFrbgj/pexels-abd-nimit-998903.jpg", title: "Nature 3", description: "Nature third" },
  { id: 4, image: "https://i.ibb.co/mFvcjz63/pexels-arifulhb-3675856.jpg", title: "Nature 4", description: "Nature last" },
];

const Carousel = () => {
  const { theme } = useContext(ThemeContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(1);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev < slides.length - visibleSlides ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleSlides]);

  // Update number of visible slides based on screen width
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

  const next = () => setCurrentSlide((prev) => (prev < slides.length - visibleSlides ? prev + 1 : 0));
  const prev = () => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - visibleSlides));

  return (
    <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} py-10 px-4`}>
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${(100 / visibleSlides) * currentSlide}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`flex-shrink-0 p-4 w-full ${visibleSlides === 3 ? "md:w-1/3" : visibleSlides === 2 ? "md:w-1/2" : "w-full"}`}
            >
              <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">{slide.title}</h3>
                    <p className="text-sm text-white">{slide.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full shadow z-10 transition"
        >
          ◀
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-full shadow z-10 transition"
        >
          ▶
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full ${currentSlide === idx ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-500"} transition`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
