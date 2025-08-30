import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext"; 
import { ThemeContext } from "../context/ThemeContext";

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
  const { user } = useContext(AuthContext); 
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

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

  const tableClass = `min-w-full border rounded ${
    isDark ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-black border-gray-300"
  }`;
  const thClass = `p-3 border ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-100"}`;
  const tdClass = `p-3 border ${isDark ? "border-gray-600" : "border-gray-300"}`;

  const inputClass = `p-2 border rounded w-full transition ${
    isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-black"
  }`;

  const buttonClass = (color) =>
    `px-6 py-2 rounded font-semibold transition ${
      isDark ? `bg-${color}-600 hover:bg-${color}-700 text-white` : `bg-${color}-600 hover:bg-${color}-700 text-white`
    }`;

  return (
    <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-black"} max-w-7xl mx-auto px-4 py-10 min-h-screen`}>
      <h1 className="text-4xl font-bold mb-8 text-center">Team Management</h1>

      <div className="overflow-x-auto mb-10">
        <table className={tableClass}>
          <thead className={isDark ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className={thClass}>Photo</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Title</th>
              <th className={thClass}>Position</th>
              <th className={thClass}>Experience</th>
              <th className={thClass}>Rating</th>
              <th className={thClass}>Description</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                <td className={tdClass}>
                  <img src={member.photoUrl} alt={member.name} className="w-12 h-12 object-cover rounded-full" />
                </td>
                <td className={tdClass}>{member.name}</td>
                <td className={tdClass}>{member.title}</td>
                <td className={tdClass}>{member.position}</td>
                <td className={`${tdClass} text-center`}>{member.experience} yr</td>
                <td className={`${tdClass} text-center`}>{member.starRating} ⭐</td>
                <td className={`${tdClass} text-sm`}>{member.description}</td>
                <td className={`${tdClass} text-center space-x-2`}>
                  <button onClick={() => startEdit(member)} className="px-3 py-1 bg-yellow-300 mb-2 text-black rounded hover:bg-yellow-400">
                    Edit
                  </button>
                  {isAdmin && (
                    <button onClick={() => handleDelete(member._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
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
        <div className={`p-6 rounded-lg shadow-md border ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}>
          <h2 className="text-2xl font-semibold mb-4">Edit Team Member</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={inputClass} required />
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className={inputClass} required />
            <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" className={inputClass} required />
            <input name="experience" type="number" min="0" value={formData.experience} onChange={handleChange} placeholder="Experience (years)" className={inputClass} />
            <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Photo URL" className={inputClass} required />
            <input name="starRating" type="number" min="0" max="5" value={formData.starRating} onChange={handleChange} placeholder="Star Rating" className={inputClass} />
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Description" className={`${inputClass} col-span-full`} required />
            <div className="flex gap-2 col-span-full">
              <button type="submit" className={buttonClass("green")}>
                Update
              </button>
              <button type="button" onClick={() => { setEditing(null); setFormData(defaultForm); }} className={buttonClass("gray")}>
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
