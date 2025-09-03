import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { ThemeContext } from "../context/ThemeContext";

const airlines = [
  { name: "Biman Bangladesh Airlines", logo: "https://i.ibb.co/23JHbHGg/biman.png", country: "Bangladesh", rating: 4.2 },
  { name: "US-Bangla Airlines", logo: "https://i.ibb.co/0jVWstXC/us.png", country: "Bangladesh", rating: 4.1 },
  { name: "NOVOAIR", logo: "https://i.ibb.co/84xphq9H/novoair.jpg", country: "Bangladesh", rating: 4.3 },
  { name: "Air Astra", logo: "https://i.ibb.co/1J8bkqfX/air-astra.jpg", country: "Bangladesh", rating: 4.0 },
  { name: "Emirates", logo: "https://i.ibb.co/0RXnvRs2/emitrates.png", country: "UAE", rating: 4.8 },
  { name: "Singapore Airlines", logo: "https://i.ibb.co/W4gHX3Rd/singapore.png", country: "Singapore", rating: 4.9 },
  { name: "Turkish Airlines", logo: "https://i.ibb.co/j9qm8N73/turkish-airlines.png", country: "Turkey", rating: 4.6 },
  { name: "Qatar Airways", logo: "https://i.ibb.co/5N6VC74/Qatar-Airways.png", country: "Qatar", rating: 4.7 },
  { name: "Malaysia Airlines", logo: "https://i.ibb.co/SX2MjqxM/Malaysia-Airlines.png", country: "Malaysia", rating: 4.4 },
  { name: "Vistara", logo: "https://i.ibb.co/DDyDzW1F/Vistara.jpg", country: "India", rating: 4.5 },
  { name: "Etihad Airways", logo: "https://i.ibb.co/ZRX2c9Wt/Etihad-Airways.png", country: "UAE", rating: 4.6 },
  { name: "Cathay Pacific Airways", logo: "https://i.ibb.co/VYWmGjSZ/Cathay-Pacific-Airways.png", country: "Hong Kong", rating: 4.5 },
  { name: "Himalaya Airlines", logo: "https://i.ibb.co/PvjKpC17/Himalaya-Airlines.png", country: "Nepal", rating: 4.2 },
  { name: "Thai Lion Air", logo: "https://i.ibb.co/XrRbBZ8k/Thai-Lion-Air.png", country: "Thailand", rating: 4.1 },
  { name: "Saudia Airlines", logo: "https://i.ibb.co/HL5yJXCZ/Saudia-Airlines.png", country: "Saudi Arabia", rating: 4.3 },
  { name: "Batik Air", logo: "https://i.ibb.co/39cLgsVk/Batik-Air.png", country: "Indonesia", rating: 4.2 },
  { name: "British Airways", logo: "https://i.ibb.co/gFMvhWyX/British-Airways.png", country: "UK", rating: 4.4 },
  { name: "Jetstar Pacific", logo: "https://i.ibb.co/gMmX3rkP/Jetstar-Pacific.png", country: "Vietnam", rating: 4.0 },
  { name: "Maldivian", logo: "https://i.ibb.co/PvBvbgtP/maldivian-logo-png-seeklogo-274008.png", country: "Maldives", rating: 4.3 },
];

const PopularAirlines = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className={`relative w-full py-20 overflow-hidden ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-indigo-100"
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? "bg-blue-600" : "bg-blue-200"
        } animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 ${
          isDark ? "bg-purple-600" : "bg-purple-200"
        } animate-pulse`}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <svg className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-500"} animate-bounce`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 opacity-30">
          <svg className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-500"} animate-pulse`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDark ? "bg-blue-600/20 border border-blue-500/30" : "bg-blue-100 border border-blue-200"
            }`}>
              <svg className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${
              isDark ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}>
              ✈️ Premium Airlines
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${
            isDark 
              ? "from-white via-blue-100 to-purple-200" 
              : "from-gray-900 via-blue-600 to-purple-600"
          } bg-clip-text text-transparent`}>
            Most Popular Airlines
          </h2>
          
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Discover premium airlines worldwide and instantly search and book any flight ticket with confidence and ease.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>19+</div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Airlines</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>50+</div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Countries</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>4.5★</div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Swiper */}
      <div className="relative w-full">
        <Swiper
          className="w-full px-4 pb-12"
          spaceBetween={24}
          slidesPerView={1.2}
          centeredSlides={false}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 20 },
            640: { slidesPerView: 2.5, spaceBetween: 24 },
            768: { slidesPerView: 3.5, spaceBetween: 28 },
            1024: { slidesPerView: 5, spaceBetween: 32 },
            1280: { slidesPerView: 6, spaceBetween: 36 },
            1536: { slidesPerView: 7, spaceBetween: 40 },
          }}
          loop
          autoplay={{ 
            delay: 3000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          navigation={{
            nextEl: '.airline-next',
            prevEl: '.airline-prev',
          }}
          pagination={{
            el: '.airline-pagination',
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Autoplay, Navigation, Pagination]}
          onSlideChange={() => {}}
          onSwiper={() => {}}
        >
          {airlines.map((airline, index) => (
            <SwiperSlide key={index}>
              <div className="group cursor-pointer h-full">
                <div
                  className={`relative p-6 h-56 flex flex-col items-center justify-center transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2 rounded-2xl border backdrop-blur-sm ${
                    isDark
                      ? "bg-gray-800/80 border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50"
                      : "bg-white/90 border-gray-200/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50"
                  }`}
                >
                  {/* Premium Badge for High Rated Airlines */}
                  {airline.rating >= 4.5 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDark ? "bg-yellow-500/20 border border-yellow-400/50" : "bg-yellow-100 border border-yellow-300"
                      }`}>
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Airline Logo Container */}
                  <div className="relative mb-4 p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300">
                    <img
                      src={airline.logo}
                      alt={airline.name}
                      className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Airline Information */}
                  <div className="text-center space-y-2 flex-1 flex flex-col justify-end">
                    <h3 className={`font-bold text-sm leading-tight transition-colors duration-300 ${
                      isDark ? "text-gray-100 group-hover:text-white" : "text-gray-800 group-hover:text-gray-900"
                    }`}>
                      {airline.name}
                    </h3>
                    
                    <p className={`text-xs opacity-75 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {airline.country}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(airline.rating)}
                      </div>
                      <span className={`text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {airline.rating}
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isDark 
                      ? "bg-gradient-to-t from-blue-600/20 via-transparent to-purple-600/10" 
                      : "bg-gradient-to-t from-blue-500/10 via-transparent to-purple-500/5"
                  }`}></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button className={`airline-prev w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isDark 
              ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-blue-500" 
              : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-xl"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="airline-pagination flex gap-2"></div>

          <button className={`airline-next w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isDark 
              ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-blue-500" 
              : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-xl"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative max-w-4xl mx-auto px-4 mt-16 text-center z-10">
        <div className={`p-8 rounded-2xl border backdrop-blur-sm ${
          isDark 
            ? "bg-gray-800/60 border-gray-700/50" 
            : "bg-white/80 border-gray-200/50"
        }`}>
          <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Ready to Fly?
          </h3>
          <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Compare prices across all airlines and find the perfect flight for your next adventure.
          </p>
          <button className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            isDark 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white" 
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white"
          }`}>
            🔍 Search Flights Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularAirlines;