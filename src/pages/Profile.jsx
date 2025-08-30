import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import HeroSection from "./ProfileBanner";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [tourBookings, setTourBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchBookings = async () => {
      try {
        const [tourRes, hotelRes, flightRes] = await Promise.all([
          fetch("https://ass-server-1.onrender.com/tours"),
          fetch("https://ass-server-1.onrender.com/hotels"),
          fetch("https://ass-server-1.onrender.com/flights"),
        ]);

        const [tourData, hotelData, flightData] = await Promise.all([
          tourRes.json(),
          hotelRes.json(),
          flightRes.json(),
        ]);

        const isUserBooking = (item) =>
          item.email === user.email || item.bookedBy?.email === user.email;

        setTourBookings(tourData.filter(isUserBooking));
        setHotelBookings(hotelData.filter(isUserBooking));
        setFlightBookings(flightData.filter(isUserBooking));
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user)
    return (
      <div className={`text-center py-10 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        Please log in to view your profile.
      </div>
    );

  const renderCards = (items, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item._id}
          className={`rounded-lg overflow-hidden flex flex-col shadow ${
            isDark ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border"
          }`}
        >
          <img
            src={item.photo || item.photoUrl || "https://via.placeholder.com/300x200"}
            alt={item.selectedPackage || item.hotelName || item.flightNumber || type}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex-grow flex flex-col">
            <h4 className="text-xl font-bold mb-1 capitalize">
              {item.selectedPackage || item.hotelName || item.flightNumber || "Booking"}
            </h4>
            {item.pickupLocation && <p className="text-sm mb-1">📍 {item.pickupLocation}</p>}
            {item.hotelLocation && <p className="text-sm mb-1">📍 {item.hotelLocation}</p>}
            {item.departure && item.arrival && (
              <p className="text-sm mb-1">✈️ {item.departure} → {item.arrival}</p>
            )}
            {(item.travelDate || item.checkInDate) && (
              <p className="text-sm mb-1">
                📅 {item.travelDate || item.checkInDate} → {item.returnDate || item.checkOutDate || "N/A"}
              </p>
            )}
            <p className="font-semibold mb-2 text-yellow-600">
              💰 ${item.totalPrice || item.hotelPrice || item.price || "N/A"}
            </p>
            {item.specialRequests && <p className="text-sm mb-3 line-clamp-3">{item.specialRequests}</p>}
            {item.mapUrl && (
              <iframe
                src={item.mapUrl}
                className="w-full h-36 border rounded"
                title="Map Preview"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={isDark ? "bg-gray-900" : "bg-gray-50"}>
      <HeroSection />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Info */}
        <div className="flex items-center gap-6 mb-10">
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="Profile"
            className={`h-20 w-20 rounded-full border-2 ${isDark ? "border-green-500" : "border-blue-500"}`}
          />
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {user.displayName || "User"}
            </h2>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>{user.email}</p>
          </div>
        </div>

        {!loading && (
          <>
            {tourBookings.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-green-500 mb-6">My Tour Bookings</h3>
                {renderCards(tourBookings, "tour")}
              </div>
            )}

            {hotelBookings.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-blue-500 mb-6">My Hotel Bookings</h3>
                {renderCards(hotelBookings, "hotel")}
              </div>
            )}

            {flightBookings.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-purple-500 mb-6">My Flight Bookings</h3>
                {renderCards(flightBookings, "flight")}
              </div>
            )}

            {tourBookings.length === 0 &&
              hotelBookings.length === 0 &&
              flightBookings.length === 0 && (
                <p className={`text-center mt-12 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                  You have no bookings yet.
                </p>
              )}
          </>
        )}

        {loading && (
          <p className={`text-center mt-12 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading your bookings...
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
