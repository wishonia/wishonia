// scripts/petition.js

document.addEventListener('DOMContentLoaded', function() {
    const petitionForm = document.getElementById('petitionForm');

    petitionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Extracting form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;

        // Validate form data here if necessary

        // Assuming an API endpoint /api/petition for submitting the petition form
        fetch('/api/petition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                address,
                city,
                state,
                zip,
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
