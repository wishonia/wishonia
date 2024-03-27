// scripts/gamification.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user points and badges
    let userPoints = 0;
    const badges = {
        newcomer: false,
        activist: false,
        influencer: false
    };

    // Check if user has existing points or badges stored in local storage
    if (localStorage.getItem('userPoints')) {
        userPoints = parseInt(localStorage.getItem('userPoints'), 10);
        updatePointsDisplay(userPoints);
    }

    if (localStorage.getItem('badges')) {
        Object.assign(badges, JSON.parse(localStorage.getItem('badges')));
        updateBadgesDisplay(badges);
    }

    // Event listeners for various actions that earn points
    document.getElementById('submitPoll').addEventListener('click', function() {
        earnPoints(10); // Earn 10 points for submitting a poll
    });

    document.getElementById('signPetition').addEventListener('click', function() {
        earnPoints(20); // Earn 20 points for signing a petition
    });

    document.getElementById('shareButton').addEventListener('click', function() {
        earnPoints(5); // Earn 5 points for sharing on social media
    });

    // Function to add points and update display
    function earnPoints(points) {
        userPoints += points;
        localStorage.setItem('userPoints', userPoints.toString());
        updatePointsDisplay(userPoints);
        checkForBadges();
    }

    // Function to update points display
    function updatePointsDisplay(points) {
        document.getElementById('pointsDisplay').textContent = `Points: ${points}`;
    }

    // Function to check and update badges
    function checkForBadges() {
        if (userPoints >= 50 && !badges.newcomer) {
            badges.newcomer = true;
            alert('Congratulations! You earned the Newcomer badge.');
        }
        if (userPoints >= 100 && !badges.activist) {
            badges.activist = true;
            alert('Congratulations! You earned the Activist badge.');
        }
        if (userPoints >= 200 && !badges.influencer) {
            badges.influencer = true;
            alert('Congratulations! You earned the Influencer badge.');
        }
        localStorage.setItem('badges', JSON.stringify(badges));
        updateBadgesDisplay(badges);
    }

    // Function to update badges display
    function updateBadgesDisplay(badges) {
        Object.keys(badges).forEach(badge => {
            if (badges[badge]) {
                document.getElementById(`${badge}Badge`).style.display = 'inline';
            }
        });
    }
});
