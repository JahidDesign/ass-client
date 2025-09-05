// src/pages/ManageMyPackages.jsx
import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import ManageHotelPackages from "./ManageHotels";
import ManageTourBookings from "./ManageTourBookings";
import HeroSection from "./ManageBanner";
import MyTours from "./MyTours";
import MyHotelCards from "../components/HotelCards";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import AnimatedSection from "../components/secret/AnimatedSection"; 
const ManageMyPackages = () => {
  const { theme } = useContext(ThemeContext); // light or dark
  const { user } = useContext(AuthContext);

  const handleNotLoggedIn = () => {
    Swal.fire({
      icon: "warning",
      title: "Not Logged In",
      text: "You need to log in to manage or add packages.",
    });
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      <Helmet>
        <title>Manage My Packages - Travel-Tours-Agency</title>
        <meta
          name="description"
          content="Manage and update your travel packages easily on our platform."
        />
        <meta
          name="keywords"
          content="manage packages, travel, booking, update packages"
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection />
       <AnimatedSection>
       <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2
          className={`text-3xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Manage Your Tour Packages Seamlessly
        </h2>
        <p
          className={`max-w-2xl mx-auto mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Whether you're editing itineraries or reviewing bookings, our powerful
          dashboard helps you stay organized and efficient.
        </p>
        <a
          href="/manage"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
        >
          Go to Tour Manager
        </a>
      </div>
      {/* My Tours */}
     
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">My Tours</h2>
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-300">
            View and manage your booked tours with ease.
          </p>
        </div>
        {user ? (
          <MyTours />
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Please log in to view or manage your tours.</p>
            <button
              onClick={handleNotLoggedIn}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        )}
   
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">My Hotels</h2>
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-300">
            Manage your hotel bookings and reservations.
          </p>
        </div>
        {user ? (
          <MyHotelCards />
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Please log in to view or manage your hotels.</p>
            <button
              onClick={handleNotLoggedIn}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Login
            </button>
          </div>
        )}
    
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Manage Bookings & Packages
          </h2>
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-300">
            Update, cancel, or review your hotel and tour bookings.
          </p>
        </div>
        {user ? (
          <>
            <ManageTourBookings />
            <ManageHotelPackages />
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>You must log in to manage bookings and hotel packages.</p>
            <button
              onClick={handleNotLoggedIn}
              className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Login
            </button>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
};

export default ManageMyPackages;
