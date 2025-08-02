import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import EditHotelModal from "./EditHotelModal";
import { AuthContext } from "../context/AuthContext"; // Adjust this path as needed

const ADMIN_EMAILS = ["jhadam904@gmail.com"]; // Replace with actual admin emails

const ManageHotelPackages = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editHotel, setEditHotel] = useState(null);

  const { user } = useContext(AuthContext); // Get user from context
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch("https://ass-server-1.onrender.com/hotels");
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      Swal.fire("Access Denied", "Only admins can delete hotel packages.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://ass-server-1.onrender.com/hotels/${id}`, {
          method: "DELETE",
        });

        const result = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", result.message, "success");
          fetchHotels();
        } else {
          Swal.fire("Error", result.error || "Delete failed", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete the hotel.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Manage Hotel Packages
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : hotels.length === 0 ? (
        <p className="text-center text-gray-500">No hotel packages found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border rounded-xl shadow">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3">Photo</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stars</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3">
                      <img
                        src={hotel.photoUrl || "https://source.unsplash.com/100x60/?hotel"}
                        alt={hotel.hotelName}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{hotel.hotelName}</td>
                    <td className="p-3">{hotel.hotelLocation}</td>
                    <td className="p-3">${hotel.hotelPrice}</td>
                    <td className="p-3 text-yellow-500">
                      {"★".repeat(hotel.starRating || 0)}
                    </td>
                    <td className="p-3 text-center space-x-3">
                      <button
                        onClick={() => setEditHotel(hotel)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(hotel._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-gray-100 rounded-xl shadow p-4">
                <img
                  src={hotel.photoUrl || "https://source.unsplash.com/400x200/?hotel"}
                  alt={hotel.hotelName}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h2 className="text-lg font-semibold">{hotel.hotelName}</h2>
                <p className="text-sm text-gray-600">Location: {hotel.hotelLocation}</p>
                <p className="text-sm text-gray-600">Price: ${hotel.hotelPrice}</p>
                <p className="text-yellow-500">{"★".repeat(hotel.starRating || 0)}</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => setEditHotel(hotel)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      <EditHotelModal
        isOpen={!!editHotel}
        hotel={editHotel}
        onClose={() => setEditHotel(null)}
        onUpdated={fetchHotels}
      />
    </div>
  );
};

export default ManageHotelPackages;
