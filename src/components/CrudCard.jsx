import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";

export default function CrudCard({ item, onView, onEdit, onDelete, onAdd }) {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      className={`rounded-2xl shadow-lg overflow-hidden transition hover:shadow-2xl ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      whileHover={{ scale: 1.03 }}
    >
      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={item.photo || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={item.title || "Item"}
          className="h-full w-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-48">
        <h2 className="text-lg font-bold truncate mb-2">{item.title || "Untitled"}</h2>
        <p
          className={`text-sm flex-1 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {item.description || "No description available."}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-3 gap-2">
          {onView && (
            <button
              onClick={() => onView(item)}
              className="flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaEye className="mr-1" /> View
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
            >
              <FaEdit className="mr-1" /> Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
            >
              <FaTrash className="mr-1" /> Delete
            </button>
          )}
          {onAdd && (
            <button
              onClick={() => onAdd(item)}
              className="flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
            >
              <FaPlus className="mr-1" /> Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
