import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const domesticImages = [
  { src: "https://images.unsplash.com/photo-1530035415911-95194de4ebcc?q=80&w=2670&auto=format&fit=crop", link: "/domestic/1" },
  { src: "https://i.ibb.co/XxfPrCSb/image.jpg", link: "/domestic/2" },
  { src: "https://i.ibb.co/RkRg4ZpG/sylhet-sidebar.jpg", link: "/domestic/3" },
  { src: "https://i.ibb.co/hRtc4xbV/60ebcfe6aaa33027254823.jpg", link: "/domestic/4" },
  { src: "https://i.ibb.co/fVL7xFys/image-836-1609310296.jpg", link: "/domestic/5" },
];

const internationalImages = [
  { src: "https://i.ibb.co/rRLVr92L/9634e216.jpg", link: "/international/1" },
  { src: "https://i.ibb.co/MyKFJ6ht/unnamed.webp", link: "/international/2" },
  { src: "https://i.ibb.co/DHrV1wYW/rooftop-view.jpg", link: "/international/3" },
  { src: "https://i.ibb.co/5hSpm6NG/2540b6da-9df7-4090-bced-0a6b915897eb.jpg", link: "/international/4" },
  { src: "https://i.ibb.co/fzqGTrpG/364031722.jpg", link: "/international/5" },
];

const AnimatedAirlineGallery = () => {
  const [section, setSection] = useState("domestic");
  const { theme } = useContext(ThemeContext);
  const currentImages = section === "domestic" ? domesticImages : internationalImages;

  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-zinc-50";
  const textClass = theme === "dark" ? "text-white" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardText = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <section className={`${bgClass} min-h-screen py-16 px-4 flex items-center justify-center`}>
      <div className="max-w-7xl w-full space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 font-serif ${textClass}`}>
            {section === "domestic" ? "Domestic Flights" : "International Flights"}
          </h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Explore top destinations and exclusive airline offers
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4">
          {["domestic", "international"].map((type) => (
            <button
              key={type}
              onClick={() => setSection(type)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow
                ${section === type
                  ? "bg-orange-500 text-white shadow-lg ring-2 ring-orange-300"
                  : "bg-gray-200 text-gray-800 hover:bg-orange-400 hover:text-white"}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {currentImages.map(({ src, link }, idx) => (
            <a
              href={link}
              key={idx}
              className={`group ${cardBg} rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition duration-300 hover:-translate-y-2`}
            >
              <div className="relative w-full h-40">
                <img
                  src={src}
                  alt={`Flight ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <p className={`text-sm font-medium ${cardText}`}>
                  {section === "domestic" ? `Domestic Trip ${idx + 1}` : `International Trip ${idx + 1}`}
                </p>
                <span className="text-xs text-gray-400">Click to explore</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedAirlineGallery;
