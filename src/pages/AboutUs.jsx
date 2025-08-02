import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import AboutSection from'./AboutSection';
import HeroSection from'./AboutBanner';
import TravelAbout from'./abboutSubBannare';
class AboutUs extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>About Us - Travel-Tours-Agency</title>
          <meta name="description" content="Learn more about our company, mission, and values." />
          <meta name="keywords" content="About Us, Company, Mission, Values" />
          
        </Helmet>
        
        <HeroSection />
        <AboutSection />
        <TravelAbout />
      </div>
    );
  }
}

export default AboutUs;
