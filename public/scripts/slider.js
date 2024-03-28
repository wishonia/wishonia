// Function to update the allocation bars based on the slider value
function updateAllocationBars(sliderValue, warBarId, researchBarId) {
    const warPercentageDesiredBar = document.getElementById(warBarId);
    const researchPercentageDesiredBar = document.getElementById(researchBarId);

    // Calculate the percentage allocation for war and research
    const researchAllocationPercentage = sliderValue;
    const warAllocationPercentage = 100 - sliderValue;

    // Update the height style to adjust the bar heights
    warPercentageDesiredBar.style.height = warAllocationPercentage + '%';
    researchPercentageDesiredBar.style.height = researchAllocationPercentage + '%';

    // Update the text content to reflect the new percentages
    warPercentageDesiredBar.querySelector('.war-percentage').textContent = warAllocationPercentage + '%';
    researchPercentageDesiredBar.querySelector('.research-percentage').textContent = researchAllocationPercentage + '%';
}

// Function to handle the submission of the allocation
function submitWarPercentageDesired() {
    const warPercentageDesiredSlider = document.getElementById('warPercentageDesiredSlider');
    const sliderValue = warPercentageDesiredSlider.value;

    // Save the slider value to local storage
    localStorage.setItem('WarPercentageDesired', sliderValue);

    // Redirect to the next page or show a confirmation message
    // For demonstration, we'll just log the value
    console.log('Desired Allocation Submitted:', sliderValue);

    window.location.href = 'guess_poll.html'
}

// Function to handle the submission of the actual allocation
function submitWarPercentageGuessed() {
    const warPercentageGuessedSlider = document.getElementById('warPercentageGuessedSlider');
    const sliderValue = warPercentageGuessedSlider.value;

    // Save the slider value to local storage
    localStorage.setItem('warPercentageGuessed', sliderValue);

    // Redirect to the next page or show a confirmation message
    // For demonstration, we'll just log the value
    console.log('Guessed Percentage Submitted:', sliderValue);
    window.location.href = 'login.html'
}

// Event listeners for the sliders
document.addEventListener('DOMContentLoaded', () => {
    const warPercentageDesiredSlider = document.getElementById('warPercentageDesiredSlider');
    const warPercentageGuessedSlider = document.getElementById('warPercentageGuessedSlider');

    if(warPercentageDesiredSlider){
        // Update the allocation bars when the slider value changes
        warPercentageDesiredSlider.addEventListener('input', () => {
            updateAllocationBars(warPercentageDesiredSlider.value, 'warPercentageDesiredBar', 'researchPercentageDesiredBar');
        });
        // Initialize the bars based on the current slider values
        updateAllocationBars(warPercentageDesiredSlider.value, 'warPercentageDesiredBar', 'researchPercentageDesiredBar');
    }
    if(warPercentageGuessedSlider){
        // Update the allocation bars when the slider value changes
        warPercentageGuessedSlider.addEventListener('input', () => {
            updateAllocationBars(warPercentageGuessedSlider.value, 'warPercentageGuessedBar', 'researchPercentageGuessedBar');
        });
        // Initialize the bars based on the current slider values
        updateAllocationBars(warPercentageGuessedSlider.value, 'warPercentageGuessedBar', 'researchPercentageGuessedBar');
    }
});
