import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { ThemeContext } from "../context/ThemeContext";

// Components
import TravelHeroBanner from "./homeBanner";
import Carousel from "./FlightSearchCard";
import PopularAirlines from "./PopularAirlines";
import ModernAirlineGallery from "./AnimatedAirlineGallery";
import AboutMe from "./AboutMe";
import HotelsCards from "./hotelsCards";
import Testimonials from "./Testimonials";
import ToursList from "./ToursList";
import WelcomePopup from "../components/WelcomePopup";
import AnimatedSection from "../components/secret/AnimatedSection";

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen transition-colors duration-500`}
    >
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

      {/* Hero Banner */}
      <TravelHeroBanner />
      <AnimatedSection>
        {/* Search Card */}
      
      {/* Popular Tours */}
      

        <div className="text-center mb-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Popular Tours in Sylhet – Most Loved by Our Travelers
          </h2>
          <p className="text-md md:text-lg text-gray-700 dark:text-gray-300">
            Explore Top-Rated Sylhet Tour Packages Featuring Ratargul, Jaflong,
            Lalakhal, Srimangal & More – Perfect for Nature Lovers, Families &
            Couples
          </p>
        </div>
        <ToursList />
      

      {/* Flight Search Carousel */}
     
        <Carousel />
      

      {/* Hotels Section */}
 
        <div className="text-center mt-10">
          <h2 className="text-3xl mt-2 md:text-4xl font-bold mb-2">
            Comfortable & Affordable Hotel Rooms in Sylhet
          </h2>
          <p className="text-md md:text-lg text-gray-700 dark:text-gray-300">
            Book Clean, Secure & Budget-Friendly Rooms with Easy Access to
            Sylhet’s Top Tourist Spots – Perfect for Families, Solo Travelers &
            Groups
          </p>
        </div>
        <HotelsCards />
    

      {/* About Section */}
     
        <AboutMe />
      </AnimatedSection>

      {/* Airlines Section */}
      <section className="">
        <PopularAirlines />
      </section>

      {/* Modern Airline Gallery */}
      <AnimatedSection>
        <ModernAirlineGallery />
      

      {/* Testimonials */}
     
        <Testimonials />
      </AnimatedSection>
    </div>
  );
};

export default Home;
