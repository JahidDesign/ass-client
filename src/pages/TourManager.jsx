import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const initialTourForm = {
  title: "",
  highlight: "",
  image: "",
  duration: "",
  hotel: "",
  car: "",
  boat: "",
  restaurant: "",
  price: "",
  googleMap: "",
};

const TourManager = () => {
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState(initialTourForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await fetch("https://ass-server-1.onrender.com/tours");
      const data = await res.json();
      setTours(data);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
      Swal.fire("Error", "Failed to load tours", "error");
    }
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `https://ass-server-1.onrender.com/tours${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: editingId ? "Tour Updated!" : "Tour Created!",
        });
        setFormData(initialTourForm);
        setEditingId(null);
        fetchTours();
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Submit failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tour) => {
    setFormData(tour);
    setEditingId(tour._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(`https://ass-server-1.onrender.com/tours/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.ok) {
          Swal.fire("Deleted!", data.message, "success");
          fetchTours();
        } else {
          throw new Error(data.error || "Delete failed");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Tour Manager</h1>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {editingId ? "Edit Tour" : "New Tour"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "title", label: "Tour Title" },
              { id: "highlight", label: "Tour Highlights" },
              { id: "image", label: "Image URL", type: "url" },
              { id: "duration", label: "Duration" },
              { id: "hotel", label: "Hotel Name" },
              { id: "car", label: "Car Info" },
              { id: "boat", label: "Boat Info" },
              { id: "restaurant", label: "Restaurant Info" },
              { id: "price", label: "Price", type: "number" },
              { id: "googleMap", label: "Google Map URL", type: "url" },
            ].map(({ id, label, type = "text" }) => (
              <div key={id} className="flex flex-col">
                <label htmlFor={id} className="mb-1 font-medium">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              </div>
            ))}

            {formData.image && (
              <div className="md:col-span-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded shadow mt-2"
                />
              </div>
            )}

            {formData.googleMap && (
              <div className="md:col-span-2">
                <iframe
                  src={formData.googleMap}
                  title="Map Preview"
                  className="w-full h-48 mt-2 rounded border"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white font-semibold transition ${
                loading
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {loading
                ? "Submitting..."
                : editingId
                ? "Update Tour"
                : "Create Tour"}
            </button>
          </div>
        </form>

        {/* Tour List Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Tours</h2>
          {tours.length === 0 ? (
            <p>No tours available.</p>
          ) : (
            <ul className="space-y-4">
              {tours.map((tour) => (
                <li
                  key={tour._id}
                  className="border rounded p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold">{tour.title}</h3>
                    <p>
                      <span className="font-semibold">Highlights:</span>{" "}
                      {tour.highlight}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> ${tour.price}
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span>{" "}
                      {tour.duration}
                    </p>
                  </div>

                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEdit(tour)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourManager;
