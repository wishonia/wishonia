// scripts/results.js

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user's poll responses from local storage
    const userDesiredAllocation = JSON.parse(localStorage.getItem('userDesiredAllocation'));
    const userActualAllocation = JSON.parse(localStorage.getItem('userActualAllocation'));

    // Update the user's allocation bars and percentages
    updateAllocationBars(userDesiredAllocation, 'userDesiredWar', 'userDesiredResearch');
    document.getElementById('userDesiredPercentage').textContent = userDesiredAllocation;
    document.getElementById('userDesiredResearchPercentage').textContent = 100 - userDesiredAllocation;

    updateAllocationBars(userActualAllocation, 'userActualWar', 'userActualResearch');
    document.getElementById('userActualPercentage').textContent = userActualAllocation;
    document.getElementById('userActualResearchPercentage').textContent = 100 - userActualAllocation;

    // Fetch average allocations from the server
    fetch('/api/polls/average')
        .then(response => response.json())
        .then(data => {
            const { averageDesiredAllocation, averageActualAllocation } = data;

            // Update the average allocation bars and percentages
            updateAllocationBars(averageDesiredAllocation, 'averageDesiredWar', 'averageDesiredResearch');
            document.getElementById('averageDesiredPercentage').textContent = averageDesiredAllocation;
            document.getElementById('averageDesiredResearchPercentage').textContent = 100 - averageDesiredAllocation;

            updateAllocationBars(averageActualAllocation, 'averageActualWar', 'averageActualResearch');
            document.getElementById('averageActualPercentage').textContent = averageActualAllocation;
            document.getElementById('averageActualResearchPercentage').textContent = 100 - averageActualAllocation;
        })
        .catch(error => console.error('Error fetching average allocations:', error));

    // Reuse the slider.js function to update allocation bars
    function updateAllocationBars(sliderValue, warBarId, researchBarId) {
        const desiredWarAllocationBar = document.getElementById(warBarId);
        const desiredResearchAllocationBar = document.getElementById(researchBarId);

        // Calculate the percentage allocation for war and research
        const warAllocationPercentage = sliderValue;
        const researchAllocationPercentage = 100 - sliderValue;

        // Update the flex-grow style to adjust the bar widths
        desiredWarAllocationBar.style.flexGrow = warAllocationPercentage;
        desiredResearchAllocationBar.style.flexGrow = researchAllocationPercentage;

        // Optionally, update the text content or any other attributes of the bars
    }
});
