// src/pages/ToursList.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { FaMapMarkedAlt, FaCalendarCheck, FaHeadset, FaUsers } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const ToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const toursPerPage = 6;

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/tours");
      if (!res.ok) throw new Error("Failed to fetch tours");
      const data = await res.json();
      setTours(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tours. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / toursPerPage);

  const handleAddTour = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must be logged in to add a tour!",
      });
      return;
    }
    setShowModal(true);
  };

  // -----------------
  // Skeleton Loader
  // -----------------
  const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl shadow-md border overflow-hidden bg-gray-200 dark:bg-gray-700 h-80"></div>
  );

  // -----------------
  // Tour Card
  // -----------------
  const TourCard = ({ tour }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl shadow-md hover:shadow-xl border overflow-hidden flex flex-col ${
        theme === "dark" ? " text-gray-200" : " text-gray-800"
      }`}
    >
      <div className="relative">
        <img
          src={tour.photo || "https://placehold.co/600x400"}
          alt={tour.selectedPackage}
          className="w-full h-52 md:h-64 object-cover"
        />
        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow">
          {tour.selectedPackage.toUpperCase()}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-bold mb-1 capitalize">
          {tour.title}
        </h3>
        <h3 className="text-lg md:text-xl font-bold mb-1 capitalize">
          {tour.selectedPackage} Package
        </h3>
        <p className="text-sm mb-1">Pickup: {tour.pickupLocation}</p>
        <p className="text-sm mb-1">
          Travel: {new Date(tour.travelDate).toLocaleDateString()} →{" "}
          {new Date(tour.returnDate).toLocaleDateString()}
        </p>
        <p className="text-yellow-600 dark:text-yellow-400 font-extrabold text-lg mb-2">
          ${tour.totalPrice}
        </p>
        <p className="text-sm line-clamp-3 whitespace-pre-line mb-4">
          {tour.specialRequests || "No special notes."}
        </p>
        <Link
          to={`/tours/${tour._id}`}
          className="mt-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold transition"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );

  // -----------------
  // Tour Form Modal
  // -----------------
  const TourFormModal = ({ onClose }) => {
    const initialFormState = {
      title: "",
      selectedPackage: "single",
      travelDate: "",
      returnDate: "",
      pickupLocation: "",
      specialRequests: "",
      photo: "",
      mapUrl: "",
      totalPrice: 0,
      features: { hotel: false, car: false, boat: false, restaurant: false },
      userEmail: user?.email || "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { id, value, checked, type } = e.target;
      if (["hotel", "car", "boat", "restaurant"].includes(id)) {
        setFormData((prev) => ({
          ...prev,
          features: { ...prev.features, [id]: checked },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [id]: type === "number" ? Number(value) : value,
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const selectedServices = Object.entries(formData.features)
        .filter(([_, val]) => val)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
        .join(", ");

      const submissionData = {
        ...formData,
        specialRequests: `Selected Services: ${selectedServices}\n${formData.specialRequests}`,
      };

      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/tours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
        const data = await res.json();

        if (data.insertedId || data.acknowledged) {
          Swal.fire("Success", "Tour added successfully!", "success");
          setFormData(initialFormState);
          onClose();
          fetchTours();
        } else throw new Error("Failed to add tour");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong. Try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl shadow-lg w-full max-w-2xl p-6 relative ${
              theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              <AiOutlineClose />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-600 dark:text-yellow-400">
              Add New Tour
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Tour Title"
                className="border p-2 rounded-lg"
                required
              />
              <select
                id="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              >
                <option value="single">Single</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </select>
              <input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Pickup Location"
                className="border p-2 rounded-lg"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="border p-2 rounded-lg"
                  required
                />
                <input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="border p-2 rounded-lg"
                />
              </div>
              <div className="flex gap-4 flex-wrap">
                {["hotel", "car", "boat", "restaurant"].map((service) => (
                  <label key={service} className="flex items-center gap-2 capitalize">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.features[service]}
                      onChange={handleChange}
                    />
                    {service}
                  </label>
                ))}
              </div>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Special Requests"
                className="border p-2 rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  id="totalPrice"
                  type="number"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  placeholder="Total Price"
                  className="border p-2 rounded-lg flex-1"
                  required
                />
                <input
                  id="photo"
                  type="url"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="Photo URL"
                  className="border p-2 rounded-lg flex-1"
                />
              </div>
              <input
                id="mapUrl"
                type="url"
                value={formData.mapUrl}
                onChange={handleChange}
                placeholder="Google Map URL"
                className="border p-2 rounded-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? "Submitting..." : <><AiOutlinePlus /> Add Tour</>}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // -----------------
  // Render
  // -----------------
  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 dark:text-red-400 font-medium">
        {error}
      </div>
    );

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-5xl font-extrabold text-yellow-700 dark:text-yellow-400">
          Our Tour Packages
        </h2>
        <button
          onClick={handleAddTour}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition flex items-center gap-2"
        >
          <AiOutlinePlus /> Add Tour
        </button>
      </div>

      {/* Feature Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2
          className={`text-3xl font-bold text-center mb-2 ${
            theme === "dark" ? "text-yellow-400" : "text-yellow-700"
          }`}
        >
          Why Choose Our Tours?
        </h2>
        <p
          className={`text-center mb-8 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Explore our curated tour packages with flexible dates, personalized services, and 24/7 support.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaMapMarkedAlt className="text-3xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg">Custom Itineraries</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Tailored to match your preferences.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaCalendarCheck className="text-3xl text-green-600 mb-2" />
            <h3 className="font-semibold text-lg">Flexible Scheduling</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Pick dates that suit your plans.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaHeadset className="text-3xl text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg">24/7 Support</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Assistance whenever you need it.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaUsers className="text-3xl text-red-600 mb-2" />
            <h3 className="font-semibold text-lg">Group or Solo</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Perfect for any group size.
            </p>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentTours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50 flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <AiOutlineLeft /> Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {index + 1}
            </motion.button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50 flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Next <AiOutlineRight />
          </button>
        </div>
      )}

      {/* Add Tour Modal */}
      {showModal && <TourFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ToursList;
