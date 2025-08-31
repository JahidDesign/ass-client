import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import MyHotelBookings from "./HotelBookings";
import ToursBookings from "./ToursBooking";

const MyAllBookings = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // User not logged in view
  if (!user) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-3xl font-extrabold mb-4 text-red-500">
          You are not logged in
        </h1>
        <p
          className={`mb-6 text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
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

  // Logged-in user view
  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } min-h-screen py-10 px-6`}
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mb-12 mt-10">
        My Bookings
      </h1>

      {/* Hotel Bookings */}
      <section className="mb-12">
        <div className="text-center">
           <h2 className="text-3xl text-center font-bold mb-6 text-yellow-400 border-b-2 border-yellow-400 w-fit pb-1">
          Hotel Bookings
        </h2> 
        </div>
        <MyHotelBookings user={user} />
      </section>

      {/* Tour Bookings */}
      <section>
        <h2 className="text-3xl text-center font-bold mb-6 text-green-400 border-b-2 border-green-400 w-fit pb-1">
          Tour Bookings
        </h2>
        <ToursBookings user={user} />
      </section>
    </div>
  );
};

export default MyAllBookings;
