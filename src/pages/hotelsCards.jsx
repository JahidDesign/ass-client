// src/pages/HotelsCards.jsx
import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const HotelsCards = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 4;

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/hotels");
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleAddHotel = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must log in to add a hotel.",
      });
      return;
    }
    setShowAddModal(true);
  };

  // Pagination logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className={`${
        theme === "dark" ? " text-gray-200" : " text-gray-900"
      } min-h-screen py-10 px-4`}
    >
      <Helmet>
        <title>Our Hotels</title>
        <meta name="description" content="Discover top-rated hotels for your perfect stay." />
        <meta name="keywords" content="hotels, travel, rooms, booking" />
      </Helmet>

      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700">Explore Our Hotels</h1>
        <button
          onClick={handleAddHotel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition"
        >
          Add Hotel
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-500">Loading hotels...</p>

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 w-full">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-80 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"} animate-pulse`}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <>
         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {currentHotels.map((hotel) => (
    <div
      key={hotel._id}
      className={`${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col`}
    >
      <img
        src={hotel.photoUrl || "https://source.unsplash.com/600x350/?hotel"}
        alt={hotel.hotelName}
        className="h-64 w-full object-cover"
      />
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-2xl font-bold">{hotel.hotelName}</h2>
          <p className="text-sm mt-1">{hotel.hotelLocation}</p>
          <p className="text-sm font-semibold">${hotel.hotelPrice} / night</p>
          <p className="text-yellow-500 text-sm mb-2">Rating: {hotel.starRating} ★</p>
          <p className="text-sm line-clamp-3">{hotel.description?.slice(0, 120)}...</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/hotels/${hotel._id}`)}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-lg"
          >
            Show Details
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => paginate(num)}
                  className={`px-4 py-2 rounded-md font-semibold ${
                    currentPage === num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  } transition`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {showAddModal && <AddHotelModal onClose={() => setShowAddModal(false)} user={user} />}
        </>
      )}
    </div>
  );
};

export default HotelsCards;

// --------------------
// AddHotelModal Component (unchanged)
// --------------------
const AddHotelModal = ({ onClose, user }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const defaultForm = {
    hotelName: "",
    hotelPrice: "",
    hotelLocation: "",
    googleMap: "",
    starRating: 0,
    description: "",
    photoUrl: "",
    userEmail: user?.email || "",
    features: {
      wifi: false,
      restaurant: false,
      parking: false,
      conference: false,
      banquet: false,
    },
  };

  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const inputBg = isDark
    ? "bg-gray-800 text-gray-100 border border-gray-600 focus:ring focus:ring-yellow-500"
    : "bg-white text-black border border-gray-300 focus:ring focus:ring-blue-400";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.features) {
      setFormData((prev) => ({
        ...prev,
        features: { ...prev.features, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleStarClick = (star) => {
    setFormData((prev) => ({ ...prev, starRating: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.insertedId || data.acknowledged) {
        Swal.fire("Success", "Hotel added successfully!", "success");
        setFormData(defaultForm);
        onClose();
      } else throw new Error("Failed to add hotel");
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
      <div
        className={`w-full max-w-2xl p-6 rounded-2xl ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} shadow-lg relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Add Hotel Package</h2>

        {loading && (
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded border bg-gray-300 animate-pulse"></div>
            <span className="ml-2 text-gray-500 font-medium">Saving...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField name="hotelName" label="Hotel Name" value={formData.hotelName} onChange={handleChange} inputClass={inputBg} />
            <InputField name="hotelPrice" label="Price ($)" type="number" value={formData.hotelPrice} onChange={handleChange} inputClass={inputBg} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField name="hotelLocation" label="Location" value={formData.hotelLocation} onChange={handleChange} inputClass={inputBg} />
            <InputField name="googleMap" label="Google Map URL" type="url" value={formData.googleMap} onChange={handleChange} inputClass={inputBg} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Star Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((star) => (
                <span key={star} onClick={() => handleStarClick(star)} className={`text-xl cursor-pointer ${formData.starRating >= star ? "text-yellow-400" : "text-gray-400"}`}>★</span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(formData.features).map(([key, val]) => (
                <label key={key} className="inline-flex items-center space-x-2 capitalize">
                  <input type="checkbox" name={key} checked={val} onChange={handleChange} className="form-checkbox text-blue-600 border-gray-400" />
                  <span>{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className={`w-full px-4 py-2 rounded-md ${inputBg}`} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-14 h-14 rounded border bg-gray-300 animate-pulse"></div>
              ) : (
                <img src={formData.photoUrl || "https://source.unsplash.com/60x60/?hotel"} alt="Preview" className="w-14 h-14 rounded border object-cover" />
              )}
              <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="https://example.com/hotel.jpg" className={`w-full px-4 py-2 rounded-md ${inputBg}`} />
            </div>
          </div>

          <div className="text-center">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow disabled:opacity-50">
              {loading ? "Saving..." : "Add Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --------------------
// InputField Component
// --------------------
const InputField = ({ name, label, value, onChange, placeholder = "", type = "text", inputClass }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-4 py-2 rounded-md ${inputClass}`} />
  </div>
);
