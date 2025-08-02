import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import HeroSection from "./FromBanner"; // ✅ make sure path is correct

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

  return (
    <div className="min-h-screen bg-white text-black">
      <Helmet>
        <title>Add Team Member</title>
        <meta name="description" content="Submit a new team member profile." />
      </Helmet>

      <HeroSection />

      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
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
          />
          <InputField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
            required
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
                    formData.starRating >= star ? "text-yellow-400" : "text-gray-300"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white"
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
              className="w-full px-4 py-2 border rounded-md text-black"
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
                className="w-full px-4 py-2 border rounded-md text-black"
                placeholder="https://example.com/photo.jpg"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const InputField = ({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  min,
  required,
}) => (
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
      className="w-full px-4 py-2 border rounded-md text-black"
    />
  </div>
);

export default TeamForm;
