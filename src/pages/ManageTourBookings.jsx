// src/pages/ManageTourBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import EditTourModal from "./updateTours";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaHotel, FaCar, FaShip, FaUtensils } from "react-icons/fa";

const ManageTourBookings = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTour, setEditTour] = useState(null);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    fetchTours();
  }, [user]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/tours");
      const data = await res.json();
      const userTours = user ? data.filter((t) => t.userEmail === user.email) : [];
      setTours(userTours);
    } catch (err) {
      console.error("Error fetching tours:", err);
      Swal.fire("Error", "Failed to fetch tours.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://ass-server-sy-travles.onrender.com/tours/${id}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", "Tour deleted successfully.", "success");
          fetchTours();
        } else {
          Swal.fire("Error", result.error || "Delete failed", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete the tour.", "error");
      }
    }
  };

  if (loading)
    return (
      <p className={`text-center mt-10 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        Loading tours...
      </p>
    );

  if (tours.length === 0)
    return (
      <p className={`text-center mt-10 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        No tours found for your account.
      </p>
    );

  return (
    <div className={`min-h-screen p-6 max-w-7xl mx-auto ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent 
          bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse">
          My Tour Bookings
        </h1>
        <p className={`mt-3 text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Manage all your booked tours from here.
        </p>
        <div className="w-28 h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-green-400 to-purple-600 shadow-lg animate-pulse"></div>
      </div>

      {/* Table for Desktop */}
      <div className="hidden lg:block overflow-x-auto rounded-xl shadow">
        <table className={`w-full border ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} rounded-xl`}>
          <thead className={`${isDark ? "bg-green-900 text-white" : "bg-green-100"}`}>
            <tr>
              <th className="p-3 text-left">Package</th>
              <th className="p-3 text-left">Pickup</th>
              <th className="p-3 text-left">Travel Dates</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Features</th>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id} className={`border-b transition duration-200 hover:bg-green-50 ${isDark ? "hover:bg-gray-700 border-gray-700" : ""}`}>
                <td className="p-3 capitalize font-medium">{tour.selectedPackage}</td>
                <td className="p-3">{tour.pickupLocation}</td>
                <td className="p-3">{tour.travelDate} → {tour.returnDate}</td>
                <td className="p-3 font-semibold">${tour.totalPrice}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  {tour.features?.hotel && <span className="flex items-center gap-1"><FaHotel /> Hotel</span>}
                  {tour.features?.car && <span className="flex items-center gap-1"><FaCar /> Car</span>}
                  {tour.features?.boat && <span className="flex items-center gap-1"><FaShip /> Boat</span>}
                  {tour.features?.restaurant && <span className="flex items-center gap-1"><FaUtensils /> Restaurant</span>}
                </td>
                <td className="p-3">
                  <img src={tour.photo} alt={tour.selectedPackage} className="h-14 w-24 object-cover rounded" />
                </td>
                <td className="p-3 text-center flex justify-center gap-3">
                  <button onClick={() => setEditTour(tour)} className="text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(tour._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for Mobile */}
      <motion.div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {tours.map((tour) => (
          <motion.div key={tour._id} className={`rounded-2xl shadow-md p-4 flex flex-col ${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            <img src={tour.photo} alt={tour.selectedPackage} className="w-full h-48 object-cover rounded mb-3" />
            <h2 className="text-lg font-semibold capitalize">{tour.selectedPackage}</h2>
            <p className="text-sm">Pickup: {tour.pickupLocation}</p>
            <p className="text-sm">{tour.travelDate} → {tour.returnDate}</p>
            <p className="text-sm font-semibold">Price: ${tour.totalPrice}</p>
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {tour.features?.hotel && <span className="flex items-center gap-1"><FaHotel /> Hotel</span>}
              {tour.features?.car && <span className="flex items-center gap-1"><FaCar /> Car</span>}
              {tour.features?.boat && <span className="flex items-center gap-1"><FaShip /> Boat</span>}
              {tour.features?.restaurant && <span className="flex items-center gap-1"><FaUtensils /> Restaurant</span>}
            </div>
            <div className="flex justify-between mt-3">
              <button onClick={() => setEditTour(tour)} className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => handleDelete(tour._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Modal */}
      <EditTourModal isOpen={!!editTour} tour={editTour} onClose={() => setEditTour(null)} onUpdated={fetchTours} />
    </div>
  );
};

export default ManageTourBookings;
