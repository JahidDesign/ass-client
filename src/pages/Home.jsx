import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { ThemeContext } from "../context/ThemeContext";

// Sections
import TravelHeroBanner from "./homeBanner";
import Carousel from "./FlightSearchCard";
import PopularAirlines from "./PopularAirlines";
import AnimatedAirlineGallery from "./AnimatedAirlineGallery";
import AboutMe from "./AboutMe";
import HotelsCards from "./hotelsCards";
import Testimonials from "./Testimonials";
import ToursList from "./ToursList";
import WelcomePopup from "../components/WelcomePopup"; // Import the new popup

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      } min-h-screen transition-colors duration-500`}
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
      </Helmet>

      {/* Modern Welcome Popup */}
      <WelcomePopup />

      {/* Main Sections */}
      <TravelHeroBanner />

        <section
      className={`my-10 px-5 md:px-10 py-8 rounded-xl shadow-lg transition-colors duration-300 ${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Popular Tours in Sylhet – Most Loved by Our Travelers
        </h2>
        <p className="text-md md:text-lg text-gray-500 dark:text-gray-300">
          Explore Top-Rated Sylhet Tour Packages Featuring Ratargul, Jaflong, Lalakhal, Srimangal & More – Perfect for Nature Lovers, Families & Couples
        </p>
      </div>

      <ToursList />
    </section>

      <section className="my-10">
        <Carousel />
      </section>

       <section
      className={`my-10 px-5 md:px-10 py-8 rounded-xl shadow-lg transition-colors duration-300 ${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Comfortable & Affordable Hotel Rooms in Sylhet
        </h2>
        <p className="text-md md:text-lg text-gray-500 dark:text-gray-300">
          Book Clean, Secure & Budget-Friendly Rooms with Easy Access to Sylhet’s Top Tourist Spots – Perfect for Families, Solo Travelers & Groups
        </p>
      </div>

      <HotelsCards />
    </section>
      <section className="my-10">
        <AboutMe />
      </section>

      <section className="my-10">
        <PopularAirlines />
      </section>

      <section className="my-10">
        <AnimatedAirlineGallery />
      </section>
      
       <section className="my-10">
        <Testimonials />
      </section>
    </div>
  );
};

export default Home;
