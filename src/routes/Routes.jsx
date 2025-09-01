// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Home from "../pages/Home";
import AllPackages from "../pages/AllPackages";
import AddPackage from "../pages/AddPackage";
import FlightSeatBooking from "../pages/airticketsADD";
import TourBookingForm from "../pages/TourBookingForm";
import ManageMyPackages from "../pages/ManageMyPackages";
import MyBookings from "../pages/MyBookings";
import MyAllBookings from "../pages/MyAllBookings";
import TourDetails from "../pages/TourDetails";
import HotelDetails from "../pages/HotelDetails";
import PackageDetails from "../pages/PackageDetails";
import AboutUs from "../pages/AboutUs";
import ContactSection from "../pages/contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import TeamForm from "../pages/TeamForm";
import CustomersPage from "../pages/subpages/CustomersPage";
import HotelsPage from "../pages/subpages/HotelsPage";
import ToursPage from "../pages/subpages/ToursPage";
import FlightsPage from "../pages/subpages/FlightsPage";

// Route protection
import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => {
  const location = useLocation();

  // Page animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <AboutUs />
            </motion.div>
          }
        />
        <Route
          path="/contact"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <ContactSection />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Register />
            </motion.div>
          }
        />

        {/* Dynamic ID-based Pages */}
        <Route
          path="/customers/:id"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <CustomersPage />
            </motion.div>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <HotelsPage />
            </motion.div>
          }
        />
        <Route
          path="/tours/:id"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <ToursPage />
            </motion.div>
          }
        />
        <Route
          path="/flights/:id"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <FlightsPage />
            </motion.div>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <Profile />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/all-packages"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <AllPackages />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-package"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <AddPackage />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/TourBooking"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <TourBookingForm />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-air-packages"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <FlightSeatBooking />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-my-packages"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <ManageMyPackages />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <MyBookings />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/myallbookings"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <MyAllBookings />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/package/:id"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <PackageDetails />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-team"
          element={
            <PrivateRoute>
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <TeamForm />
              </motion.div>
            </PrivateRoute>
          }
        />

        {/* Catch All */}
        <Route
          path="*"
          element={
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
