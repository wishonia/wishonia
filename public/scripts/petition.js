document.addEventListener('DOMContentLoaded', function() {
    const petitionForm = document.getElementById('petitionForm');

    petitionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Extracting form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const stateProvince = document.getElementById('stateProvince').value;
        const postalCode = document.getElementById('postalCode').value;
        const countryCode = document.getElementById('countryCode').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const newsletterSubscribed = document.getElementById('newsletterSubscribed').checked;

        // Validate form data here if necessary

        // Update the endpoint and data structure for submitting the petition form
        fetch('/api/users/updatePetitionInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                address,
                city,
                stateProvince,
                postalCode,
                countryCode,
                phoneNumber,
                newsletterSubscribed,
                signedPetition: true,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                // Redirect to thank you page upon successful submission
                window.location.href = 'thank_you.html';
            } else {
                // Handle failure (e.g., show an error message)
                alert('Failed to submit the petition. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error submitting the petition:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
