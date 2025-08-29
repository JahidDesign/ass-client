// src/pages/ManageTourBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import EditTourModal from "./updateTours";
import { AuthContext } from "../context/AuthContext";

const ADMIN_EMAILS = ["jhadam904@gmail.com"];

const ManageTourBookings = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTour, setEditTour] = useState(null);
  const { user } = useContext(AuthContext);
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ass-server-1.onrender.com/tours");
      const data = await res.json();
      setTours(data);
    } catch (err) {
      console.error("Error fetching tours:", err);
      Swal.fire("Error", "Failed to fetch tours.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      Swal.fire("Access Denied", "Only admins can delete tours.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://ass-server-1.onrender.com/tours/${id}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", result.message || "Tour deleted", "success");
          fetchTours();
        } else {
          Swal.fire("Error", result.error || "Delete failed", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete the tour.", "error");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading tours...</p>;

  if (tours.length === 0)
    return <p className="text-center mt-10 text-gray-600">No tour bookings found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-700">
        Manage Tour Bookings
      </h1>

      {/* Table View for desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border rounded-xl shadow text-sm bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3">Package</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Travel Dates</th>
              <th className="p-3">Price</th>
              <th className="p-3">Features</th>
              <th className="p-3">Photo</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr
                key={tour._id}
                className="border-b hover:bg-green-50 transition duration-200"
              >
                <td className="p-3 capitalize">{tour.selectedPackage}</td>
                <td className="p-3">{tour.pickupLocation}</td>
                <td className="p-3">{tour.travelDate} → {tour.returnDate}</td>
                <td className="p-3">${tour.totalPrice}</td>
                <td className="p-3">
                  {Object.entries(tour.features || {})
                    .filter(([_, val]) => val)
                    .map(([key]) => key)
                    .join(", ")}
                </td>
                <td className="p-3">
                  <img
                    src={tour.photo}
                    alt="Tour"
                    className="h-14 w-24 object-cover rounded"
                  />
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => setEditTour(tour)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for mobile */}
      <motion.div
        className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {tours.map((tour) => (
          <motion.div
            key={tour._id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col"
            variants={cardVariants}
            whileHover="hover"
          >
            <img
              src={tour.photo}
              alt={tour.selectedPackage}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold capitalize">{tour.selectedPackage}</h2>
            <p className="text-sm text-gray-700">Pickup: {tour.pickupLocation}</p>
            <p className="text-sm text-gray-700">{tour.travelDate} → {tour.returnDate}</p>
            <p className="text-sm text-gray-700">Price: ${tour.totalPrice}</p>
            <p className="text-sm text-gray-700">
              Features:{" "}
              {Object.entries(tour.features || {})
                .filter(([_, val]) => val)
                .map(([key]) => key)
                .join(", ")}
            </p>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setEditTour(tour)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(tour._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Tour Modal */}
      <EditTourModal
        isOpen={!!editTour}
        tour={editTour}
        onClose={() => setEditTour(null)}
        onUpdated={fetchTours}
      />
    </div>
  );
};

export default ManageTourBookings;
