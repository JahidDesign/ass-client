import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MySwal = withReactContent(Swal);

const ToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleViewDetails = (tour) => {
    MySwal.fire({
      title: `${tour.selectedPackage} Package`,
      html: `
        <div style="text-align:left">
          <img src="${tour.photo}" alt="Tour" style="width:100%; border-radius:6px; margin-bottom:10px;" />
          <p><strong>Pickup:</strong> ${tour.pickupLocation}</p>
          <p><strong>Travel:</strong> ${tour.travelDate} → ${tour.returnDate}</p>
          <p><strong>Total Price:</strong> $${tour.totalPrice}</p>
          <p><strong>Special Requests:</strong><br />${tour.specialRequests}</p>
          ${
            tour.mapUrl
              ? `<iframe src="${tour.mapUrl}" style="width:100%; height:200px; border-radius:6px; margin-top:10px;" loading="lazy"></iframe>`
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Book Now",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        if (!user) {
          MySwal.fire({
            icon: "warning",
            title: "Login Required",
            text: "Please log in or sign up to book a tour.",
            confirmButtonText: "Go to Login",
            showCancelButton: true,
          }).then((res) => {
            if (res.isConfirmed) {
              navigate("/login");
            }
          });
          return;
        }

        const bookedTour = {
          ...tour,
          bookedBy: {
            name: user.displayName || "Guest",
            email: user.email || "Not Provided",
            photoURL: user.photoURL || "",
          },
        };

        const previous = JSON.parse(localStorage.getItem("bookedTours")) || [];
        const updated = [...previous, bookedTour];
        localStorage.setItem("bookedTours", JSON.stringify(updated));
        localStorage.setItem("bookedTourId", tour._id);

        MySwal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: "Your tour has been successfully booked.",
          confirmButtonText: "Go to My Bookings",
        }).then(() => navigate("/my-bookings"));
      }
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading tours...</div>;
  }

  const visibleTours = showAll ? tours : tours.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">Tour Packages</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTours.map((tour) => (
          <div
            key={tour._id}
            className="bg-white rounded-lg shadow hover:shadow-lg border p-4 flex flex-col"
          >
            <img
              src={tour.photo}
              alt={tour.selectedPackage}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-1 capitalize">
                {tour.selectedPackage} Package
              </h3>
              <p className="text-sm text-gray-600 mb-1">Pickup: {tour.pickupLocation}</p>
              <p className="text-sm text-gray-600 mb-1">
                Travel: {tour.travelDate} → {tour.returnDate}
              </p>
              <p className="text-yellow-600 font-bold text-lg mb-2">${tour.totalPrice}</p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3 whitespace-pre-line">
                {tour.specialRequests}
              </p>
            </div>
            <button
              onClick={() => handleViewDetails(tour)}
              className="mt-auto py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {tours.length > 3 && !showAll && (
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
