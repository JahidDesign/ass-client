import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import TeamMemberCard from "./TeamMemberCard";
import { ThemeContext } from "../context/ThemeContext"; 

const OurTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext); 

  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/teams")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load team members:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section
      className={`py-16 min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-5xl font-bold ${
              theme === "dark" ? "text-yellow-400" : "text-blue-700"
            }`}
          >
            👨‍💻 Meet Our Dream Team
          </h1>
          <p
            className={`mt-3 max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            We’re a group of passionate professionals dedicated to delivering
            exceptional travel experiences and digital excellence.
          </p>
        </div>

        {/* Add Member Button */}
        <div className="flex justify-end mb-8">
          <Link
            to="/add-team"
            className={`font-semibold px-6 py-2 rounded-full shadow transition ${
              theme === "dark"
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            ➕ Add Member
          </Link>
        </div>

        {/* Team Members Content */}
        {loading ? (
          <p className="text-center text-lg text-gray-500">
            Loading team members...
          </p>
        ) : members.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            🚫 No team members found.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {members.map((member) => (
              <TeamMemberCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeam;
