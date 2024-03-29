document.addEventListener('DOMContentLoaded', function() {
    personalizeContent();
});

function personalizeContent() {
    const userWarPercentageDesired = JSON.parse(localStorage.getItem('userWarPercentageDesired'));
    const userWarPercentageGuessed = JSON.parse(localStorage.getItem('userWarPercentageGuessed'));

    // Example of personalization based on user's previous interactions
    if (userWarPercentageDesired !== null && userWarPercentageGuessed !== null) {
        const difference = Math.abs(userWarPercentageDesired - userWarPercentageGuessed);
        const personalizationMessageElement = document.getElementById('personalizationMessage');

        if (difference <= 10) {
            personalizationMessageElement.textContent = "Your perception closely matches your desires. Explore how you can help make a change.";
        } else if (difference > 10 && difference <= 30) {
            personalizationMessageElement.textContent = "There's a noticeable gap between your perception and desires. Learn more about how to bridge this gap.";
        } else {
            personalizationMessageElement.textContent = "There's a significant difference between your perception and desires. Discover actions you can take to align reality with your vision.";
        }
    }

    // Suggest related petitions or initiatives based on user's poll responses
    suggestRelatedInitiatives();
}

function suggestRelatedInitiatives() {
    const suggestionsElement = document.getElementById('suggestions');
    const userWarPercentageDesired = JSON.parse(localStorage.getItem('userWarPercentageDesired'));

    // Placeholder suggestions based on user's desired allocation
    let suggestions = [];

    if (userWarPercentageDesired <= 25) {
        suggestions = ["Support initiatives for peace and conflict resolution.", "Learn about non-violent conflict management."];
    } else if (userWarPercentageDesired > 25 && userWarPercentageDesired <= 75) {
        suggestions = ["Join campaigns for balanced funding in public health and defense.", "Educate yourself on the benefits of clinical research."];
    } else {
        suggestions = ["Advocate for increased funding in clinical research.", "Participate in public health improvement programs."];
    }

    suggestionsElement.innerHTML = suggestions.map(suggestion => `<li>${suggestion}</li>`).join('');
}
