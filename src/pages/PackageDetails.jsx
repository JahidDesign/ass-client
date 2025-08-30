import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { ThemeContext } from "../context/ThemeContext";

class PackageDetails extends Component {
  static contextType = ThemeContext;

  render() {
    const { theme } = this.context;
    const isDark = theme === "dark";

    return (
      <div className={isDark ? "bg-gray-900 text-gray-100 min-h-screen" : "bg-white text-black min-h-screen"}>
        <Helmet>
          <title>Package Details - Travel-Tours-Agency</title>
          <meta
            name="description"
            content="Explore detailed information about our travel packages tailored for you."
          />
          <meta
            name="keywords"
            content="package details, travel, tour packages, trip info"
          />
        </Helmet>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Package Details</h1>
          <p className="text-gray-500">
            Here you can explore detailed information about our travel packages, itineraries, pricing, and special features.
          </p>
        </div>
      </div>
    );
  }
}

export default PackageDetails;
