// scripts/auth.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(email, password);
    });

});

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
