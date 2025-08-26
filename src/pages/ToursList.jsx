// src/pages/ToursList.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext";

const MySwal = withReactContent(Swal);

// -------------------
// Individual Tour Card
// -------------------
const TourCard = ({ tour, handleBook }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg border p-4 flex flex-col">
      <img
        src={tour.photo}
        alt={tour.selectedPackage}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 capitalize">
          {tour.selectedPackage} Package
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Pickup: {tour.pickupLocation}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Travel: {tour.travelDate} → {tour.returnDate}
        </p>
        <p className="text-yellow-600 font-bold text-lg mb-2">
          ${tour.totalPrice}
        </p>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3 whitespace-pre-line">
          {tour.specialRequests}
        </p>
      </div>
      <div className="flex gap-2 mt-auto">
        <Link
          to={`/tours/${tour._id}`}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
        >
          Details
        </Link>
        <button
          onClick={() => handleBook(tour)}
          className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Book
        </button>
      </div>
    </div>
  );
};

// -------------------
// Tours List Page
// -------------------
const ToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch tours
  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/tours")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tours");
        return res.json();
      })
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tours:", err);
        setError("Could not load tours. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Handle booking
  const handleBook = (tour) => {
    if (!user) {
      MySwal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in or sign up to book a tour.",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed) navigate("/login");
      });
      return;
    }

    const bookedTour = {
      ...tour,
      bookedBy: {
        name: user.displayName || "Guest",
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL || "",
      },
      bookedAt: new Date().toISOString(),
    };

    const previous = JSON.parse(localStorage.getItem("bookedTours")) || [];
    const updated = [...previous, bookedTour];
    localStorage.setItem("bookedTours", JSON.stringify(updated));

    MySwal.fire({
      icon: "success",
      title: "Booking Confirmed!",
      text: "Your tour has been successfully booked.",
      confirmButtonText: "Go to My Bookings",
    }).then(() => navigate("/my-bookings"));
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading tours...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );

  if (tours.length === 0)
    return <p className="text-center py-10 text-gray-500">No tours available.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">
        Tour Packages
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} handleBook={handleBook} />
        ))}
      </div>

      {tours.length > 6 && (
        <div className="text-center mt-8">
          <Link
            to="/all-packages"
            className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition"
          >
            Show More Tours →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ToursList;
