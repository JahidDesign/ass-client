import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ThemeContext } from "../context/ThemeContext";

const airlines = [
  { name: "Biman Bangladesh Airlines", logo: "https://i.ibb.co/23JHbHGg/biman.png" },
  { name: "US-Bangla Airlines", logo: "https://i.ibb.co/0jVWstXC/us.png" },
  { name: "NOVOAIR", logo: "https://i.ibb.co/84xphq9H/novoair.jpg" },
  { name: "Air Astra", logo: "https://i.ibb.co/1J8bkqfX/air-astra.jpg" },
  { name: "Emirates", logo: "https://i.ibb.co/0RXnvRs2/emitrates.png" },
  { name: "Singapore Airlines", logo: "https://i.ibb.co/W4gHX3Rd/singapore.png" },
  { name: "Turkish Airlines", logo: "https://i.ibb.co/j9qm8N73/turkish-airlines.png" },
  { name: "Qatar Airways", logo: "https://i.ibb.co/5N6VC74/Qatar-Airways.png" },
  { name: "Malaysia Airlines", logo: "https://i.ibb.co/SX2MjqxM/Malaysia-Airlines.png" },
  { name: "Vistara", logo: "https://i.ibb.co/DDyDzW1F/Vistara.jpg" },
  { name: "Etihad Airways", logo: "https://i.ibb.co/ZRX2c9Wt/Etihad-Airways.png" },
  { name: "Cathay Pacific Airways", logo: "https://i.ibb.co/VYWmGjSZ/Cathay-Pacific-Airways.png" },
  { name: "Himalaya Airlines", logo: "https://i.ibb.co/PvjKpC17/Himalaya-Airlines.png" },
  { name: "Thai Lion Air", logo: "https://i.ibb.co/XrRbBZ8k/Thai-Lion-Air.png" },
  { name: "Saudia Airlines", logo: "https://i.ibb.co/HL5yJXCZ/Saudia-Airlines.png" },
  { name: "Batik Air", logo: "https://i.ibb.co/39cLgsVk/Batik-Air.png" },
  { name: "British Airways", logo: "https://i.ibb.co/gFMvhWyX/British-Airways.png" },
  { name: "Jetstar Pacific", logo: "https://i.ibb.co/gMmX3rkP/Jetstar-Pacific.png" },
  { name: "Maldivian", logo: "https://i.ibb.co/PvBvbgtP/maldivian-logo-png-seeklogo-274008.png" },
];

const PopularAirlines = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <section className={`w-full py-12 ${isDark ? "bg-gray-900" : "bg-[#F5F5F5]"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-2xl md:text-3xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-black"}`}>
          Most Popular Airlines
        </h2>
        <p className={`text-center mb-10 text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Discover top airlines on ShareTrip and instantly search and book any flight ticket with ease.
        </p>
      </div>

      <div className="w-full">
        <Swiper
          className="w-full px-4"
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 7 },
          }}
          loop
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          navigation
          modules={[Autoplay, Navigation]}
        >
          {airlines.map((airline, index) => (
            <SwiperSlide key={index}>
              <div
                className={`p-5 flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-105 rounded-xl ${
                  isDark
                    ? "bg-gray-800 shadow-md hover:shadow-xl"
                    : "bg-white shadow hover:shadow-lg"
                } h-44 justify-center`}
              >
                <img
                  src={airline.logo}
                  alt={airline.name}
                  className="h-16 object-contain mb-3"
                />
                <p className={`text-sm text-center font-medium ${isDark ? "text-gray-200" : "text-black"}`}>
                  {airline.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularAirlines;
