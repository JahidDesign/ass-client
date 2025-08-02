import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import AllPackages from '../pages/AllPackages';
import AddPackage from '../pages/AddPackage';
import FlightSeatBooking from '../pages/airticketsADD';
import TourBookingForm from '../pages/TourBookingForm';
import ManageMyPackages from '../pages/ManageMyPackages';
import MyBookings from '../pages/MyBookings';
import PackageDetails from '../pages/PackageDetails';
import AboutUs from '../pages/AboutUs';
import ContactSection from '../pages/contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import TeamForm from '../pages/TeamForm';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactSection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/404" element={<NotFound />} />

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
        path="/add-package"
        element={
          <PrivateRoute>
            <AddPackage />
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
        path="/package/:id"
        element={
          <PrivateRoute>
            <PackageDetails />
          </PrivateRoute>
        }
      />

      {/* Fallback for undefined routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
