function generateChart(war, research, id, title) {

    const ctx = document.getElementById(id).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['War and Military', 'Medical Research'],
            datasets: [{
                label: 'Allocation',
                data: [war, research],
                backgroundColor: [
                    '#000000',
                    '#275ac7'
                ],
                borderColor: [
                    '#0a0a0a',
                    '#275ac7'
                ],
                borderWidth: 1
            }]
        },
        options: {
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
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 24
                    },
                    color: '#000000'
                },
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user's poll responses from local storage
    const userWarPercentageDesired = JSON.parse(localStorage.getItem('warPercentageDesired'));
    const userWarPercentageGuessed = JSON.parse(localStorage.getItem('warPercentageGuessed'));
    const referrerHandle = localStorage.getItem('referrerHandle'); // Retrieve the referrer's handle from localStorage

    // Submit user's poll responses and referrer handle to the server
    fetch('/api/poll/submit', {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        // Include any other headers here, such as authentication tokens if needed
      },
      body: JSON.stringify({
        warPercentageGuessed: userWarPercentageGuessed,
        warPercentageDesired: userWarPercentageDesired,
        referrerHandle: referrerHandle // Include the referrer's handle in the submission
      }) // Convert the data to a JSON string
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => console.log(data)) // Log the data
    .catch((error) => {
      console.error('Error:', error);
    });

    // Fetch average allocations from the server
    fetch('/api/poll/average')
        .then(response => response.json())
        .then(data => {

            const avgWarPercentageDesired = data._avg.warPercentageDesired;
            const avgWarPercentageGuessed = data._avg.warPercentageGuessed;
            const averageResearchPercentageDesired = 100 - avgWarPercentageDesired;
            const userResearchPercentageDesired = 100 - userWarPercentageDesired;
            const userResearchPercentageGuessed = 100 - userWarPercentageGuessed;

            // Create Bar Chart Comparing Average and User Allocation
            generateChart(avgWarPercentageDesired, averageResearchPercentageDesired, 'average-desired-allocation',
                'What People Want');
            generateChart(95, 5, 'actual-allocation', 'What Governments Do');
        })
        .catch(error => console.error('Error fetching average allocations:', error));

});
