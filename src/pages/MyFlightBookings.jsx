import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; 
const ADMIN_EMAILS = ["jhadam904@gmail.com"];

const MyFlightBookings = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); 
  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  const [bookings, setBookings] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBookings = () => {
    fetch("https://ass-server-sy-travles.onrender.com/flights")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this booking!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://ass-server-sy-travles.onrender.com/flights/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.deletedCount > 0) {
            Swal.fire("Deleted!", "The booking has been deleted.", "success");
            fetchBookings();
          } else {
            throw new Error("Not deleted");
          }
        } catch (err) {
          Swal.fire("Error", "Failed to delete the booking.", "error");
        }
      }
    });
  };

  if (!bookings.length) {
    return <div className={`text-center py-10 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
      No bookings found.
    </div>;
  }

  return (
    <div className={`p-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-black"}`}>
      {isMobile ? (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b.ticketNumber} className={`p-4 shadow rounded-xl relative ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(b._id)}
                  className="absolute top-2 right-2 text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              )}
              <div className="flex items-center gap-4 mb-2">
                {b.customerPhoto && (
                  <img
                    src={b.customerPhoto}
                    alt="Customer"
                    className="w-16 h-16 object-cover rounded-full border"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg text-blue-700">{b.passengerName}</h3>
                  <p className="text-sm text-gray-500">{b.ticketNumber}</p>
                </div>
              </div>
              <p className="text-sm">Flight: {b.departure} → {b.arrival}</p>
              <p className="text-sm">Date: {b.departureDate}</p>
              <p className="text-sm">Airline: {b.airlineName}</p>
              <p className="text-sm">Class: {b.travelClass}</p>
              <p className="text-sm">Seat: {b.seatPreference} | Meal: {b.mealPreference}</p>
              <p className="text-sm font-medium mt-1 text-green-700">
                Price: ${b.priceType === "Offer" ? b.offerPrice : b.regularPrice} ({b.priceType})
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full border ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-black"}`}>
            <thead className={`${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-blue-50 text-blue-800"}`}>
              <tr className="text-left text-sm">
                <th className="p-3 border">Photo</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Ticket</th>
                <th className="p-3 border">Flight</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Airline</th>
                <th className="p-3 border">Class</th>
                <th className="p-3 border">Seat</th>
                <th className="p-3 border">Meal</th>
                <th className="p-3 border">Price</th>
                {isAdmin && <th className="p-3 border">Action</th>}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.ticketNumber} className="border-t text-sm">
                  <td className="p-2 border">
                    {b.customerPhoto ? (
                      <img
                        src={b.customerPhoto}
                        alt="Customer"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : "N/A"}
                  </td>
                  <td className="p-2 border">{b.passengerName}</td>
                  <td className="p-2 border">{b.ticketNumber}</td>
                  <td className="p-2 border">{b.departure} → {b.arrival}</td>
                  <td className="p-2 border">{b.departureDate}</td>
                  <td className="p-2 border">{b.airlineName}</td>
                  <td className="p-2 border">{b.travelClass}</td>
                  <td className="p-2 border">{b.seatPreference}</td>
                  <td className="p-2 border">{b.mealPreference}</td>
                  <td className="p-2 border font-medium text-green-700">
                    ${b.priceType === "Offer" ? b.offerPrice : b.regularPrice} ({b.priceType})
                  </td>
                  {isAdmin && (
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFlightBookings;
