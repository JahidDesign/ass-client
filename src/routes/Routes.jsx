// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

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
//  import AllDataViewer from "./pages/AllDataViewer";
// Route protection
import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactSection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="*" element={<NotFound />} />
       {/* <Route path="/all-data" element={<AllDataViewer />} /> */}

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/all-packages"
        element={
          <PrivateRoute>
            <AllPackages />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-package"
        element={
          <PrivateRoute>
            <AddPackage />
          </PrivateRoute>
        }
      />
      <Route
        path="/TourBooking"
        element={
          <PrivateRoute>
            <TourBookingForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-air-packages"
        element={
          <PrivateRoute>
            <FlightSeatBooking />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-my-packages"
        element={
          <PrivateRoute>
            <ManageMyPackages />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        }
      />
      <Route
        path="/myallbookings"
        element={
          <PrivateRoute>
            <MyAllBookings />
          </PrivateRoute>
        }
      />
      <Route
        path="/package/:id"
        element={
          <PrivateRoute>
            <PackageDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-team"
        element={
          <PrivateRoute>
            <TeamForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
