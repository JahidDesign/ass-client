import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const calculateTimeLeft = (targetDate) => {
  const diff = +targetDate - +new Date();
  if (diff <= 0) return { days: "00", hours: "00", minutes: "00" };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    raw: { days, hours, minutes },
  };
};

const ExclusiveOffer = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 6);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); 
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleBuyNow = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in or sign up to access this exclusive offer.",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    } else {
      navigate("/add-air-packages");
    }
  };

  const getLabel = (count, singular, plural) => (count === 1 ? singular : plural);

  const isDark = theme === "dark";

  return (
    <section
      className={`py-10 px-4 md:px-8 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gradient-to-r from-[#D9FBE6] to-[#C2EFD4]"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-6 md:p-12 lg:p-16 relative ${
          isDark ? "bg-gray-800 shadow-xl" : "bg-white shadow-2xl"
        }`}
      >
        {/* Decorative Dots */}
        <div className="absolute bottom-6 left-6 grid grid-cols-4 gap-2 opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${isDark ? "bg-green-400" : "bg-green-600"}`}
            />
          ))}
        </div>

        {/* Image */}
        <div className="order-2 md:order-1">
          <img
            src="https://i.ibb.co/VcpLwRFR/sale-with-special-discount-traveling.jpg"
            alt="Exclusive Offer"
            className="w-full h-64 md:h-72 lg:h-80 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div className="order-1 md:order-2 text-center md:text-left">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 font-['Roboto_Slab'] ${
              isDark ? "text-green-300" : "text-[#224f34]"
            }`}
          >
            Exclusive Offer Just for You
          </h2>
          <p
            className={`text-lg mb-6 leading-relaxed font-['Poppins'] ${
              isDark ? "text-gray-200" : "text-[#224f34]"
            }`}
          >
            Don’t miss out on this limited-time deal! Save up to{" "}
            <span className="font-bold">50%</span> on new arrivals. Offer expires soon.
          </p>

          {/* Countdown */}
          <div className="flex justify-center md:justify-start gap-4 mb-6">
            {[
              { label: getLabel(timeLeft.raw.days, "Day", "Days"), value: timeLeft.days },
              { label: getLabel(timeLeft.raw.hours, "Hour", "Hours"), value: timeLeft.hours },
              { label: getLabel(timeLeft.raw.minutes, "Minute", "Minutes"), value: timeLeft.minutes },
            ].map((item, i) => (
              <div
                key={i}
                className={`w-20 h-20 border rounded-xl shadow flex flex-col justify-center items-center ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-[#f0fdf4] border-[#a7f3d0]"
                }`}
              >
                <span className={`text-2xl font-bold ${isDark ? "text-green-200" : "text-[#064e3b]"}`}>
                  {item.value}
                </span>
                <span className={`text-sm font-medium ${isDark ? "text-green-100" : "text-[#064e3b]"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className={`inline-block px-6 py-3 rounded-xl text-base font-semibold shadow transition duration-300 ${
              isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-[#224f34] hover:bg-[#1a3e29] text-white"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffer;
