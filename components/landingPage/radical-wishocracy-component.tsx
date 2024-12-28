"use client"
import { AlertTriangle, Skull, Brain, Globe, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const radicalQuestions = [
  { text: "What if you could reshape reality?", icon: Zap },
  { text: "Eradicate ALL disease?", icon: Skull },
  { text: "End suffering for EVERY sentient being?", icon: Brain },
  { text: "Make death OBSOLETE?", icon: AlertTriangle },
  { text: "But you're just ONE among BILLIONS", icon: Globe },
  { text: "How do you KNOW what to prioritize?", icon: Brain },
  { text: "What if your efforts are WASTED?", icon: AlertTriangle },
  { text: "What if you're making things WORSE?", icon: Skull },
  { text: "Imagine PERFECT global coordination", icon: Globe },
  { text: "OMNISCIENT AI optimizing every action", icon: Brain },
  { text: "INSTANT resource reallocation", icon: Zap },
  { text: "BILLIONS of minds working as ONE", icon: Globe },
  { text: "We could solve ANYTHING", icon: Zap },
  { text: "Are you ready to TRANSCEND humanity?", icon: AlertTriangle },
  { text: "Will you help build the ULTIMATE SYSTEM?", icon: Brain },
];

const RadicalWishocracyReveal = () => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      const newIndex = Math.min(
        Math.floor(scrollPercentage * radicalQuestions.length),
        radicalQuestions.length - 1
      );
      setVisibleIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChoice = (choice: string | null) => {
    setUserChoice(choice);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {radicalQuestions.map(({ text, icon: Icon }, index) => (
        <div
          key={index}
          className={`flex flex-col items-center mb-16 transition-all duration-1000 ${
            index <= visibleIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <Icon className="w-16 h-16 mb-4" />
          <div className="text-4xl md:text-6xl font-bold text-center mb-8 glitch-text">
            {text}
          </div>
          {index === radicalQuestions.length - 1 && (
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => handleChoice('yes')}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors"
              >
                YES
              </button>
              <button
                onClick={() => handleChoice('no')}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
              >
                NO
              </button>
            </div>
          )}
        </div>
      ))}
      {userChoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-4xl md:text-6xl font-bold text-center glitch-text">
            {userChoice === 'yes' 
              ? "Prepare for the REVOLUTION" 
              : "The future waits for no one"}
          </div>
        </div>
      )}
      <style jsx>{`
        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255,0,0,.75),
            -0.025em -0.05em 0 rgba(0,255,0,.75),
            0.025em 0.05em 0 rgba(0,0,255,.75);
          animation: glitch 500ms infinite;
        }
        @keyframes glitch {
          0% {
            text-shadow: 
              0.05em 0 0 rgba(255,0,0,.75),
              -0.05em -0.025em 0 rgba(0,255,0,.75),
              -0.025em 0.05em 0 rgba(0,0,255,.75);
          }
          14% {
            text-shadow: 
              0.05em 0 0 rgba(255,0,0,.75),
              -0.05em -0.025em 0 rgba(0,255,0,.75),
              -0.025em 0.05em 0 rgba(0,0,255,.75);
          }
          15% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255,0,0,.75),
              0.025em 0.025em 0 rgba(0,255,0,.75),
              -0.05em -0.05em 0 rgba(0,0,255,.75);
          }
          49% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255,0,0,.75),
              0.025em 0.025em 0 rgba(0,255,0,.75),
              -0.05em -0.05em 0 rgba(0,0,255,.75);
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255,0,0,.75),
              0.05em 0 0 rgba(0,255,0,.75),
              0 -0.05em 0 rgba(0,0,255,.75);
          }
          99% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255,0,0,.75),
              0.05em 0 0 rgba(0,255,0,.75),
              0 -0.05em 0 rgba(0,0,255,.75);
          }
          100% {
            text-shadow: 
              -0.025em 0 0 rgba(255,0,0,.75),
              -0.025em -0.025em 0 rgba(0,255,0,.75),
              -0.025em -0.05em 0 rgba(0,0,255,.75);
          }
        }
      `}</style>
    </div>
  );
};

export default RadicalWishocracyReveal;