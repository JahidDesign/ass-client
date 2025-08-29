// src/pages/AllTours.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const AllTours = () => {
  const { user } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedTours, setBookedTours] = useState([]);
  const navigate = useNavigate();

  // Load tours
  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/tours")
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tours:", err);
        setLoading(false);
      });
  }, []);

  // Load already booked tours from localStorage
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("bookedTours")) || [];
    setBookedTours(existing);
  }, [user]);

  // Handle booking
  const handleBookTour = (tour) => {
    if (!user) {
      return Swal.fire("Please sign in first!", "", "info");
    }

    // Check if already booked by this user
    const alreadyBooked = bookedTours.find(
      (b) => b._id === tour._id && b.userEmail === user.email
    );

    if (alreadyBooked) {
      return Swal.fire("Already booked!", "You booked this tour before.", "info");
    }

    const bookedData = {
      ...tour,
      bookedAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.displayName || "Unknown User",
      userPhoto: user.photoURL || "https://source.unsplash.com/100x100/?person",
    };

    const updated = [...bookedTours, bookedData];
    localStorage.setItem("bookedTours", JSON.stringify(updated));
    setBookedTours(updated);

    Swal.fire("Booked!", "Your tour has been added to your bookings.", "success");
  };

  // Navigate to tour details
  const handleViewDetails = (id) => {
    navigate(`/tours/${id}`);
  };

  if (loading) return <div className="text-center py-10">Loading all tours...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">
        All Tour Packages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => {
          const isBooked =
            bookedTours.find(
              (b) => b._id === tour._id && b.userEmail === user?.email
            ) !== undefined;

          return (
            <div
              key={tour._id}
              className="bg-white rounded-lg shadow hover:shadow-lg border p-4 flex flex-col"
            >
              <img
                src={tour.photo}
                alt="Tour"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 capitalize">
                  {tour.selectedPackage} Package
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Pickup: {tour.pickupLocation}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Travel: {tour.travelDate} → {tour.returnDate}
                </p>
                <p className="text-yellow-600 font-bold text-lg mb-2">
                  ${tour.totalPrice}
                </p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-3 whitespace-pre-line">
                  {tour.specialRequests}
                </p>
              </div>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handleViewDetails(tour._id)}
                  className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                >
                  View Details
                </button>

                {/* <button
                  onClick={() => handleBookTour(tour)}
                  disabled={isBooked}
                  className={`flex-1 py-2 px-4 rounded transition ${
                    isBooked
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isBooked ? "Completed" : "Book Now"}
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTours;
