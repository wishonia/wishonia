// scripts/results.js

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user's poll responses from local storage
    const userWarPercentageDesired = JSON.parse(localStorage.getItem('userWarPercentageDesired'));
    const userWarPercentageGuessed = JSON.parse(localStorage.getItem('userWarPercentageGuessed'));

    // Update the user's allocation bars and percentages
    updateAllocationBars(userWarPercentageDesired, 'userDesiredWar', 'userResearchPercentageDesired');
    document.getElementById('userDesiredPercentage').textContent = userWarPercentageDesired;
    document.getElementById('userResearchPercentageDesiredPercentage').textContent = 100 - userWarPercentageDesired;

    updateAllocationBars(userWarPercentageGuessed, 'userActualWar', 'userActualResearch');
    document.getElementById('userActualPercentage').textContent = userWarPercentageGuessed;
    document.getElementById('userActualResearchPercentage').textContent = 100 - userWarPercentageGuessed;

    // Fetch average allocations from the server
    fetch('/api/polls/average')
        .then(response => response.json())
        .then(data => {
            const { averageWarPercentageDesired, averageWarPercentageGuessed } = data;

            // Update the average allocation bars and percentages
            updateAllocationBars(averageWarPercentageDesired, 'averageDesiredWar', 'averageResearchPercentageDesired');
            document.getElementById('averageDesiredPercentage').textContent = averageWarPercentageDesired;
            document.getElementById('averageResearchPercentageDesiredPercentage').textContent = 100 - averageWarPercentageDesired;

            updateAllocationBars(averageWarPercentageGuessed, 'averageActualWar', 'averageActualResearch');
            document.getElementById('averageActualPercentage').textContent = averageWarPercentageGuessed;
            document.getElementById('averageActualResearchPercentage').textContent = 100 - averageWarPercentageGuessed;
        })
        .catch(error => console.error('Error fetching average allocations:', error));

    // Reuse the slider.js function to update allocation bars
    function updateAllocationBars(sliderValue, warBarId, researchBarId) {
        const warPercentageDesiredBar = document.getElementById(warBarId);
        const researchPercentageDesiredBar = document.getElementById(researchBarId);

        // Calculate the percentage allocation for war and research
        const warAllocationPercentage = sliderValue;
        const researchAllocationPercentage = 100 - sliderValue;

        // Update the flex-grow style to adjust the bar widths
        warPercentageDesiredBar.style.flexGrow = warAllocationPercentage;
        researchPercentageDesiredBar.style.flexGrow = researchAllocationPercentage;

        // Optionally, update the text content or any other attributes of the bars
    }
});
