import React, { useState, useEffect, useContext } from "react";
import { Plane, MapPin, Clock, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const domesticImages = [
  { src: "https://images.unsplash.com/photo-1530035415911-95194de4ebcc?q=80&w=2670&auto=format&fit=crop", link: "/domestic/1", destination: "Cox's Bazar", duration: "1h 30m", rating: 4.8 },
  { src: "https://i.ibb.co/XxfPrCSb/image.jpg", link: "/domestic/2", destination: "Sylhet", duration: "1h 15m", rating: 4.7 },
  { src: "https://i.ibb.co/RkRg4ZpG/sylhet-sidebar.jpg", link: "/domestic/3", destination: "Chittagong", duration: "1h 00m", rating: 4.9 },
  { src: "https://i.ibb.co/hRtc4xbV/60ebcfe6aaa33027254823.jpg", link: "/domestic/4", destination: "Rangamati", duration: "1h 45m", rating: 4.6 },
  { src: "https://i.ibb.co/fVL7xFys/image-836-1609310296.jpg", link: "/domestic/5", destination: "Bandarban", duration: "2h 00m", rating: 4.8 },
];

const internationalImages = [
  { src: "https://i.ibb.co/rRLVr92L/9634e216.jpg", link: "/international/1", destination: "Dubai", duration: "4h 30m", rating: 4.9 },
  { src: "https://i.ibb.co/MyKFJ6ht/unnamed.webp", link: "/international/2", destination: "Bangkok", duration: "2h 15m", rating: 4.8 },
  { src: "https://i.ibb.co/DHrV1wYW/rooftop-view.jpg", link: "/international/3", destination: "Singapore", duration: "3h 45m", rating: 4.9 },
  { src: "https://i.ibb.co/5hSpm6NG/2540b6da-9df7-4090-bced-0a6b915897eb.jpg", link: "/international/4", destination: "Kuala Lumpur", duration: "3h 00m", rating: 4.7 },
  { src: "https://i.ibb.co/fzqGTrpG/364031722.jpg", link: "/international/5", destination: "Delhi", duration: "2h 30m", rating: 4.6 },
];

const ModernAirlineGallery = () => {
  const { theme } = useContext(ThemeContext);
  const [section, setSection] = useState("domestic");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentImages = section === "domestic" ? domesticImages : internationalImages;

  const bgClass = theme === "dark" ? "bg-black" : "bg-white";
  const textClass = theme === "dark" ? "text-white" : "text-black";
  const subtextClass = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-white/10" : "bg-black/10";
  const borderClass = theme === "dark" ? "border-white/20" : "border-black/20";
  const shadowClass = theme === "dark" ? "hover:shadow-gray-500/20" : "hover:shadow-gray-400/20";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen ${bgClass} relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-20 left-10 w-72 h-72 ${theme === 'dark' ? 'bg-white' : 'bg-black'} rounded-full mix-blend-multiply filter blur-xl animate-pulse`}></div>
        <div className={`absolute top-40 right-10 w-96 h-96 ${theme === 'dark' ? 'bg-gray-300' : 'bg-gray-700'} rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000`}></div>
        <div className={`absolute bottom-20 left-1/2 w-80 h-80 ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-900'} rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000`}></div>
      </div>

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center items-center gap-3 mb-4">
              <Plane className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} animate-bounce`} />
              <h1 className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white via-gray-300 to-gray-500' : 'from-black via-gray-700 to-gray-500'} bg-clip-text text-transparent`}>
                Sky Explorer
              </h1>
              <Plane className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} animate-bounce animation-delay-1000`} style={{transform: 'scaleX(-1)'}} />
            </div>
            <p className={`text-xl ${subtextClass} font-light`}>
              Discover breathtaking destinations with premium airline experiences
            </p>
          </div>

          {/* Section Toggle */}
          <div className={`flex justify-center gap-2 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`${cardBg} backdrop-blur-lg rounded-full p-1 border ${borderClass}`}>
              {["domestic", "international"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSection(type)}
                  className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-500 relative overflow-hidden group
                    ${section === type
                      ? theme === 'dark' 
                        ? "bg-gradient-to-r from-white to-gray-300 text-black shadow-2xl shadow-white/25"
                        : "bg-gradient-to-r from-black to-gray-700 text-white shadow-2xl shadow-black/25"
                      : `${subtextClass} hover:${textClass}`}`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {type.charAt(0).toUpperCase() + type.slice(1)} Flights
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className={`grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {currentImages.map((image, idx) => (
              <div
                key={`${section}-${idx}`}
                className="group cursor-pointer transform transition-all duration-700 hover:scale-105"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative ${cardBg} backdrop-blur-lg rounded-3xl overflow-hidden border ${borderClass} shadow-2xl ${shadowClass} transition-all duration-500`}>
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className={`absolute top-4 right-4 ${theme === 'dark' ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1`}>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-800' : 'text-white'}`}>{image.rating}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${textClass} group-hover:text-cyan-400 transition-colors duration-300`}>
                        {image.destination}
                      </h3>
                      <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{image.duration}</span>
                      </div>
                    </div>
                    <p className={`${subtextClass} text-sm`}>
                      {section === "domestic" ? "Explore Bangladesh" : "International Journey"}
                    </p>

                    {/* Booking Button with NavLink */}
                    <NavLink
                      to="/add-air-packages"
                      state={{ destination: image.destination, duration: image.duration, rating: image.rating, section }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                    >
                      <Plane className="w-4 h-4" />
                      Book Now
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAirlineGallery;
