import React from 'react';
import ChartContainer from './chart-container';
import axios from 'axios';
import {getCurrentUser} from "@/lib/session";

const PollResults = async () => {

  const user = await getCurrentUser()
    const storedPercentage = await axios.get(`/api/users/${user.id}/poll-results`)
  return (
      <div>
        {storedPercentage && <ChartContainer warPercentageDesired={parseFloat(storedPercentage)}/>}
      </div>
  );
};

export default PollResults;