import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter for redirection

interface PollPageProps {
    question: string;
    option1: string;
    option2: string;
    option1Color: string; // New prop for option1 color
    option2Color: string; // New prop for option2 color
    redirectPath: string; // Add this line
}

const PollPage: React.FC<PollPageProps> = ({ question, option1, option2, option1Color, option2Color, redirectPath }) => {
    const [allocation, setAllocation] = useState(50);
    const router = useRouter(); // Use useRouter hook for redirection

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllocation(Number(event.target.value));
    };

    const handleSubmit = () => {
        // Save response to localStorage in an array
        const existingResponses = JSON.parse(localStorage.getItem('pollResponses') || '[]');
        const response = {
            questionText: question,
            optionA: option1,
            optionB: option2,
            allocatedAmountA: 100 - allocation,
            allocatedAmountB: allocation
        };
        existingResponses.push(response);
        localStorage.setItem('pollResponses', JSON.stringify(existingResponses));
        router.push(redirectPath); // Redirect to redirectPath
    };

    return (
        <div className="flex flex-col h-screen" id="poll-page-container">
            <h2 className="text-lg font-semibold text-center p-4" id="poll-question" dangerouslySetInnerHTML={{ __html: question }}>
            </h2>

            <div className="flex-grow p-4 flex" id="chart-container">
                <div className="flex-1 flex flex-col justify-end px-4" id="option1-container">
                    <span className="text-xs mb-2" style={{ color: option1Color }}>{100 - allocation}% to {option1}</span>
                    <div
                        id="option1-bar"
                        style={{ height: `${100 - allocation}%`, backgroundColor: option1Color }}
                    ></div>
                </div>
                <div className="flex-1 flex flex-col justify-end px-4" id="option2-container">
                    <span className="text-xs mb-2" style={{ color: option2Color }}>{allocation}% to {option2}</span>
                    <div
                        id="option2-bar"
                        style={{ height: `${allocation}%`, backgroundColor: option2Color }}
                    ></div>
                </div>
            </div>

            <div className="p-4 bg-white" id="controls-container">
                <div className="flex justify-between mt-2" id="labels-container">
                    <span id="option1-label" style={{ color: option1Color, width: '50%', whiteSpace: 'normal' }}>
                        👈 More {option1}
                    </span>
                    <span id="option2-label" style={{ color: option2Color, width: '50%', whiteSpace: 'normal', textAlign: 'right' }}>
                        More {option2} 👉
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
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 outline outline-2 outline-offset-2 outline-black"
                        onClick={handleSubmit}
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