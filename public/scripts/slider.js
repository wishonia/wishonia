// Function to update the allocation bars based on the slider value
function updateAllocationBars(sliderValue, warBarId, researchBarId) {
    const desiredWarAllocationBar = document.getElementById(warBarId);
    const desiredResearchAllocationBar = document.getElementById(researchBarId);

    // Calculate the percentage allocation for war and research
    const warAllocationPercentage = sliderValue;
    const researchAllocationPercentage = 100 - sliderValue;

    // Update the height style to adjust the bar heights
    desiredWarAllocationBar.style.height = warAllocationPercentage + '%';
    desiredResearchAllocationBar.style.height = researchAllocationPercentage + '%';

    // Update the text content to reflect the new percentages
    desiredWarAllocationBar.querySelector('.war-percentage').textContent = warAllocationPercentage + '%';
    desiredResearchAllocationBar.querySelector('.research-percentage').textContent = researchAllocationPercentage + '%';
}

// Function to handle the submission of the allocation
function submitDesiredAllocation() {
    const desiredAllocationSlider = document.getElementById('desiredAllocationSlider');
    const sliderValue = desiredAllocationSlider.value;

    // Save the slider value to local storage
    localStorage.setItem('desiredAllocation', sliderValue);

    // Redirect to the next page or show a confirmation message
    // For demonstration, we'll just log the value
    console.log('Desired Allocation Submitted:', sliderValue);
}

// Function to handle the submission of the actual allocation
function submitActualAllocation() {
    const actualAllocationSlider = document.getElementById('actualAllocationSlider');
    const sliderValue = actualAllocationSlider.value;

    // Save the slider value to local storage
    localStorage.setItem('actualAllocation', sliderValue);

    // Redirect to the next page or show a confirmation message
    // For demonstration, we'll just log the value
    console.log('Actual Allocation Submitted:', sliderValue);
}

// Event listeners for the sliders
document.addEventListener('DOMContentLoaded', () => {
    const desiredAllocationSlider = document.getElementById('desiredAllocationSlider');
    const actualAllocationSlider = document.getElementById('actualAllocationSlider');

    if(desiredAllocationSlider){
        // Update the allocation bars when the slider value changes
        desiredAllocationSlider.addEventListener('input', () => {
            updateAllocationBars(desiredAllocationSlider.value, 'desiredWarAllocationBar', 'desiredResearchAllocationBar');
        });
        // Initialize the bars based on the current slider values
        updateAllocationBars(desiredAllocationSlider.value, 'desiredWarAllocationBar', 'desiredResearchAllocationBar');
    }
    if(actualAllocationSlider){
        // Update the allocation bars when the slider value changes
        actualAllocationSlider.addEventListener('input', () => {
            updateAllocationBars(actualAllocationSlider.value, 'actualWarAllocationBar', 'actualResearchAllocationBar');
        });
        // Initialize the bars based on the current slider values
        updateAllocationBars(actualAllocationSlider.value, 'actualWarAllocationBar', 'actualResearchAllocationBar');
    }
});
