import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './myBookBanner';
import MyBookingOur from './TourSummary';
import MyHotelsBookings from './HotelsBooked';
import { ThemeContext } from '../context/ThemeContext'; 

class MyBookings extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div className={theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'}>
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
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default MyBookings;
