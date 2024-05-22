document.addEventListener('DOMContentLoaded', function() {
  var parameters = [
    { id: 'years', label: 'Number of Years for Calculation', defaultValue: 10, step: 1 },
    { id: 'militarySpending', label: 'Annual Global Military Spending (USD)', defaultValue: 2000000000000, step: 1 },
    { id: 'shiftPercentage', label: 'Percentage of Annual Military Spending Shifted', defaultValue: 1, step: 0.01 },
    { id: 'roiMultiplier', label: 'ROI Multiplier for Healthcare Investment', defaultValue: 2, step: 0.1 },
    { id: 'qalyGains', label: 'Annual QALY Gains from Healthcare Investment', defaultValue: 100000, step: 1 },
    { id: 'qalyValue', label: 'Value of a QALY (USD)', defaultValue: 50000, step: 1 },
    { id: 'productivityGainsHealth', label: 'Annual Productivity Gains from Improved Health (USD)', defaultValue: 30000000000, step: 1 },
    { id: 'productivityGainsTech', label: 'Annual Productivity Gains from Healthcare Technology (USD)', defaultValue: 20000000000, step: 1 },
    { id: 'livesLost', label: 'Annual Lives Lost Due to Military Actions', defaultValue: 10000, step: 1 },
    { id: 'valuePerLife', label: 'Value of Life (USD)', defaultValue: 9500000, step: 1 },
    { id: 'displacedPersons', label: 'Annual Displaced Persons Due to Conflict', defaultValue: 500000, step: 1 },
    { id: 'costPerDisplacedPerson', label: 'Cost per Displaced Person (USD)', defaultValue: 10000, step: 1 },
    { id: 'infrastructureDamage', label: 'Annual Infrastructure Damage (USD)', defaultValue: 50000000000, step: 1 },
    { id: 'researchInnovation', label: 'Annual Value of Research & Innovation in Healthcare (USD)', defaultValue: 10000000000, step: 1 },
  ];

  var container = document.getElementById('inputContainer');

  parameters.forEach(function(param) {
    var inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    var label = document.createElement('label');
    label.setAttribute('for', param.id);
    label.textContent = param.label;

    var input = document.createElement('input');
    input.type = 'number';
    input.id = param.id;
    input.value = param.defaultValue;
    input.step = param.step;

    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    container.appendChild(inputGroup);
  });

  var calculateButton = document.createElement('button');
  calculateButton.textContent = 'Calculate Benefits';
  calculateButton.onclick = calculateBenefits;

  container.appendChild(calculateButton);

  var resultsDiv = document.createElement('div');
  resultsDiv.id = 'results';
  container.appendChild(resultsDiv);
});

function calculateBenefits() {
  // Extracting values from inputs
  var values = {};
  document.querySelectorAll('#inputContainer input').forEach(input => {
    values[input.id] = parseFloat(input.value);
  });

  // Calculating benefits and costs multiplied by the number of years
  var shiftedSpending = values.militarySpending * values.shiftPercentage / 100 * values.years;
  var directBenefits = shiftedSpending * values.roiMultiplier;
  var healthBenefits = values.qalyGains * values.qalyValue * values.years;
  var totalProductivityGains = (values.productivityGainsHealth + values.productivityGainsTech) * values.years;
  var totalResearchInnovation = values.researchInnovation * values.years;

  // Calculating reduced costs from negative externalities multiplied by the number of years
  var livesLostValueReduction = values.livesLost * values.valuePerLife * values.shiftPercentage / 100 * values.years;
  var displacedPersonCostReduction = values.displacedPersons * values.costPerDisplacedPerson * values.shiftPercentage / 100 * values.years;
  var infrastructureDamageReduction = values.infrastructureDamage * values.shiftPercentage / 100 * values.years;

  // Total Net Economic Benefits
  var netBenefits = directBenefits + healthBenefits + totalProductivityGains + totalResearchInnovation
    + livesLostValueReduction + displacedPersonCostReduction + infrastructureDamageReduction;

  document.getElementById('results').innerHTML = `
        <h3>Net Economic Benefits over ${values.years} Year(s): $${netBenefits.toLocaleString()}</h3>
        <p>Shifted Spending for Healthcare: $${shiftedSpending.toLocaleString()}</p>
        <p>Direct Healthcare Investment Benefits: $${directBenefits.toLocaleString()}</p>
        <p>Health Benefits (QALY Gains): $${healthBenefits.toLocaleString()}</p>
        <p>Total Productivity Gains: $${totalProductivityGains.toLocaleString()}</p>
        <p>Value of Research & Innovation: $${totalResearchInnovation.toLocaleString()}</p>
        <p>Reduced Costs from Negative Externalities: $${(livesLostValueReduction + displacedPersonCostReduction + infrastructureDamageReduction).toLocaleString()}</p>
    `;
}
