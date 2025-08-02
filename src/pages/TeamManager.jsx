import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext"; // Adjust path as needed

const defaultForm = {
  name: "",
  title: "",
  position: "",
  description: "",
  experience: 0,
  photoUrl: "",
  starRating: 0,
};

const ADMIN_EMAILS = ["jhadam904@gmail.com"]; 
const TeamManager = () => {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const { user } = useContext(AuthContext); 
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/teams")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Failed to fetch members:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      return Swal.fire("Access Denied", "Only admins can delete team members.", "warning");
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This member will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`https://ass-server-1.onrender.com/teams/${id}`, { method: "DELETE" });
        setMembers((prev) => prev.filter((m) => m._id !== id));
        Swal.fire("Deleted!", "Team member has been removed.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete member.", "error");
      }
    }
  };

  const startEdit = (member) => {
    setFormData(member);
    setEditing(member._id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" || name === "starRating" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://ass-server-1.onrender.com/teams/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      setMembers((prev) =>
        prev.map((m) => (m._id === editing ? { ...formData, _id: editing } : m))
      );
      Swal.fire("Updated!", "Team member updated successfully.", "success");
      setEditing(null);
      setFormData(defaultForm);
    } catch (err) {
      Swal.fire("Error", "Failed to update member.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Team Management</h1>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Photo</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Position</th>
              <th className="p-3 border">Experience</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="p-3 border">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="p-3 border">{member.name}</td>
                <td className="p-3 border">{member.title}</td>
                <td className="p-3 border">{member.position}</td>
                <td className="p-3 border text-center">{member.experience} yr</td>
                <td className="p-3 border text-center">{member.starRating} ⭐</td>
                <td className="p-3 border text-sm text-gray-600">{member.description}</td>
                <td className="p-3 border text-center space-x-2">
                  <button
                    onClick={() => startEdit(member)}
                    className="px-3 py-1 bg-yellow-300 mb-2 text-black rounded hover:bg-yellow-400"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Edit Team Member</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Experience (years)"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Photo URL"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="starRating"
              type="number"
              min="0"
              max="5"
              value={formData.starRating}
              onChange={handleChange}
              placeholder="Star Rating"
              className="p-2 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="p-2 border border-gray-300 rounded col-span-full"
              required
            />
            <div className="flex gap-2 col-span-full">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormData(defaultForm);
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
