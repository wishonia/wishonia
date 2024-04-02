import React, { useEffect } from 'react';

const AfterLoginHandler = () => {
  useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined') {
      const warPercentageDesired = localStorage.getItem('warPercentageDesired');
      
      if (warPercentageDesired) {
        // Here you would send `warPercentageDesired` to your server
        // For example, using fetch to POST to your API route
        fetch('/api/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include any necessary headers, such as authentication tokens
          },
          body: JSON.stringify({ warPercentageDesired }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // Optionally clear the localStorage after successful submission
          //localStorage.removeItem('warPercentageDesired');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default AfterLoginHandler;