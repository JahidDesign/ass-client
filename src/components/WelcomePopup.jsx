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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate__animated animate__fadeIn overflow-hidden">
      {/* Confetti */}
      {confetti && <Confetti numberOfPieces={200} recycle={false} />}

      {/* Floating plane animation */}
      <FaPlaneDeparture
        className={`absolute top-8 text-4xl ${theme === "dark" ? "text-blue-400" : "text-blue-600"} animate-flyPlane`}
        style={{ left: "-100px" }}
      />

      {/* Main Popup */}
      <div
        className={`relative max-w-md w-full p-8 rounded-3xl shadow-2xl transition-colors duration-500
          ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
          animate__animated animate__zoomIn`}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">
            Welcome to Jahid Holiday Homes & Tourism!
          </h2>
          <p className="mb-6 text-sm md:text-base">
            Explore the beauty of <span className="font-semibold">Sylhet</span> with our curated tour packages, 
            comfortable hotels, and personalized travel services. Plan your perfect getaway with expert guidance 
            and seamless experiences.
          </p>

          {/* Icon Summary */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <FaPlaneDeparture className={`text-2xl mb-1 animate-bounce ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <span className="text-sm">Tours</span>
            </div>
            <div className="flex flex-col items-center">
              <FaHotel className={`text-2xl mb-1 animate-bounce delay-200 ${theme === "dark" ? "text-red-400" : "text-red-500"}`} />
              <span className="text-sm">Hotels</span>
            </div>
            <div className="flex flex-col items-center">
              <FaMapMarkedAlt className={`text-2xl mb-1 animate-bounce delay-400 ${theme === "dark" ? "text-green-300" : "text-green-400"}`} />
              <span className="text-sm">Travel Services</span>
            </div>
          </div>

          {/* Explore Button */}
          <button
            onClick={() => { setShow(false); setConfetti(false); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300"
          >
            Let’s Explore
          </button>
        </div>
      </div>

      {/* Floating plane animation styles */}
      <style jsx>{`
        @keyframes flyPlane {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(120vw); }
        }
        .animate-flyPlane {
          animation: flyPlane 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomePopup;
