// src/pages/AllTours.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaSearch, FaFilter } from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Accessibility

const AllTours = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedTours, setBookedTours] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTour, setModalTour] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 6;

  // Fetch tours
  useEffect(() => {
    fetch("https://ass-server-sy-travles.onrender.com/tours")
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tours:", err);
        setLoading(false);
      });
  }, []);

  // Load booked tours
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("bookedTours")) || [];
    setBookedTours(existing);
  }, [user]);

  // Search & filter
  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.selectedPackage
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesEmail = filterEmail
      ? bookedTours.some(
          (b) =>
            b._id === tour._id &&
            b.userEmail.toLowerCase().includes(filterEmail.toLowerCase())
        )
      : true;
    return matchesSearch && matchesEmail;
  });

  // Pagination
  const indexOfLast = currentPage * toursPerPage;
  const indexOfFirst = indexOfLast - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  // Open booking modal
  const openBookingModal = (tour) => {
    if (!user) {
      return Swal.fire("Please sign in first!", "", "info");
    }
    setModalTour(tour);
    setModalOpen(true);
  };

  const handleBookTour = (tour, email, name) => {
    const bookedData = {
      ...tour,
      bookedAt: new Date().toISOString(),
      userEmail: email,
      userName: name,
      userPhoto: user?.photoURL || "https://source.unsplash.com/100x100/?person",
    };

    const updated = [...bookedTours, bookedData];
    localStorage.setItem("bookedTours", JSON.stringify(updated));
    setBookedTours(updated);

    Swal.fire("Booked!", "Your tour has been added to your bookings.", "success");
    setModalOpen(false);
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading all tours...</div>;

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-yellow-700 mb-6 text-center">
          All Tour Packages
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by package name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Filter by user email..."
              value={filterEmail}
              onChange={(e) => {
                setFilterEmail(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
            <FaFilter className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTours.map((tour) => {
            const isBooked =
              bookedTours.find(
                (b) => b._id === tour._id && b.userEmail === user?.email
              ) !== undefined;

            return (
              <div
                key={tour._id}
                className={`rounded-lg border shadow hover:shadow-lg p-4 flex flex-col ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
                }`}
              >
                <img
                  src={tour.photo}
                  alt="Tour"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-1 capitalize">{tour.selectedPackage} Package</h3>
                  <p className="text-sm mb-2">Pickup: {tour.pickupLocation}</p>
                  <p className="text-sm mb-2">Travel: {tour.travelDate} → {tour.returnDate}</p>
                  <p className="text-yellow-600 font-bold text-lg mb-2">${tour.totalPrice}</p>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-3 whitespace-pre-line">{tour.specialRequests}</p>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate(`/tours/${tour._id}`)}
                    className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                  >
                    View Details
                  </button>

                  {/* <button
                    onClick={() => openBookingModal(tour)}
                    disabled={isBooked}
                    className={`flex-1 py-2 px-4 rounded transition ${
                      isBooked
                        ? "bg-green-600 text-white cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isBooked ? "Booked" : "Book Now"}
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Book Tour: {modalTour?.selectedPackage}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const name = e.target.name.value;
            handleBookTour(modalTour, email, name);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              defaultValue={user?.displayName || ""}
              required
              className="w-full px-4 py-2 rounded-md border text-black"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user?.email || ""}
              required
              className="w-full px-4 py-2 rounded-md border text-black"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllTours;
