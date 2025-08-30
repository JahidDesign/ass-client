import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import HeroSection from "./FromBanner"; 
import { ThemeContext } from "../context/ThemeContext";

const defaultForm = {
  name: "",
  title: "",
  description: "",
  experience: "",
  position: "",
  starRating: 0,
  photoUrl: "",
};

const TeamForm = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || name === "experience" ? Number(value) : value,
    }));
  };

  const handleStarClick = (star) => {
    setFormData((prev) => ({ ...prev, starRating: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "title", "description", "position", "photoUrl"];
    const emptyField = requiredFields.find((field) => !formData[field]);
    if (emptyField) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: `Please fill out the "${emptyField}" field.`,
      });
    }

    setLoading(true);
    try {
      const res = await fetch("https://ass-server-1.onrender.com/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to add team member.");
      }

      const result = await res.json();
      if (result.insertedId || result.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Team Member Added!",
          text: `${formData.name} has been successfully saved.`,
        });
        setFormData(defaultForm);
      } else {
        throw new Error("Server did not acknowledge the insert.");
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-2 border rounded-md transition ${
    isDark
      ? "bg-gray-700 border-gray-600 placeholder-gray-300 text-gray-100 focus:border-green-400 focus:ring-green-400"
      : "bg-white border-gray-300 placeholder-gray-500 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
  }`;

  return (
    <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-black"} min-h-screen`}>
      <Helmet>
        <title>Add Team Member</title>
        <meta name="description" content="Submit a new team member profile." />
      </Helmet>

      <HeroSection />

      <section className="max-w-3xl mx-auto p-6">
        <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? "text-green-400" : "text-blue-700"}`}>
          Add Team Member Info
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sarah Johnson"
            required
            inputClasses={inputClasses}
          />
          <InputField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
            required
            inputClasses={inputClasses}
          />
          <InputField
            name="experience"
            label="Experience (Years)"
            type="number"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 5"
            min="0"
            required
            inputClasses={inputClasses}
          />

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-xl cursor-pointer ${
                    formData.starRating >= star ? "text-yellow-400" : isDark ? "text-gray-600" : "text-gray-300"
                  } transition`}
                />
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-1">
              Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className={`${inputClasses} bg-white ${isDark ? "bg-gray-700 text-gray-100" : ""}`}
            >
              <option value="">Select a role</option>
              <option value="Web Developer">Web Developer</option>
              <option value="Web Designer">Web Designer</option>
              <option value="Service Manager">Service Manager</option>
              <option value="Tour Guide">Tour Guide</option>
              <option value="Photographer">Photographer</option>
              <option value="Travel Consultant">Travel Consultant</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief background or team role..."
              className={inputClasses}
              required
            />
          </div>

          {/* Photo URL with preview */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <div className="flex items-center gap-4">
              <img
                src={formData.photoUrl || "https://source.unsplash.com/60x60/?person"}
                alt="Preview"
                className="w-14 h-14 rounded border object-cover"
              />
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className={inputClasses}
                placeholder="https://example.com/photo.jpg"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                isDark ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50" : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const InputField = ({ name, label, value, onChange, placeholder, type = "text", min, required, inputClasses }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      required={required}
      className={inputClasses}
    />
  </div>
);

export default TeamForm;
