import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const MyBooked = () => {
  const [booked, setBooked] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("myBookedTour");
    if (saved) {
      setBooked(JSON.parse(saved));
    }
  }, []);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove your booking from local storage.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("myBookedTour");
        setBooked(null);
        Swal.fire("Deleted!", "Your booking has been removed.", "success");
      }
    });
  };

  if (!booked) {
    return <div className="text-center py-10">No tour booked yet.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-700 mb-6">My Booked Tour</h2>
      <div className="bg-white text-black rounded-lg shadow p-6 border flex flex-col md:flex-row gap-6">
        {/* Left: Image */}
        <img
          src={booked.photo}
          alt="Tour"
          className="w-full md:w-1/2 h-72 object-cover rounded-lg border"
        />

        {/* Right: Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-2 capitalize">
            {booked.selectedPackage} Package
          </h3>
          <p><strong>Pickup:</strong> {booked.pickupLocation}</p>
          <p><strong>Travel:</strong> {booked.travelDate} → {booked.returnDate}</p>
          <p><strong>Price:</strong> ${booked.totalPrice}</p>
          <p className="whitespace-pre-line mt-2">
            <strong>Requests:</strong><br />{booked.specialRequests}
          </p>

          {/* Map */}
          {booked.mapUrl && (
            <iframe
              src={booked.mapUrl}
              className="w-full h-48 mt-4 border rounded"
              allowFullScreen
              loading="lazy"
              title="Map"
            />
          )}

          {/* User Info */}
          {booked.bookedBy && (
            <div className="mt-6 flex items-center gap-4 border-t pt-4">
              <img
                src={booked.bookedBy.photoURL}
                alt="User"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold">{booked.bookedBy.name}</p>
                <p className="text-sm text-gray-600">{booked.bookedBy.email}</p>
              </div>
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBooked;
