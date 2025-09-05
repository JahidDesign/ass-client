import React, { Component, useContext } from "react";
import { Helmet } from "react-helmet";
import HeroSection from "./allPackageBanner";
import AllTours from "./AllTours";
import AllHotelsPage from "./AllHotelsPage";
import MyFlightBookings from "./MyFlightBookings";
import { ThemeContext } from "../context/ThemeContext";
import AnimatedSection from "../components/secret/AnimatedSection"; // Import AnimatedSection

// HOC to inject ThemeContext
function withTheme(Component) {
  return function WrappedComponent(props) {
    const themeContext = useContext(ThemeContext);
    return <Component {...props} theme={themeContext} />;
  };
}

class AllPackages extends Component {
  render() {
    const { theme } = this.props;

    return (
      <div className={theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}>
        <Helmet>
          <title>All Packages - Travel-Tours-Agency</title>
          <meta
            name="description"
            content="Explore all the amazing packages we offer for your perfect getaway."
          />
          <meta name="keywords" content="packages, travel, deals, offers" />
        </Helmet>

        {/* Hero Section */}
        <HeroSection />
        {/* Tours Section */}
        <AnimatedSection>
          <AllTours />
        {/* Hotels Section */}
          <AllHotelsPage />
        {/* Flight Bookings Section */}
          <MyFlightBookings />
        </AnimatedSection>
      </div>
    );
  }
}

export default withTheme(AllPackages);
