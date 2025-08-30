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
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
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

      {/* My Tours */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {user ? <MyTours /> : (
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
      </section>

      {/* My Hotels */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {user ? <MyHotelCards /> : (
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
      </section>

      {/* Manage Bookings + Hotels */}
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-10">
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
      </section>
    </div>
  );
};

export default ManageMyPackages;
