import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const TeamMemberCard = ({ member }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const {
    name = "Unnamed",
    photoUrl = "https://source.unsplash.com/100x100/?person",
    title = "No Title",
    position = "No Position",
    description = "No description provided.",
    experience = 0,
    starRating = 0,
  } = member;

  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardShadow = isDark ? "shadow-md hover:shadow-lg" : "shadow-lg hover:shadow-2xl";
  const titleColor = isDark ? "text-blue-300" : "text-blue-700";
  const subtitleColor = isDark ? "text-blue-200" : "text-blue-700";
  const textColor = isDark ? "text-gray-200" : "text-gray-700";
  const descColor = isDark ? "text-gray-400" : "text-gray-700";
  const gradientOverlay = isDark ? "from-black/80" : "from-black/60";

  return (
    <div
      className={`${cardBg} rounded-2xl ${cardShadow} transition-shadow duration-300 w-80 max-w-full overflow-hidden group`}
    >
      <div className="relative">
        <img src={photoUrl} alt={name} className="w-full h-52 object-cover" />
        <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${gradientOverlay} to-transparent px-4 py-2`}>
          <h3 className="text-lg font-bold text-white truncate">{name}</h3>
          <p className="text-sm">{position}</p>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className={`text-sm font-medium mb-1 ${titleColor}`}>{title}</p>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i <= starRating ? "text-yellow-400" : isDark ? "text-gray-600" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.782.57-1.838-.197-1.538-1.118l1.286-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
            </svg>
          ))}
        </div>

        <p className={`text-xs italic mb-3 ${textColor}`}>
          {experience} year{experience !== 1 ? "s" : ""} of experience
        </p>

        <p className={`text-sm leading-relaxed line-clamp-4 ${descColor}`}>{description}</p>
      </div>
    </div>
  );
};

export default TeamMemberCard;
