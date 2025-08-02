import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed

const MySwal = withReactContent(Swal);

const AllTours = () => {
  const { user } = useContext(AuthContext); // logged-in user info
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleBookTour = (tour) => {
    if (!user) {
      return Swal.fire("Please sign in first!", "", "info");
    }

    const bookedData = {
      ...tour,
      bookedAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.displayName || "Unknown User",
      userPhoto: user.photoURL || "https://source.unsplash.com/100x100/?person",
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem("bookedTours")) || [];
    localStorage.setItem("bookedTours", JSON.stringify([...existing, bookedData]));

    Swal.fire("Booked!", "Your tour has been added to your bookings.", "success");
  };

  const handleViewDetails = (tour) => {
    MySwal.fire({
      title: `${tour.selectedPackage} Package`,
      html: `
        <div style="text-align:left">
          <img src="${tour.photo}" alt="Preview" style="width:100%; margin-bottom:10px; border-radius:5px;" />
          <p><strong>Pickup:</strong> ${tour.pickupLocation}</p>
          <p><strong>Travel:</strong> ${tour.travelDate} → ${tour.returnDate}</p>
          <p><strong>Total Price:</strong> $${tour.totalPrice}</p>
          <p><strong>Special Requests:</strong><br />${tour.specialRequests}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Book Now",
      cancelButtonText: "Close",
      preConfirm: () => handleBookTour(tour),
    });
  };

  if (loading) return <div className="text-center py-10">Loading all tours...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">All Tour Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
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
              <p className="text-sm text-gray-600 mb-2">Pickup: {tour.pickupLocation}</p>
              <p className="text-sm text-gray-600 mb-2">
                Travel: {tour.travelDate} → {tour.returnDate}
              </p>
              <p className="text-yellow-600 font-bold text-lg mb-2">${tour.totalPrice}</p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3 whitespace-pre-line">
                {tour.specialRequests}
              </p>
            </div>
            <button
              onClick={() => handleViewDetails(tour)}
              className="mt-auto inline-block text-center py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTours;
