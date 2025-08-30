// src/pages/AllDataViewer.jsx
import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaCopy } from "react-icons/fa";

export default function AllDataViewer() {
  const { theme } = useContext(ThemeContext);
  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, hRes, tRes, fRes] = await Promise.all([
          fetch("https://ass-server-1.onrender.com/customers"),
          fetch("https://ass-server-1.onrender.com/hotels"),
          fetch("https://ass-server-1.onrender.com/tours"),
          fetch("https://ass-server-1.onrender.com/flights"),
        ]);

        const [cData, hData, tData, fData] = await Promise.all([
          cRes.json(),
          hRes.json(),
          tRes.json(),
          fRes.json(),
        ]);

        setCustomers(cData);
        setHotels(hData);
        setTours(tData);
        setFlights(fData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-700 dark:text-gray-200">Loading all data...</p>;

  // Copy JSON to clipboard
  const copyToClipboard = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    alert("JSON copied!");
  };

  // Filter function: match any field OR exact _id
  const filterData = (data) =>
    data.filter((item) => {
      const q = search.toLowerCase();
      const matchField = Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(q)
      );
      const matchId = item._id?.toString() === q;
      return matchField || matchId;
    });

  // Recursive renderer for JSON
  const renderField = (key, value, level = 0) => {
    if (value === null || value === undefined) return null;

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <div className={`pl-${level * 4} border-l border-gray-300 dark:border-gray-600 my-1`}>
            <strong>{key}:</strong>
            <ul className="list-disc ml-5">
              {value.map((v, i) => (
                <li key={i}>{typeof v === "object" ? JSON.stringify(v) : v.toString()}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        return (
          <div className={`pl-${level * 4} border-l border-gray-300 dark:border-gray-600 my-1`}>
            <strong>{key}:</strong>
            <div className="ml-3">
              {Object.entries(value).map(([k, v]) => renderField(k, v, level + 1))}
            </div>
          </div>
        );
      }
    }

    // Detect image URLs
    if (
      typeof value === "string" &&
      value.startsWith("http") &&
      (value.includes(".jpg") || value.includes(".png") || value.includes("unsplash"))
    ) {
      return (
        <div className="my-1">
          <strong>{key}:</strong>
          <img src={value} alt={key} className="mt-1 w-full max-w-xs rounded shadow" />
        </div>
      );
    }

    return (
      <p className="my-1">
        <strong>{key}:</strong> {value.toString()}
      </p>
    );
  };

  // Render collection section
  const renderCollection = (name, data) => {
    const filtered = filterData(data);
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          {name} ({filtered.length})
        </h2>
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 mb-3 bg-gray-50 dark:bg-gray-700 shadow-sm break-words relative"
          >
            <button
              onClick={() => copyToClipboard(item)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-blue-500"
              title="Copy JSON"
            >
              <FaCopy />
            </button>
            {Object.entries(item).map(([key, value]) => renderField(key, value))}
          </div>
        ))}
      </section>
    );
  };

  return (
    <div
      className={
        theme === "dark"
          ? "dark bg-gray-900 text-gray-100 min-h-screen"
          : "bg-gray-50 text-gray-900 min-h-screen"
      }
    >
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-yellow-400">
          All JSON Data Viewer
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by any field or exact ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black dark:text-gray-900"
          />
        </div>

        {renderCollection("Customers", customers)}
        {renderCollection("Hotels", hotels)}
        {renderCollection("Tours", tours)}
        {renderCollection("Flights", flights)}
      </div>
    </div>
  );
}
