// src/pages/MyBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyToursBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://ass-server-1.onrender.com/bookings?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Please login to view your bookings.</p>;
  if (bookings.length === 0) return <p className="text-center mt-10">No bookings yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
        >
          {/* Tour image */}
          <img
            src={booking.photoUrl || "https://via.placeholder.com/400"}
            alt={booking.title}
            className="w-full h-40 object-cover"
          />

          {/* Card body */}
          <div className="p-4">
            <h2 className="text-lg font-bold">{booking.title}</h2>
            <p className="text-gray-600">{booking.location}</p>
            <p className="mt-2 font-semibold text-blue-600">${booking.price}</p>
            <p className="text-sm text-gray-500 mt-1">
              Booked on {new Date(booking.date).toLocaleDateString()}
            </p>

            {/* User info */}
            <div className="flex items-center gap-3 mt-4">
              <img
                src={booking.userPhoto || "https://via.placeholder.com/40"}
                alt={booking.userName}
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className="font-medium">{booking.userName}</p>
                <p className="text-sm text-gray-500">{booking.userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyToursBookings;
