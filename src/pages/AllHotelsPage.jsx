import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // adjust path as needed

const MySwal = withReactContent(Swal);

const AllHotelsPage = () => {
  const { user } = useContext(AuthContext); // logged-in user
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  }, []);

  const handleBookNow = (hotel) => {
    if (!user) {
      MySwal.fire({
        icon: "warning",
        title: "You must be logged in to book",
        showConfirmButton: true,
        confirmButtonText: "Login",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    // Build booking object
    const booking = {
      hotelId: hotel._id,
      hotelName: hotel.hotelName,
      hotelLocation: hotel.hotelLocation,
      hotelPrice: hotel.hotelPrice,
      starRating: hotel.starRating,
      photoUrl: hotel.photoUrl,
      userName: user.name || user.displayName || "Unknown User",
      userEmail: user.email,
      userPhoto: user.photoURL || "",
      bookedAt: new Date().toISOString(),
    };

    // Save booking to localStorage (you can replace with API POST if you have backend)
    const existingBookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];
    localStorage.setItem("hotelBookings", JSON.stringify([...existingBookings, booking]));

    MySwal.fire({
      icon: "success",
      title: "Booking Confirmed!",
      html: `<p>You have successfully booked <strong>${hotel.hotelName}</strong>.</p>`,
      confirmButtonText: "View My Bookings",
    }).then(() => {
      navigate("/my-bookings"); // route to your bookings page
    });
  };

  const handleShowDetails = (hotel) => {
    MySwal.fire({
      title: `<strong>${hotel.hotelName}</strong>`,
      html: `
        <img src="${hotel.photoUrl || "https://source.unsplash.com/400x250/?hotel"}" 
             alt="${hotel.hotelName}" 
             style="width: 100%; border-radius: 10px; margin-bottom: 1rem;" />
        <p><strong>Location:</strong> ${hotel.hotelLocation}</p>
        <p><strong>Price:</strong> $${hotel.hotelPrice}</p>
        <p><strong>Rating:</strong> ${hotel.starRating} ★</p>
        <p><strong>Description:</strong> ${hotel.description}</p>
        <a href="${hotel.googleMap}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6;">
          View on Google Maps
        </a>
      `,
      showCancelButton: true,
      confirmButtonText: "Book Now",
      cancelButtonText: "Close",
      width: 600,
    }).then((result) => {
      if (result.isConfirmed) {
        handleBookNow(hotel);
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700">All Available Hotels</h1>

      <div className="text-center mb-6">
        <Link
          to="/"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition"
        >
          ← Back to Home
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading hotels...</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={hotel.photoUrl || "https://source.unsplash.com/400x250/?hotel"}
                alt={hotel.hotelName}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{hotel.hotelName}</h2>
                  <p className="text-sm text-gray-600 mt-1">{hotel.hotelLocation}</p>
                  <p className="text-sm text-gray-600">
                    <strong>${hotel.hotelPrice}</strong> / night
                  </p>
                  <p className="text-yellow-500 text-sm mb-2">Rating: {hotel.starRating} ★</p>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {hotel.description?.slice(0, 80)}...
                  </p>
                </div>

                <button
                  onClick={() => handleShowDetails(hotel)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  Show Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllHotelsPage;
