import React from 'react';
import PollPage from '../components/PollPage';

const PollPageContainer: React.FC = () => {
  return (
      <PollPage
          question="How much do you think governments
          <br>ACTUALLY SPENDS<br>
          on war, nuclear bombs, autonomous weapons, etc. 
          <br>compared to<br>trying to cure diseases?"
          option1="Military Spending"
          option2="Clinical Research Spending"
          option1Color='black'
          option2Color='blue'
        redirectPath="/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F"
      />
  );
};

export default PollPageContainer;