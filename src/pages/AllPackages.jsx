import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './allPackageBanner'
import AllTours from'./AllTours';
import AllHotelsPage from'./AllHotelsPage';
import MyFlightBookings from'./MyFlightBookings';
class AllPackages extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>All Packages - Travel-Tours-Agency</title>
          <meta
            name="description"
            content="Explore all the amazing packages we offer for your perfect getaway."
          />
          <meta name="keywords" content="packages, travel, deals, offers" />
        </Helmet>
          <HeroSection/>
          <AllTours />
          <AllHotelsPage />
          <MyFlightBookings />
      </div>
    );
  }
}

export default AllPackages;
