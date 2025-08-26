// src/pages/TourDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext";

const MySwal = withReactContent(Swal);

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    fetch(`https://ass-server-1.onrender.com/tours/${id}`)
      .then((res) => res.json())
      .then((data) => setTour(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!tour)
    return <p className="text-center mt-10 text-gray-500">Loading tour details...</p>;

  const handleBooking = () => {
    if (!user) {
      MySwal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to book this tour.",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }

    const bookingData = {
      tourId: tour._id || id,
      title: tour.title,
      price: tour.price,
      location: tour.location,
      pickupLocation: tour.pickupLocation,
      travelDate: tour.travelDate,
      returnDate: tour.returnDate,
      specialRequests: tour.specialRequests,
      mapUrl: tour.mapUrl || "",
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "",
      date: new Date().toISOString(),
    };

    fetch("https://ass-server-1.onrender.com/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then(() => {
        MySwal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: "Your tour has been successfully booked.",
          confirmButtonText: "Go to My Bookings",
        }).then(() => navigate("/my-bookings"));
      })
      .catch((err) =>
        MySwal.fire({
          icon: "error",
          title: "Booking Failed",
          text: "Something went wrong. Please try again later.",
        })
      );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cover Image */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <img
          src={tour.photoUrl || tour.photo}
          alt={tour.title}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Tour Info */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{tour.title}</h1>
        <p className="text-gray-600 text-lg">{tour.location}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-semibold text-gray-700">Pickup Location:</p>
            <p className="text-gray-600">{tour.pickupLocation}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Travel Dates:</p>
            <p className="text-gray-600">
              {tour.travelDate} → {tour.returnDate}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Total Price:</p>
            <p className="text-yellow-600 font-bold text-lg">
              ${tour.price || tour.totalPrice}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Rating:</p>
            <p className="text-gray-600">⭐ {tour.rating || "N/A"}</p>
          </div>
        </div>

        {tour.specialRequests && (
          <div>
            <p className="font-semibold text-gray-700">Special Requests:</p>
            <p className="text-gray-600 whitespace-pre-line">{tour.specialRequests}</p>
          </div>
        )}

        {tour.mapUrl && (
          <div className="mt-4">
            <p className="font-semibold text-gray-700 mb-2">Location Map:</p>
            <iframe
              src={tour.mapUrl}
              title="Tour Location Map"
              className="w-full h-64 rounded-md border"
              loading="lazy"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBooking}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Book Now
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
