// src/pages/MyFlightBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaPlane, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // import styles for tooltip

const ADMIN_EMAILS = ["jhadam904@gmail.com"];

const MyFlightBookings = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isAdmin = ADMIN_EMAILS.includes(user?.email);

  const [bookings, setBookings] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/flights");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this booking!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://ass-server-sy-travles.onrender.com/flights/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.deletedCount > 0) {
            Swal.fire("Deleted!", "The booking has been deleted.", "success");
            fetchBookings();
          } else throw new Error("Not deleted");
        } catch (err) {
          Swal.fire("Error", "Failed to delete the booking.", "error");
        }
      }
    });
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      passengerName: booking.passengerName,
      departure: booking.departure,
      arrival: booking.arrival,
      departureDate: booking.departureDate,
      airlineName: booking.airlineName,
      travelClass: booking.travelClass,
      seatPreference: booking.seatPreference,
      mealPreference: booking.mealPreference,
      priceType: booking.priceType,
      regularPrice: booking.regularPrice,
      offerPrice: booking.offerPrice,
    });
    setErrors({});
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setEditForm({});
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });

    let newErrors = { ...errors };
    if (!value.trim()) newErrors[name] = "This field is required";
    else delete newErrors[name];

    if (name === "offerPrice" && Number(value) > Number(editForm.regularPrice)) {
      newErrors[name] = "Offer price cannot exceed regular price";
    }
    if (name === "regularPrice" && Number(editForm.offerPrice) > Number(value)) {
      newErrors["offerPrice"] = "Offer price cannot exceed regular price";
    }
    setErrors(newErrors);
  };

  const handleUpdate = async () => {
    if (Object.keys(errors).length > 0) {
      Swal.fire("Error", "Please fix the validation errors", "error");
      return;
    }
    try {
      const res = await fetch(`https://ass-server-sy-travles.onrender.com/flights/${selectedBooking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        Swal.fire("Updated!", "Booking has been updated.", "success");
        fetchBookings();
        closeModal();
      } else Swal.fire("Error", "No changes were made.", "error");
    } catch (err) {
      Swal.fire("Error", "Failed to update the booking.", "error");
    }
  };

  if (!bookings.length) {
    return (
      <div className={`text-center py-10 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
        No bookings found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className={`text-3xl font-bold mb-12 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        My Flight Bookings
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((b) => (
          <motion.div
            key={b.ticketNumber}
            className={`relative rounded-3xl shadow-xl overflow-hidden transition hover:shadow-2xl ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(b._id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-semibold z-10"
                data-tooltip-id={`tooltip-delete-${b._id}`}
                data-tooltip-content="Delete Booking"
              >
                X
              </button>
            )}
            <Tooltip id={`tooltip-delete-${b._id}`} place="top" />

            <div className="flex items-center gap-4 p-4 border-b border-gray-700 dark:border-gray-700">
              {b.customerPhoto ? (
                <img
                  src={b.customerPhoto}
                  alt="Customer"
                  className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                  N/A
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-blue-500 dark:text-blue-400">{b.passengerName}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-300">{b.ticketNumber}</p>
              </div>
            </div>

            <div className="p-4 space-y-2 text-sm">
              <p>
                <FaPlane className="inline mr-1 text-blue-500" />
                {b.departure} → {b.arrival}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {b.departureDate}
              </p>
              <p>
                <span className="font-semibold">Airline:</span> {b.airlineName}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {["travelClass", "seatPreference", "mealPreference", "priceType"].map((field) => (
                  <motion.span
                    key={field}
                    whileHover={{ scale: 1.2 }}
                    data-tooltip-id={`tooltip-${b._id}-${field}`}
                    data-tooltip-content={field === "priceType" ? `${b.priceType} price` : b[field]}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      field === "travelClass"
                        ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                        : field === "seatPreference"
                        ? "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
                        : field === "mealPreference"
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                        : b.priceType === "Offer"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {b[field]}
                  </motion.span>
                ))}
                {["travelClass", "seatPreference", "mealPreference", "priceType"].map((field) => (
                  <Tooltip key={field} id={`tooltip-${b._id}-${field}`} place="top" />
                ))}
              </div>

              <p className="font-semibold text-lg mt-2">
                {b.priceType === "Offer" ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">${b.regularPrice}</span>
                    <span className="text-green-600 dark:text-green-400">${b.offerPrice}</span>
                  </>
                ) : (
                  <span className="text-green-700 dark:text-green-400">${b.regularPrice}</span>
                )}
              </p>

              {isAdmin && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => openModal(b)}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <motion.div
            className={`bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-center">Edit Booking</h2>
            <div className="space-y-3">
              {[
                { label: "Passenger Name", name: "passengerName" },
                { label: "Departure", name: "departure" },
                { label: "Arrival", name: "arrival" },
                { label: "Date", name: "departureDate", type: "date" },
                { label: "Airline", name: "airlineName" },
                { label: "Class", name: "travelClass" },
                { label: "Seat", name: "seatPreference" },
                { label: "Meal", name: "mealPreference" },
                { label: "Price Type", name: "priceType" },
                { label: "Regular Price", name: "regularPrice", type: "number" },
                { label: "Offer Price", name: "offerPrice", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-medium">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={editForm[field.name] || ""}
                    onChange={handleChange}
                    data-tooltip-id={`tooltip-edit-${field.name}`}
                    data-tooltip-content={errors[field.name] || ""}
                    className={`w-full p-2 rounded-lg border ${
                      errors[field.name]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  <Tooltip id={`tooltip-edit-${field.name}`} place="top" />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Update Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyFlightBookings;
