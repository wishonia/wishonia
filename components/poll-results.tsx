import React, { useState } from 'react';
import ChartContainer from './chart-container';
import axios from 'axios';
import Cookies from "js-cookie";

const PollResults = () => {

  // Retrieve warPercentageDesired from localStorage
  const storedPercentage = Cookies.get('warPercentageDesired');
  if (storedPercentage) {

    // Provide warPercentageDesired to the ChartContainer component
    // This part is assumed to be handled within the JSX below by passing warPercentageDesired as a prop

    // Post warPercentageDesired to the vote API route
    axios.post('/vote', {warPercentageDesired: storedPercentage})
        .then(response => console.log(response))
        .catch(error => console.error(error));
  }
  return (
    <div>
      {storedPercentage && <ChartContainer warPercentageDesired={parseFloat(storedPercentage)} />}
    </div>
  );
};

export default PollResults;