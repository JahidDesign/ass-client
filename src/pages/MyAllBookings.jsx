import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import HeroSection from "./myBookBanner";
import MyHotelBookings from "./HotelBookings";
import ToursBookings from "./ToursBooking";

const MyAllBookings = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  if (!user) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-3xl font-extrabold mb-4 text-red-500">
          You are not logged in
        </h1>
        <p className={`mb-6 text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Please log in to view your bookings.
        </p>
        <button
          onClick={() => {
            Swal.fire(
              "Login Required",
              "You need to log in to access bookings.",
              "warning"
            ).then(() => navigate("/login"));
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          Login
        </button>
      </div>
    );
  }

  // Modern centered h2 style
  const modernH2Style =
    "text-4xl mt-5 md:text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg relative";

  const h2WrapperStyle =
    "flex justify-center mt-5 items-center mb-12 after:block after:w-24 after:h-1 after:bg-yellow-400 after:mt-2 after:rounded-full";

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } min-h-screen py-10 px-6`}
    >
      {/* Hero Banner */}
      <HeroSection />

      {/* Hotel Bookings Section */}
      <section className="mb-16">
        <div className={h2WrapperStyle}>
          <h2 className={modernH2Style}>Hotel Bookings</h2>
        </div>
        <MyHotelBookings user={user} />
      </section>

      {/* Tour Bookings Section */}
      <section className="mb-16">
        <div className={h2WrapperStyle}>
          <h2 className={modernH2Style.replace("from-yellow-400 to-yellow-600", "from-green-400 to-green-600")}>
            Tour Bookings
          </h2>
        </div>
        <ToursBookings user={user} />
      </section>
    </div>
  );
};

export default MyAllBookings;
