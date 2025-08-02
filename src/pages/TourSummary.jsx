import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext"; // Assuming you're using Firebase Auth

const MyBookingOur = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext); // Get the logged-in user

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookedTours")) || [];
    if (user?.email) {
      const userBookings = stored.filter(
        (tour) =>
          tour.bookedBy?.email === user.email || tour.userEmail === user.email
      );
      setBookings(userBookings);
    }
  }, [user]);

  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const stored = JSON.parse(localStorage.getItem("bookedTours")) || [];
        const filtered = stored.filter(
          (tour) =>
            tour.bookedBy?.email === user.email || tour.userEmail === user.email
        );
        filtered.splice(index, 1);
        const updatedStored = stored.filter(
          (tour) =>
            !(
              tour.bookedBy?.email === user.email ||
              tour.userEmail === user.email
            )
        );
        const merged = [...updatedStored, ...filtered];
        localStorage.setItem("bookedTours", JSON.stringify(merged));
        setBookings(filtered);
        Swal.fire("Deleted!", "Your booking has been removed.", "success");
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">My Booked Tours</h2>

      {!user?.email ? (
        <p className="text-center text-gray-500">
          Please log in to see your bookings.
        </p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((tour, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg border p-5 flex flex-col"
            >
              <img
                src={tour.photo}
                alt="Tour"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-1 capitalize">
                {tour.selectedPackage} Package
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Pickup:</strong> {tour.pickupLocation}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Travel:</strong> {tour.travelDate} → {tour.returnDate}
              </p>
              <p className="text-yellow-600 font-bold text-lg mb-2">
                ${tour.totalPrice}
              </p>
              <p className="text-gray-700 text-sm mb-3 whitespace-pre-line">
                <strong>Special:</strong> {tour.specialRequests}
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 mt-auto pt-3 border-t mb-3">
                <img
                  src={tour.bookedBy?.photoURL || tour.userPhoto || ""}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {tour.bookedBy?.name || tour.userName || "Guest"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tour.bookedBy?.email || tour.userEmail || "Not Provided"}
                  </p>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(index)}
                className="mt-2 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingOur;
