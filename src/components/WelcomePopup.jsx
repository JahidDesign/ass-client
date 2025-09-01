// src/components/WelcomePopup.jsx
import React, { useEffect, useState, useContext } from "react";
import { FaPlaneDeparture, FaHotel, FaMapMarkedAlt } from "react-icons/fa";
import Confetti from "react-confetti";
import { ThemeContext } from "../context/ThemeContext";


const WelcomePopup = () => {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (!lastVisit || now - parseInt(lastVisit, 10) >= oneHour) {
      setShow(true);
      setConfetti(true);
      localStorage.setItem("lastVisit", now.toString());
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden">
      {confetti && <Confetti numberOfPieces={200} recycle={false} />}

      <div
        className={`relative max-w-4xl w-full md:h-[500px] flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden
        ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        animate__animated animate__zoomIn`}
      >
        {/* Left - Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto relative overflow-hidden">
          <img src="https://i.ibb.co.com/ns8ntgcn/journey-concept-travel-vector.jpg" alt="Sylhet" className="w-full h-full object-cover" />

          {/* Floating plane animation */}
          <FaPlaneDeparture
            className="absolute top-4 left-[-100px] text-4xl animate-flyPlane"
            style={{ color: theme === "dark" ? "#60A5FA" : "#2563EB" }}
          />
          <style jsx>{`
            @keyframes flyPlane {
              0% { transform: translateX(-100px); }
              100% { transform: translateX(120%); }
            }
            .animate-flyPlane {
              animation: flyPlane 10s linear infinite;
            }
          `}</style>
        </div>

        {/* Right - Content */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to Jahid Holiday Homes & Tourism!
          </h2>
          <p className="text-sm md:text-base mb-4">
            Explore the beauty of <span className="font-semibold">Sylhet</span> with curated tour packages,
            comfortable hotels, and personalized travel services.
          </p>

          {/* Icons */}
          <div className="flex justify-start gap-6 mb-6">
            <div className="flex flex-col items-center">
              <FaPlaneDeparture className={`text-2xl ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <span className="text-sm mt-1">Tours</span>
            </div>
            <div className="flex flex-col items-center">
              <FaHotel className={`text-2xl ${theme === "dark" ? "text-red-400" : "text-red-500"}`} />
              <span className="text-sm mt-1">Hotels</span>
            </div>
            <div className="flex flex-col items-center">
              <FaMapMarkedAlt className={`text-2xl ${theme === "dark" ? "text-green-300" : "text-green-400"}`} />
              <span className="text-sm mt-1">Services</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => { setShow(false); setConfetti(false); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              Let’s Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
