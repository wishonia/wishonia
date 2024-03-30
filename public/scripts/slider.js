function submitWarPercentageDesired() {
    const slider = document.getElementById('slider');
    localStorage.setItem('warPercentageDesired', slider.value);
    //window.location.href = 'guess_poll.html'
    window.location.href = 'login.html'
}

function submitWarPercentageGuessed() {
    const warPercentageGuessedSlider = document.getElementById('slider');
    localStorage.setItem('warPercentageGuessed', warPercentageGuessedSlider.value);
    window.location.href = 'login.html'
}

function renderSliderElement(targetDivId) {
    const targetDiv = document.getElementById(targetDivId);
    if (targetDiv) {
        targetDiv.innerHTML = `
            <input type="range" id="slider" min="0" max="100" value="50" class="slider">
            <div class="allocation-labels">
                <span class="war-label">👈 More War</span>
                <span class="research-label">More Cures 👉</span>
            </div>
        `;
    }
}

function addSliderListener(localStorageKey) {
    renderSliderElement('slider-container');
    const slider = document.getElementById('slider');
    if (slider) {
        // Update the allocation bars when the slider value changes
        slider.addEventListener('input', () => {
            updateAllocationBars(slider.value);

            localStorage.setItem(localStorageKey, 100 - slider.value);
        });
        // Initialize the bars based on the current slider values
        updateAllocationBars(slider.value);
    }
}

let barChart;
function renderAllocationBars(warPercentage) {
    const researchPercentage = 100 - warPercentage;
    const ctx = document.getElementById('bar-chart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Weapons and Military', 'Medical Research'],
            datasets: [{
                label: 'Allocation',
                data: [warPercentage, researchPercentage],
                backgroundColor: [
                    '#bd1010',
                    '#275ac7'
                ],
                borderColor: [
                    '#bd1010',
                    '#275ac7'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        display: false // This will hide the grid lines for the y-axis
                    }
                },
                x: {
                    grid: {
                        display: false // This will hide the grid lines for the x-axis
                    }
                }
            }
        }
    });
}

function updateAllocationBars(researchPercentage) {
    const warPercentage = 100 - researchPercentage;
    barChart.data.datasets[0].data = [warPercentage, researchPercentage];
    barChart.update();
}