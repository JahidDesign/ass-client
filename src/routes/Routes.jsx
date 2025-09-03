// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import ContactSection from "../pages/contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import AllPackages from "../pages/AllPackages";
import AddPackage from "../pages/AddPackage";
import TourBookingForm from "../pages/TourBookingForm";
import FlightSeatBooking from "../pages/airticketsADD";
import ManageMyPackages from "../pages/ManageMyPackages";
import MyBookings from "../pages/MyBookings";
import MyAllBookings from "../pages/MyAllBookings";
import PackageDetails from "../pages/PackageDetails";
import TeamForm from "../pages/TeamForm";
import CustomersPage from "../pages/subpages/CustomersPage";
import HotelsPage from "../pages/subpages/HotelsPage";
import ToursPage from "../pages/subpages/ToursPage";
import FlightsPage from "../pages/subpages/FlightsPage";
import TourDetails from "../pages/TourDetails";
import HotelDetails from "../pages/HotelDetails";
import NotFound from "../pages/NotFound";

// Route protection
import PrivateRoute from "../components/PrivateRoute";

// Motion configs
const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.4 };

const MotionWrapper = ({ children }) => (
  <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
    {children}
  </motion.div>
);

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<MotionWrapper><Home /></MotionWrapper>} />
        <Route path="/about" element={<MotionWrapper><AboutUs /></MotionWrapper>} />
        <Route path="/contact" element={<MotionWrapper><ContactSection /></MotionWrapper>} />
        <Route path="/login" element={<MotionWrapper><Login /></MotionWrapper>} />
        <Route path="/register" element={<MotionWrapper><Register /></MotionWrapper>} />

        {/* Dynamic ID-based Pages */}
        <Route path="/customers/:id" element={<MotionWrapper><CustomersPage /></MotionWrapper>} />
        <Route path="/hotels/:id" element={ <MotionWrapper> <HotelDetails> <HotelsPage /></HotelDetails> </MotionWrapper>}/>
        <Route path="/tours/:id" element={ <MotionWrapper> <TourDetails> <ToursPage /></TourDetails> </MotionWrapper>}/>
        <Route path="/flights/:id" element={<MotionWrapper><FlightsPage /></MotionWrapper>} />

        {/* Protected Routes */}
        <Route path="/profile" element={<PrivateRoute><MotionWrapper><Profile /></MotionWrapper></PrivateRoute>} />
        <Route path="/all-packages" element={<PrivateRoute><MotionWrapper><AllPackages /></MotionWrapper></PrivateRoute>} />
        <Route path="/add-package" element={<PrivateRoute><MotionWrapper><AddPackage /></MotionWrapper></PrivateRoute>} />
        <Route path="/TourBooking" element={<PrivateRoute><MotionWrapper><TourBookingForm /></MotionWrapper></PrivateRoute>} />
        <Route path="/add-air-packages" element={<PrivateRoute><MotionWrapper><FlightSeatBooking /></MotionWrapper></PrivateRoute>} />
        <Route path="/manage-my-packages" element={<PrivateRoute><MotionWrapper><ManageMyPackages /></MotionWrapper></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MotionWrapper><MyBookings /></MotionWrapper></PrivateRoute>} />
        <Route path="/myallbookings" element={<PrivateRoute><MotionWrapper><MyAllBookings /></MotionWrapper></PrivateRoute>} />
        <Route path="/package/:id" element={<PrivateRoute><MotionWrapper><PackageDetails /></MotionWrapper></PrivateRoute>} />
        <Route path="/add-team" element={<PrivateRoute><MotionWrapper><TeamForm /></MotionWrapper></PrivateRoute>} />

        {/* Catch All */}
        <Route path="*" element={<MotionWrapper><NotFound /></MotionWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}
