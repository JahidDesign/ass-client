import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeamMemberCard from "./TeamMemberCard";

const OurTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ass-server-1.onrender.com/teams") // Ensure this endpoint matches your server
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
    <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-700">👨‍💻 Meet Our Dream Team</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We’re a group of passionate professionals dedicated to delivering
            exceptional travel experiences and digital excellence.
          </p>
        </div>

        {/* Add Member Button */}
        <div className="flex justify-end mb-8">
          <Link
            to="/add-team"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
          >
            ➕ Add Member
          </Link>
        </div>

        {/* Team Members Content */}
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading team members...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">🚫 No team members found.</p>
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
