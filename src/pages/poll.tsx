import React from 'react';
import PollPage from '../components/PollPage';

const PollPageContainer: React.FC = () => {
  return (
      <PollPage
          question="How much do you think governments should be spending on war, nuclear bombs, autonomous weapons, etc. compared to trying to cure diseases?"
          option1="Military Spending"
          option2="Clinical Research Spending"
          option1Color='black'
          option2Color='blue'
      />
  );
};

export default PollPageContainer;