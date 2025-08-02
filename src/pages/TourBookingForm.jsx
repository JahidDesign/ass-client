import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import HeroSection from'./toursBanner';
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
  const initialFormState = {
    selectedPackage: "single",
    travelDate: "",
    returnDate: "",
    pickupLocation: "",
    specialRequests: "",
    photo: image,
    mapUrl: googleMap,
    totalPrice: price,
    features: {
      hotel: false,
      car: false,
      boat: false,
      restaurant: false,
    },
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photo: image,
      mapUrl: googleMap,
      totalPrice: price,
    }));
  }, [image, googleMap, price]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (["hotel", "car", "boat", "restaurant"].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [id]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedServices = Object.entries(formData.features)
      .filter(([_, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");

    const submissionData = {
      ...formData,
      specialRequests: `Selected Services: ${selectedServices}\n${formData.specialRequests}`,
    };

    try {
      const res = await fetch("http://localhost:3000/tours", {
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
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <Helmet>
        <title>Book: {title} | Travel-Tours-Agency</title>
      </Helmet>
      <HeroSection />
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Tour Overview */}
          <div className="bg-white text-black rounded-xl shadow p-6 space-y-4 border">
            <h2 className="text-3xl font-bold text-yellow-700 mb-4">{title}</h2>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Highlight:</strong> {highlight}</li>
              <li><strong>Duration:</strong> {duration}</li>
              <li><strong>Hotel:</strong> {hotel}</li>
              <li><strong>Car:</strong> {car}</li>
              <li><strong>Boat:</strong> {boat}</li>
              <li><strong>Restaurant:</strong> {restaurant}</li>
              <li className="text-red-600 font-semibold"><strong>Base Price:</strong> {price}</li>
            </ul>
            {image && (
              <img src={image} alt="Tour" className="rounded-md mt-4 w-full object-cover h-64 shadow" />
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="bg-white text-black rounded-xl shadow p-8 space-y-6 border">
            <h3 className="text-2xl font-bold text-yellow-700 text-center">Book Your Tour</h3>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Package Type</label>
              <select
                id="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md bg-white text-black"
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
                  className="w-full border px-4 py-2 rounded-md"
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
                  className="w-full border px-4 py-2 rounded-md"
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
                className="w-full border px-4 py-2 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Select Additional Services</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["hotel", "car", "boat", "restaurant"].map((service) => (
                  <label key={service} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.features[service]}
                      onChange={handleChange}
                      className="accent-yellow-600"
                    />
                    <span className="capitalize">{service}</span>
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
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
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
                className="w-full border px-4 py-2 rounded-md resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Photo URL</label>
              <input
                id="photo"
                type="url"
                value={formData.photo}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
              {formData.photo && (
                <img src={formData.photo} alt="Preview" className="w-full h-40 object-cover rounded shadow mt-2" />
              )}
            </div>

           {/* Google Map Input */}
           <div>
           <label className="block text-sm font-medium">Google Map Embed URL</label>
            <input
             id="mapUrl"
             type="url"
             value={formData.mapUrl}
             onChange={handleChange}
             placeholder="https://www.google.com/maps/embed?pb=..."
             className="w-full border px-4 py-2 rounded-md"
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
                className={`w-full py-3 font-semibold text-white rounded-md transition ${
                  loading ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
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
