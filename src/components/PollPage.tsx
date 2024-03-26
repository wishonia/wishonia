import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import LoginModal from './LoginModal'; // Import the LoginModal component

interface PollPageProps {
    question: string;
    option1: string;
    option2: string;
    option1Color: string; // New prop for option1 color
    option2Color: string; // New prop for option2 color
    redirectPath: string; // Add this line
}

const PollPage: React.FC<PollPageProps> = ({ question, option1, option2, option1Color, option2Color }) => {
    const [allocation, setAllocation] = useState(50);
    const { data: session } = useSession();
    const isLoggedIn = !!session;
    const [showLoginModal, setShowLoginModal] = useState(false); // State to control login modal visibility

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllocation(Number(event.target.value));
    };

    const handleSubmit = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true); // Show login modal instead of alert
        } else {
            // Save response to database logic here
            alert(`You allocated ${allocation}% to ${option2} and ${100 - allocation}% to ${option1}.`);
            // Assuming a function to save the response in the database
        }
    };

    const handleLogin = (method: string) => {
        signIn(method); // Use NextAuth signIn method for login
        setShowLoginModal(false); // Hide login modal after attempting to log in
    };

    return (
        <div className="flex flex-col h-screen" id="poll-page-container">
            {isLoggedIn && (
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            )}
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
            <LoginModal show={showLoginModal} onLogin={handleLogin} />
        </div>
    );
};

export default PollPage;