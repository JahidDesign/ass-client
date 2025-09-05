import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import AboutSection from "./AboutSection";
import HeroSection from "./AboutBanner";
import TravelAbout from "./abboutSubBannare";
import { ThemeContext } from "../context/ThemeContext"; // Adjust path
import AnimatedSection from "../components/secret/AnimatedSection";
const AboutUs = () => {
  const { theme } = useContext(ThemeContext);
  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textClass = theme === "dark" ? "text-gray-100" : "text-gray-900";

  return (
    <div className={`${bgClass} ${textClass} transition-colors duration-300`}>
      <Helmet>
        <title>About Us - Travel-Tours-Agency</title>
        <meta
          name="description"
          content="Learn more about our company, mission, and values."
        />
        <meta name="keywords" content="About Us, Company, Mission, Values" />
      </Helmet>

      {/* Hero Banner */}
      <HeroSection />
      <AnimatedSection>
      {/* About Section */}
      <AboutSection />
      {/* Additional Travel About / Sub Banner */}
      <TravelAbout />
      </AnimatedSection>
    </div>
  );
};

export default AboutUs;
