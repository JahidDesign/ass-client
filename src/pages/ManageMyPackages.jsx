import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ManageHotelPackages from'./ManageHotels';
import ManageTourBookings from'./ManageTourBookings';
import HeroSection from './ManageBanner';
import TeamManager from './TeamManager';
class ManageMyPackages extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Manage My Packages - Travel-Tours-Agency</title>
          <meta
            name="description"
            content="Manage and update your travel packages easily on our platform."
          />
          <meta name="keywords" content="manage packages, travel, booking, update packages" />
        </Helmet>
       <HeroSection />
        <ManageTourBookings />
        <ManageHotelPackages />
        <TeamManager />
      </div>
    );
  }
}

export default ManageMyPackages;
