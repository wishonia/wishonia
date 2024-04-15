"use client";
import { useEffect } from 'react';

const AfterLoginHandler = () => {
  useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined') {
      let referrerUserId = localStorage.getItem('referrerUserId');
      const warPercentageDesired = localStorage.getItem('warPercentageDesired');
      const data = {
        referrerUserId: referrerUserId || undefined,
        warPercentageDesired: warPercentageDesired || undefined
      }

      if (referrerUserId || warPercentageDesired) {
        // Here you would send `referrerId` to your server
        // For example, using fetch to POST to your API route
        fetch('/api/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include any necessary headers, such as authentication tokens
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // Optionally clear the localStorage after successful submission
          //localStorage.removeItem('referrerId');
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