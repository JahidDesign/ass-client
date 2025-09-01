// src/components/Testimonials.jsx
import React, { useContext } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import Slider from "react-slick";
import { ThemeContext } from "../context/ThemeContext"; // ✅ Import ThemeContext
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
  const { theme } = useContext(ThemeContext); // ✅ Use ThemeContext

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      className={`py-12 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2
          className={`text-2xl md:text-3xl font-bold mb-2 ${
            theme === "dark" ? "text-green-400" : "text-green-900"
          }`}
        >
          What Our Happy Clients Say About Fahim Holiday Homes & Tourism
        </h2>
        <p className="mb-10 text-gray-600 dark:text-gray-300">
          Real Reviews from Travelers Who Enjoyed Our Tour Packages, Hotel Rooms,
          and Personalized Travel Services in Sylhet
        </p>

        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="px-3">
              <div
                className={`rounded-lg p-6 h-full flex flex-col items-start shadow-lg transition duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-100"
                    : "bg-orange-500 text-white"
                }`}
              >
                <FaQuoteLeft className="text-3xl opacity-70 mb-4" />
                <p className="mb-6 italic">{t.text}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-white dark:border-gray-600"
                  />
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <div className="flex text-yellow-300">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="text-sm italic">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
