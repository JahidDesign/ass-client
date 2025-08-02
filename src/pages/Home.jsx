import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import TravelHeroBanner from './homeBanner';
import Carousel from './FlightSearchCard';
import PopularAirlines from './PopularAirlines';
import AnimatedAirlineGallery from './AnimatedAirlineGallery';
import ExclusiveOffer from './offerSection';
import HotelsCards from './hotelsCards';
import ToursList from './ToursList';

const Home = () => {
  useEffect(() => {
    const showWelcomePopup = async () => {
      try {
        
        const res = await fetch('https://ipapi.co/json');
        const data = await res.json();
        const ip = data.ip || 'unknown';

       
        const lastVisitKey = `lastVisit_${ip}`;
        const lastVisit = localStorage.getItem(lastVisitKey);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (!lastVisit || now - parseInt(lastVisit, 10) >= oneHour) {
          
          Swal.fire({
            title: `Welcome!`,
            text: `We're glad to have you back 🧳✨`,
            icon: 'info',
            confirmButtonText: 'Let’s Explore!',
            timer: 7000,
            timerProgressBar: true,
          });

          
          localStorage.setItem(lastVisitKey, now.toString());
        }
      } catch (error) {
        console.error("Failed to fetch IP or show welcome popup:", error);
      }
    };

    showWelcomePopup();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Home | Travel-Tours-Agency</title>
        <meta
          name="description"
          content="Welcome to our homepage! Discover amazing travel packages and start your journey today."
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://i.ibb.co/kVSHzqyf/Blue-and-Red-Travel-Tours-Agency-Logo.png"
        />
      </Helmet>

      <TravelHeroBanner />
      <ToursList />
      <Carousel />
      <div className="">
        <HotelsCards />
      </div>
      <div className="mb-30">
        <ExclusiveOffer />
      </div>
      <div className="">
        <PopularAirlines />
      </div>
      <div className="">
        <AnimatedAirlineGallery />
      </div>
    </div>
  );
};

export default Home;
