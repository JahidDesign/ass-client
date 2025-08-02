import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
// import MyBooked from'./MyBooked';
import HeroSection from'./myBookBanner';
import MyBookingOur from './TourSummary';
import MyHotelsBookings from './HotelsBooked';
class MyBookings extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>My Bookings - Travel-Tours-Agency</title>
          <meta
            name="description"
            content="View and manage your bookings easily on our platform."
          />
          <meta name="keywords" content="my bookings, travel bookings, manage bookings" />
        </Helmet>
          <HeroSection />
     
          <MyBookingOur />
        <MyHotelsBookings />
      
      </div>
    );
  }
}

export default MyBookings;
