import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AuthContext } from "../context/AuthContext"; // <-- adjust path as needed

const MySwal = withReactContent(Swal);

const MyHotelsBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext); // Get current logged-in user

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hotelBookings")) || [];
    if (user?.email) {
      const userBookings = stored.filter(
        (booking) => booking.userEmail === user.email
      );
      setBookings(userBookings);
    }
  }, [user]);

  const handleDelete = (index) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        const allStored = JSON.parse(localStorage.getItem("hotelBookings")) || [];
        const updatedUserBookings = [...bookings];
        const bookingToRemove = updatedUserBookings.splice(index, 1)[0];

        // Remove from overall stored list too
        const updatedStored = allStored.filter(
          (b) => !(b.userEmail === bookingToRemove.userEmail && b.bookedAt === bookingToRemove.bookedAt)
        );

        localStorage.setItem("hotelBookings", JSON.stringify(updatedStored));
        setBookings(updatedUserBookings);

        MySwal.fire("Deleted!", "Your booking has been deleted.", "success");
      }
    });
  };

  if (!user?.email) {
    return (
      <div className="text-center py-10 text-gray-500">
        Please log in to see your hotel bookings.
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have no hotel bookings yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        My Hotel Bookings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bookings.map((booking, i) => (
          <div
            key={i}
            className="bg-white text-black rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 flex flex-col md:flex-row gap-5"
          >
            <img
              src={booking.photoUrl || "https://source.unsplash.com/100x100/?hotel"}
              alt={booking.hotelName}
              className="w-full md:w-40 h-40 object-cover rounded-lg"
            />

            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-bold mb-1">{booking.hotelName}</h3>
                <p className="text-sm"><strong>Location:</strong> {booking.hotelLocation}</p>
                <p className="text-sm"><strong>Price:</strong> ${booking.hotelPrice} / night</p>
                <p className="text-sm"><strong>Rating:</strong> {booking.starRating} ★</p>
                <p className="text-sm"><strong>Booked By:</strong> {booking.userName}</p>
                <p className="text-sm"><strong>Email:</strong> {booking.userEmail}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Booked on: {new Date(booking.bookedAt).toLocaleString()}
                </p>
              </div>

              {booking.userPhoto && (
                <div className="mt-3">
                  <img
                    src={booking.userPhoto}
                    alt={booking.userName}
                    className="w-12 h-12 rounded-full border"
                  />
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => handleDelete(i)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotelsBookings;
