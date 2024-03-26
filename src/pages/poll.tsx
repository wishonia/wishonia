import React, { useState } from 'react';

const PollPage = () => {
  const [allocation, setAllocation] = useState(50); // 0% military, 100% research by default

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllocation(Number(event.target.value));
  };

  return (
    <div className="flex flex-col h-screen" id="poll-page-container">
      <h2 className="text-lg font-semibold text-center p-4" id="poll-question">
        How much do you think we should spend on medical research compared to war?
      </h2>

      <div className="flex-grow p-4 flex" id="chart-container">
        <div className="flex-1 flex flex-col justify-end" id="military-spending-container">
          <div
            id="military-spending-bar"
            style={{ height: `${100 - allocation}%`, backgroundColor: 'red' }}
          ></div>
        </div>
        <div className="flex-1 flex flex-col justify-end" id="clinical-research-container">
          <div
            id="clinical-research-bar"
            style={{ height: `${allocation}%`, backgroundColor: 'green' }}
          ></div>
        </div>
      </div>

      <div className="p-4 bg-white" id="controls-container">
        <div className="flex justify-between mt-2" id="labels-container">
          <span className="text-red-600" id="military-spending-label">
            Military Spending
          </span>
          <span className="text-green-600" id="medical-research-label">
            Medical Research
          </span>
        </div>

        <div className="flex flex-col items-center mt-4" id="input-container">
          <input
            type="range"
            min="0"
            max="100"
            value={allocation}
            className="w-full mb-4"
            onChange={handleSliderChange}
            id="allocation-slider"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out"
            onClick={() =>
              alert(
                `You allocated ${allocation}% to medical research and ${100 - allocation}% to military spending.`
              )
            }
            id="submit-button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollPage;