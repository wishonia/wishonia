// scripts/auth.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        // Removed password retrieval and updated to handle passwordless login
        sendMagicLink(email);
    });

    // Capture and verify the login token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const loginToken = urlParams.get('token');
    if (loginToken) {
        verifyLoginToken(loginToken);
    }
});

// Added function to handle sending the magic link
function sendMagicLink(email) {
    fetch('/api/users/send-magic-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Magic link sent:', data);
        alert('Check your email for the login link!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function verifyLoginToken(token) {
    fetch(`/api/users/verify-token?token=${token}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Token verified:', data);
            // Redirect or update UI as needed
            window.location.href = 'dashboard.html';
        } else {
            alert('Token verification failed. Please try logging in again.');
        }
    })
    .catch((error) => {
        console.error('Error verifying token:', error);
    });
}

function loginUser(email, password) {
    // Sending login request to the server
    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'results.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function registerUser(email, password) {
    // Sending registration request to the server
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'results.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export { loginUser, registerUser };

// Note: The actual implementation for user authentication would involve more
// complex logic including communication with the server and handling of
// responses. This is a simplified version for demonstration purposes.
