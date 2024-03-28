document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user's poll responses from local storage
    const userWarPercentageDesired = JSON.parse(localStorage.getItem('warPercentageDesired'));
    const userWarPercentageGuessed = JSON.parse(localStorage.getItem('warPercentageGuessed'));

    fetch('/api/poll/submit', {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        // Include any other headers here, such as authentication tokens if needed
      },
      body: JSON.stringify({
        warPercentageGuessed: userWarPercentageGuessed,
        warPercentageDesired: userWarPercentageDesired
      }) // Convert the data to a JSON string
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => console.log(data)) // Log the data
    .catch((error) => {
      console.error('Error:', error);
    });

    // Update the user's allocation bars and percentages
    updateAllocationBars(userWarPercentageDesired, 'userWarPercentageDesired', 'userResearchPercentageDesired');
    document.getElementById('userWarPercentageDesired').textContent = userWarPercentageDesired;
    document.getElementById('userResearchPercentageDesired').textContent = 100 - userWarPercentageDesired;

    updateAllocationBars(userWarPercentageGuessed, 'userWarPercentageGuessed', 'userResearchPercentageGuessed');
    document.getElementById('userWarPercentageGuessed').textContent = userWarPercentageGuessed;
    document.getElementById('userResearchPercentageGuessed').textContent = 100 - userWarPercentageGuessed;

    // Fetch average allocations from the server
    fetch('/api/poll/average')
        .then(response => response.json())
        .then(data => {
            const { averageWarPercentageDesired, averageWarPercentageGuessed } = data;

            // Update the average allocation bars and percentages
            updateAllocationBars(averageWarPercentageDesired, 'averageWarPercentageDesiredBar', 'averageResearchPercentageDesiredBar');
            document.getElementById('averageWarPercentageDesired').textContent = averageWarPercentageDesired;
            document.getElementById('averageResearchPercentageDesired').textContent = 100 - averageWarPercentageDesired;

            updateAllocationBars(averageWarPercentageGuessed, 'averageWarPercentageGuessedBar', 'averageResearchPercentageGuessedBar');
            document.getElementById('averageWarPercentageGuessed').textContent = averageWarPercentageGuessed;
            document.getElementById('averageResearchPercentageGuessed').textContent = 100 - averageWarPercentageGuessed;
        })
        .catch(error => console.error('Error fetching average allocations:', error));

    // Reuse the slider.js function to update allocation bars
    function updateAllocationBars(sliderValue, warBarId, researchBarId) {
        const warPercentageDesiredBar = document.getElementById(warBarId);
        if(!warPercentageDesiredBar) {
            throw new Error(`Element with ID ${warBarId} not found`);
        }
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
