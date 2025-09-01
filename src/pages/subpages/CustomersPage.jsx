// src/pages/CustomersPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const CustomersPage = () => {
  const { theme } = useContext(ThemeContext);
  const [customers, setCustomers] = useState([]);

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("https://ass-server-sy-travles.onrender.com/customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {customers.map((customer) => (
        <div
          key={customer._id}
          id={`customer-${customer._id}`}
          className={`rounded-2xl shadow-lg overflow-hidden border transition hover:scale-105 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          {/* Customer Photo */}
          <img
            src={customer.photo || "/default-avatar.png"}
            alt={customer.name}
            className="w-full h-40 object-cover rounded-t-2xl"
          />

          {/* Customer Info */}
          <div className="p-4">
            <h3 className="font-bold text-lg">{customer.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{customer.email}</p>
            <p className="text-sm mt-2">
              <span className="font-semibold">Role:</span> {customer.role}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Status:</span> {customer.status}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Joined: {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomersPage;
