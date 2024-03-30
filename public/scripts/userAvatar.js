document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    // This example assumes there's a way to check login status, e.g., checking a cookie or local storage
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Placeholder check

    if (isLoggedIn) {
        const avatarContainer = document.createElement('div');
        avatarContainer.style.position = 'fixed';
        avatarContainer.style.top = '10px';
        avatarContainer.style.right = '10px';
        avatarContainer.style.cursor = 'pointer';

        const avatarImage = document.createElement('img');
        avatarImage.src = 'path/to/avatar/image.png'; // Path to the avatar image
        avatarImage.alt = 'Profile Avatar';
        avatarImage.style.width = '50px'; // Set the size of the avatar
        avatarImage.style.height = '50px';
        avatarImage.style.borderRadius = '50%'; // Make the avatar circular

        avatarContainer.appendChild(avatarImage);

        // Redirect to the profile settings page when the avatar is clicked
        avatarContainer.addEventListener('click', function() {
            window.location.href = '/profile.html'; // Path to the profile settings page
        });

        document.body.appendChild(avatarContainer);
    }
});
