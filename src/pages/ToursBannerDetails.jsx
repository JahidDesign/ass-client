import React from "react";

const ToursBanner = () => {
  const handleExploreClick = () => {
    alert("Explore Tours clicked!");
  };

  return (
    <div
      className="w-full h-40 md:h-48 relative flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative text-center text-white px-4">
        <h1 className="text-lg md:text-2xl font-bold mb-1">
          Discover Amazing Tours
        </h1>
        <p className="text-sm md:text-lg mb-2">
          Explore top destinations with us.
        </p>
        <button
          onClick={handleExploreClick}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-1 px-4 rounded text-sm md:text-base"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default ToursBanner;
