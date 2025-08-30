// src/pages/Home.jsx
import React, { useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import { ThemeContext } from "../context/ThemeContext";

// Sections
import TravelHeroBanner from "./homeBanner";
import Carousel from "./FlightSearchCard";
import PopularAirlines from "./PopularAirlines";
import AnimatedAirlineGallery from "./AnimatedAirlineGallery";
import ExclusiveOffer from "./offerSection";
import HotelsCards from "./hotelsCards";
import ToursList from "./ToursList";

const Home = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const showWelcomePopup = async () => {
      try {
        // Get IP for unique visit tracking
        const res = await fetch("https://ipapi.co/json");
        const data = await res.json();
        const ip = data.ip || "unknown";

        const lastVisitKey = `lastVisit_${ip}`;
        const lastVisit = localStorage.getItem(lastVisitKey);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour

        // Show popup if first visit or more than 1 hour since last
        if (!lastVisit || now - parseInt(lastVisit, 10) >= oneHour) {
          Swal.fire({
            title: "Welcome!",
            text: "We're glad to have you back 🧳✨",
            icon: "info",
            confirmButtonText: "Let’s Explore!",
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
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* SEO & Metadata */}
      <Helmet>
        <title>Home | Travel Tours Agency</title>
        <meta
          name="description"
          content="Welcome to our homepage! Discover amazing travel and tour packages. Find flights, hotels, exclusive offers, and explore popular airlines."
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://i.ibb.co/kVSHzqyf/Blue-and-Red-Travel-Tours-Agency-Logo.png"
        />

        {/* Open Graph Meta (Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content="Home | Travel Tours Agency" />
        <meta
          property="og:description"
          content="Discover amazing travel packages and start your journey today."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/kVSHzqyf/Blue-and-Red-Travel-Tours-Agency-Logo.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />

        {/* Twitter Card Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Travel Tours Agency" />
        <meta name="twitter:description" content="Plan your next adventure with us!" />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/kVSHzqyf/Blue-and-Red-Travel-Tours-Agency-Logo.png"
        />
      </Helmet>

      {/* Sections */}
      <TravelHeroBanner />

      <section className="my-10">
        <ToursList />
      </section>

      <section className="my-10">
        <Carousel />
      </section>

      <section className="my-10">
        <HotelsCards />
      </section>

      <section className="my-10">
        <ExclusiveOffer />
      </section>

      <section className="my-10">
        <PopularAirlines />
      </section>

      <section className="my-10">
        <AnimatedAirlineGallery />
      </section>
    </div>
  );
};

export default Home;
