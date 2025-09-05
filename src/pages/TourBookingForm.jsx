// src/pages/TourBookingForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import HeroSection from "./toursBanner";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import AnimatedSection from "../components/secret/AnimatedSection";
import { FaMapMarkedAlt, FaCalendarCheck, FaHeadset, FaUsers } from "react-icons/fa";

const TourBookingForm = ({
  title = "",
  highlight = "",
  image = "",
  duration = "",
  hotel = "",
  car = "",
  boat = "",
  restaurant = "",
  price = 0,
  googleMap = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";

  const initialFormState = {
    title: title,
    selectedPackage: "single",
    travelDate: "",
    returnDate: "",
    pickupLocation: "",
    specialRequests: "",
    photo: image,
    mapUrl: googleMap,
    totalPrice: Number(price),
    features: { hotel: false, car: false, boat: false, restaurant: false },
    userEmail: user?.email || "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  // Sync props and user email
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title,
      photo: image,
      mapUrl: googleMap,
      totalPrice: Number(price),
      userEmail: user?.email || "",
    }));
    setManualOverride(false);
  }, [title, image, googleMap, price, user]);

  // Auto-calculate total price
  useEffect(() => {
    if (!manualOverride) {
      const basePrice = Number(price);
      const serviceCount = Object.values(formData.features).filter(Boolean).length;
      const updatedPrice = basePrice + serviceCount * 50; // $50 per extra service
      setFormData((prev) => ({ ...prev, totalPrice: updatedPrice }));
    }
  }, [formData.features, price, manualOverride]);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    if (["hotel", "car", "boat", "restaurant"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        features: { ...prev.features, [id]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.returnDate && formData.returnDate < formData.travelDate) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Dates",
        text: "Return date cannot be earlier than travel date.",
      });
      return;
    }

    setLoading(true);

    const selectedServices = Object.entries(formData.features)
      .filter(([_, val]) => val)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");

    const submissionData = {
      ...formData,
      specialRequests:
        selectedServices.length > 0
          ? `Selected Services: ${selectedServices}\n${formData.specialRequests}`
          : formData.specialRequests,
    };

    try {
      const res = await fetch("https://ass-server-sy-travles.onrender.com/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.insertedId || data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Booking Successful!",
          text: "Your tour has been booked successfully.",
        });

        setFormData((prev) => ({
          ...prev,
          selectedPackage: "single",
          travelDate: "",
          returnDate: "",
          pickupLocation: "",
          specialRequests: "",
          features: { hotel: false, car: false, boat: false, restaurant: false },
        }));
        setManualOverride(false);
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
  const featureTextClass = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`${formBg} min-h-screen`}>
      <Helmet>
        <title>Book: {title} | Travel-Tours-Agency</title>
      </Helmet>

      <HeroSection />
      <AnimatedSection>
        <section className="px-4 py-12">
          {/* Features Section */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Feature Header */}
            <h2
              className={`text-3xl font-bold text-center mb-2 ${
                isDark ? "text-yellow-400" : "text-yellow-700"
              }`}
            >
              Why Choose Our Tours?
            </h2>
            <p
              className={`text-center mb-8 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Experience the best tours with personalized services and expert guidance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <FaMapMarkedAlt className="text-3xl text-blue-600 mb-2" />
                <h3 className="font-semibold text-lg">Custom Itineraries</h3>
                <p className={`text-sm ${featureTextClass}`}>
                  Designed to match your preferences and budget.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaCalendarCheck className="text-3xl text-green-600 mb-2" />
                <h3 className="font-semibold text-lg">Flexible Scheduling</h3>
                <p className={`text-sm ${featureTextClass}`}>
                  Choose travel dates that work best for you.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaHeadset className="text-3xl text-purple-600 mb-2" />
                <h3 className="font-semibold text-lg">24/7 Support</h3>
                <p className={`text-sm ${featureTextClass}`}>
                  We’re always here to assist you during your journey.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <FaUsers className="text-3xl text-red-600 mb-2" />
                <h3 className="font-semibold text-lg">Group or Solo</h3>
                <p className={`text-sm ${featureTextClass}`}>
                  Perfect options whether you're alone or with others.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Booking Form */}
            <form
              onSubmit={handleSubmit}
              className={`${formBg} rounded-xl p-8 space-y-6 border col-span-2 ${panelShadow}`}
            >
              <h3 className="text-2xl font-bold text-yellow-700 text-center">
                Book Your Tour
              </h3>

              <input type="hidden" id="userEmail" value={formData.userEmail} />

              <div>
                <label className="block text-sm font-medium">Tour Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={inputBg}
                  required
                />
              </div>

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
                  <option value="group">Group</option>
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
                <label className="block text-sm font-medium">Additional Services</label>
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
                <label className="block text-sm font-medium">Total Price (USD)</label>
                <input
                  id="totalPrice"
                  type="number"
                  value={formData.totalPrice}
                  onChange={(e) => {
                    setManualOverride(true);
                    setFormData((prev) => ({
                      ...prev,
                      totalPrice: Number(e.target.value),
                    }));
                  }}
                  className={inputBg}
                />
                {manualOverride && (
                  <button
                    type="button"
                    onClick={() => setManualOverride(false)}
                    className="mt-2 text-xs text-blue-500 underline"
                  >
                    Reset to Auto Calculation
                  </button>
                )}
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
              </div>

              <div>
                <label className="block text-sm font-medium">Google Map Embed URL</label>
                <input
                  id="mapUrl"
                  type="url"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className={inputBg}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 font-semibold rounded-md transition ${
                    loading ? "bg-yellow-300 cursor-not-allowed" : buttonBg
                  }`}
                >
                  {loading ? "Booking..." : `Book Now - $${formData.totalPrice}`}
                </button>
              </div>
            </form>

            {/* Sidebar Summary */}
            <div className={`${formBg} rounded-xl p-6 border ${panelShadow} space-y-4`}>
              <h3 className="text-xl font-bold text-yellow-700">Booking Summary</h3>
              <p>
                <strong>Tour:</strong> {formData.title || title}
              </p>
              <p>
                <strong>Package:</strong> {formData.selectedPackage}
              </p>
              <p>
                <strong>Travel:</strong> {formData.travelDate || "-"}{" "}
                {formData.returnDate && `→ ${formData.returnDate}`}
              </p>
              <p>
                <strong>Pickup:</strong> {formData.pickupLocation || "-"}
              </p>
              <p>
                <strong>Services:</strong>{" "}
                {Object.entries(formData.features)
                  .filter(([_, val]) => val)
                  .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                  .join(", ") || "-"}
              </p>
              <p>
                <strong>Total Price:</strong> ${formData.totalPrice}
              </p>

              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded shadow"
                  loading="lazy"
                />
              )}

              {formData.mapUrl && (
                <div className="w-full h-48 border rounded overflow-hidden mt-2">
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
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default TourBookingForm;
