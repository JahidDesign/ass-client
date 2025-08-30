import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import HeroSection from "./toursBanner";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const TourBookingForm = ({
  title = "",
  highlight = "",
  image = "",
  duration = "",
  hotel = "",
  car = "",
  boat = "",
  restaurant = "",
  price = "",
  googleMap = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";

  const initialFormState = {
    selectedPackage: "single",
    travelDate: "",
    returnDate: "",
    pickupLocation: "",
    specialRequests: "",
    photo: image,
    mapUrl: googleMap,
    totalPrice: price,
    features: { hotel: false, car: false, boat: false, restaurant: false },
    userEmail: user?.email || "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photo: image,
      mapUrl: googleMap,
      totalPrice: price,
      userEmail: user?.email || "",
    }));
  }, [image, googleMap, price, user]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (["hotel", "car", "boat", "restaurant"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        features: { ...prev.features, [id]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedServices = Object.entries(formData.features)
      .filter(([_, val]) => val)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");

    const submissionData = {
      ...formData,
      specialRequests: `Selected Services: ${selectedServices}\n${formData.specialRequests}`,
    };

    try {
      const res = await fetch("https://ass-server-1.onrender.com/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      if (data.insertedId || data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Booking Successful!",
          text: "Your tour has been booked successfully.",
        });
        setFormData(initialFormState);
      } else throw new Error("Server error");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Theme styles
  const formBg = isDark ? "bg-gray-900 text-gray-200" : "bg-white text-black";
  const inputBase =
    "w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-yellow-500 transition";
  const inputBg = isDark
    ? `${inputBase} bg-gray-800 text-gray-200 border-gray-600`
    : `${inputBase} bg-white text-black border-gray-300`;
  const buttonBg = isDark
    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
    : "bg-yellow-600 hover:bg-yellow-700 text-white";
  const panelShadow = isDark
    ? "shadow-lg shadow-black/40"
    : "shadow-lg shadow-gray-300";

  return (
    <div className={`${formBg} min-h-screen`}>
      <Helmet>
        <title>Book: {title} | Travel-Tours-Agency</title>
      </Helmet>
      <HeroSection />

      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Tour Overview */}
          <div
            className={`${formBg} rounded-xl p-6 space-y-4 border ${panelShadow}`}
          >
            <h2 className="text-3xl font-bold text-yellow-700 mb-4">{title}</h2>
            <ul className="space-y-1">
              <li>
                <strong>Highlight:</strong> {highlight}
              </li>
              <li>
                <strong>Duration:</strong> {duration}
              </li>
              <li>
                <strong>Hotel:</strong> {hotel}
              </li>
              <li>
                <strong>Car:</strong> {car}
              </li>
              <li>
                <strong>Boat:</strong> {boat}
              </li>
              <li>
                <strong>Restaurant:</strong> {restaurant}
              </li>
              <li className="text-red-600 font-semibold">
                <strong>Base Price:</strong> {price}
              </li>
            </ul>
            {image && (
              <img
                src={image}
                alt="Tour"
                className="rounded-md mt-4 w-full object-cover h-64 shadow"
              />
            )}
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className={`${formBg} rounded-xl p-8 space-y-6 border ${panelShadow}`}
          >
            <h3 className="text-2xl font-bold text-yellow-700 text-center">
              Book Your Tour
            </h3>

            <input type="hidden" id="userEmail" value={formData.userEmail} />

            <div>
              <label className="block text-sm font-medium">Package Type</label>
              <select
                id="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleChange}
                className={inputBg}
              >
                <option value="single">Single</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Travel Date</label>
                <input
                  type="date"
                  id="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className={inputBg}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Return Date</label>
                <input
                  type="date"
                  id="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={inputBg}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Pickup Location</label>
              <input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="e.g. Dhaka Airport Terminal 1"
                className={inputBg}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Select Additional Services
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["hotel", "car", "boat", "restaurant"].map((service) => (
                  <label
                    key={service}
                    className="inline-flex items-center space-x-2 capitalize"
                  >
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.features[service]}
                      onChange={handleChange}
                      className="border border-gray-400 rounded focus:ring-2 focus:ring-yellow-500 accent-yellow-600"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Total Price (USD)
              </label>
              <input
                id="totalPrice"
                type="number"
                value={formData.totalPrice}
                onChange={handleChange}
                className={inputBg}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Additional Notes</label>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
                placeholder="Any special requests?"
                className={`${inputBg} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Photo URL</label>
              <input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={handleChange}
                className={inputBg}
              />
              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded shadow mt-2"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Google Map Embed URL
              </label>
              <input
                id="mapUrl"
                type="url"
                value={formData.mapUrl}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className={inputBg}
              />
              {formData.mapUrl && (
                <div className="w-full h-64 mt-2 border rounded shadow overflow-hidden">
                  <iframe
                    src={formData.mapUrl}
                    title="Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 font-semibold rounded-md transition ${
                  loading
                    ? "bg-yellow-300 cursor-not-allowed"
                    : buttonBg
                }`}
              >
                {loading ? "Booking..." : `Book Now - $${formData.totalPrice}`}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TourBookingForm;
