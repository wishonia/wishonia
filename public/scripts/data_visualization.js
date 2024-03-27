// scripts/data_visualization.js

// Function to dynamically update the results bars based on the allocation percentages
function updateResultsVisualization() {
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
}

// Function to update the allocation bars based on the given percentages
function updateAllocationBars(percentage, warBarId, researchBarId) {
    const warBar = document.getElementById(warBarId);
    const researchBar = document.getElementById(researchBarId);

    const warPercentage = percentage;
    const researchPercentage = 100 - percentage;

    warBar.style.flexGrow = warPercentage;
    researchBar.style.flexGrow = researchPercentage;

    // Update the text content if needed
    warBar.textContent = `${warPercentage}%`;
    researchBar.textContent = `${researchPercentage}%`;
}

// Call the function to update the visualization when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateResultsVisualization();
});
