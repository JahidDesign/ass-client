import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class PackageDetails extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Package Details - Travel-Tours-Agency</title>
          <meta
            name="description"
            content="Explore detailed information about our travel packages tailored for you."
          />
          <meta name="keywords" content="package details, travel, tour packages, trip info" />
        </Helmet>

        <h1>Package Details</h1>
      </div>
    );
  }
}

export default PackageDetails;
