import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import HeroSection from "./airBanner";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";
import AnimatedSection from "../components/secret/AnimatedSection"
const defaultForm = {
  passengerName: "",
  passportNumber: "",
  email: "",
  phone: "",
  departure: "",
  arrival: "",
  departureDate: "",
  travelClass: "Economy",
  seatPreference: "Window",
  mealPreference: "Standard",
  airlineName: "",
  priceType: "Regular",
  regularPrice: "",
  offerPrice: "",
  discount: "",
  customerPhoto: "",
};

const generateTicketNumber = (name = "") => {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `TCKT-${datePart}-${initials}${randomPart}`;
};

const FlightSeatBooking = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const bgClass = theme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const inputBgClass = theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300";
  const buttonClass = theme === "dark"
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "priceType" && value === "Regular") {
      setFormData((prev) => ({
        ...prev,
        priceType: value,
        offerPrice: prev.regularPrice,
        discount: "0",
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

    const ticket = generateTicketNumber(formData.passengerName);
    const dataToSend = { ...formData, ticketNumber: ticket };

    try {
      const response = await fetch("https://ass-server-sy-travles.onrender.com/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (result.insertedId || result.acknowledged) {
        setTicketNumber(ticket);
        Swal.fire({
          icon: "success",
          title: "Seat Booked!",
          text: `Your ticket number is: ${ticket}`,
        });
        setFormData(defaultForm);
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while booking your flight.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${bgClass} min-h-screen`}>
      <Helmet>
        <title>Flight Seat Booking - Travel-Tours-Agency</title>
      </Helmet>

      <HeroSection />
     <AnimatedSection>
      <section className="px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className={`max-w-4xl mx-auto p-8 rounded-xl border shadow space-y-10 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700">
            ✈️ Book Your Flight Seat
          </h2>

          {/* Input Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { id: "passengerName", label: "Full Name", type: "text", placeholder: "John Doe" },
              { id: "passportNumber", label: "Passport Number", type: "text", placeholder: "A12345678" },
              { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              { id: "phone", label: "Phone", type: "tel", placeholder: "+8801XXXXXXXXX" },
              { id: "departure", label: "Departure", type: "text", icon: <FaPlaneDeparture />, placeholder: "Dhaka (DAC)" },
              { id: "arrival", label: "Arrival", type: "text", icon: <FaPlaneArrival />, placeholder: "Dubai (DXB)" },
              { id: "departureDate", label: "Departure Date", type: "date" },
              { id: "airlineName", label: "Airline", type: "text", placeholder: "Qatar Airways..." },
            ].map(({ id, label, type, icon, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium mb-1 flex items-center gap-1">
                  {icon} {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 ${inputBgClass}`}
                />
              </div>
            ))}
          </div>

          {/* Dropdown Preferences */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { id: "travelClass", label: "Travel Class", options: ["Economy", "Business", "First Class"] },
              { id: "seatPreference", label: "Seat Preference", options: ["Window", "Aisle", "Middle"] },
              { id: "mealPreference", label: "Meal Preference", options: ["Standard", "Vegetarian", "Halal", "Vegan"] },
            ].map(({ id, label, options }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
                <select
                  id={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md ${inputBgClass}`}
                >
                  {options.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="priceType" className="block text-sm font-medium mb-1">Pricing Type</label>
              <select
                id="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md ${inputBgClass}`}
              >
                <option value="Regular">Regular</option>
                <option value="Offer">Offer</option>
              </select>
            </div>

            <div>
              <label htmlFor="regularPrice" className="block text-sm font-medium mb-1">Regular Price ($)</label>
              <input
                id="regularPrice"
                type="number"
                value={formData.regularPrice}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md ${inputBgClass}`}
              />
            </div>

            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium mb-1">Offer Price ($)</label>
              <input
                id="offerPrice"
                type="number"
                value={formData.offerPrice}
                onChange={handleChange}
                disabled={formData.priceType === "Regular"}
                className={`w-full px-4 py-2 rounded-md ${inputBgClass}`}
              />
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium mb-1">Discount (%)</label>
              <input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                disabled={formData.priceType === "Regular"}
                className={`w-full px-4 py-2 rounded-md ${inputBgClass}`}
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label htmlFor="customerPhoto" className="block text-sm font-medium mb-1">Customer Photo URL</label>
            <input
              id="customerPhoto"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.customerPhoto}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md ${inputBgClass}`}
            />
            {formData.customerPhoto && (
              <img
                src={formData.customerPhoto}
                alt="Customer"
                className="mt-3 w-32 h-32 object-cover rounded-full border"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-md text-lg font-medium shadow ${buttonClass} transition`}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>

            {ticketNumber && (
              <div className="mt-6 text-green-600 text-base font-semibold">
                ✅ Ticket Confirmed: <span className="font-mono">{ticketNumber}</span>
              </div>
            )}
          </div>
        </form>
      </section>
      </AnimatedSection>
    </div>
  );
};

export default FlightSeatBooking;
