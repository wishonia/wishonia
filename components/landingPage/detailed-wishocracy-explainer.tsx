"use client"
import { Brain, Globe, Zap, Users, Database, BarChart } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const wishocracySteps = [
  {
    title: "The Problem",
    content: "Humanity faces countless global challenges",
    detail: "Climate change, poverty, disease, and more threaten our future",
    icon: Globe
  },
  {
    title: "The Inefficiency",
    content: "We lack coordination in addressing these issues",
    detail: "Resources are often misallocated or efforts duplicated",
    icon: Users
  },
  {
    title: "The Limitation",
    content: "Human cognition can't optimally prioritize global problems",
    detail: "We struggle to compare and allocate resources across diverse issues",
    icon: Brain
  },
  {
    title: "The Solution: Wishocracy",
    content: "A decentralized system for global problem-solving",
    detail: "Leveraging collective intelligence and AI to optimize resource allocation",
    icon: Zap
  },
  {
    title: "Step 1: Problem Catalog",
    content: "Create a comprehensive list of global challenges",
    detail: "From climate change to disease eradication, catalog every issue",
    icon: Database
  },
  {
    title: "Step 2: Preference Aggregation",
    content: "Use AI to aggregate global preferences",
    detail: "Pairwise comparisons determine resource allocation priorities",
    icon: BarChart
  },
  {
    title: "Step 3: Solution Proposals",
    content: "Crowdsource and evaluate potential solutions",
    detail: "Experts and AI work together to assess feasibility and impact",
    icon: Users
  },
  {
    title: "Step 4: Task Decomposition",
    content: "Break down solutions into actionable tasks",
    detail: "AI assigns tasks based on skills, resources, and efficiency",
    icon: Brain
  },
  {
    title: "Step 5: Global Coordination",
    content: "Optimize resource allocation across all tasks",
    detail: "Ensure every action contributes maximally to solving global issues",
    icon: Globe
  },
  {
    title: "The Vision",
    content: "A world where every resource is optimally utilized",
    detail: "Solving humanity's greatest challenges through perfect coordination",
    icon: Zap
  },
  {
    title: "The Question",
    content: "Are you ready to build this system?",
    detail: "Join us in creating Wishocracy and reshaping our global future",
    icon: Users
  }
];

const WishocracyExplainer = () => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      const newIndex = Math.min(
        Math.floor(scrollPercentage * wishocracySteps.length),
        wishocracySteps.length - 1
      );
      setVisibleIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChoice = (choice: string) => {
    setUserChoice(choice);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {wishocracySteps.map(({ title, content, detail, icon: Icon }, index) => (
        <div
          key={index}
          className={`flex flex-col items-center mb-24 transition-all duration-1000 ${
            index <= visibleIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <Icon className="w-16 h-16 mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2 text-blue-300">{title}</h2>
          <div className="text-4xl md:text-5xl font-bold text-center mb-4 glitch-text">
            {content}
          </div>
          <p className="text-xl text-center text-gray-400 max-w-2xl">{detail}</p>
          {index === wishocracySteps.length - 1 && (
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => handleChoice('yes')}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
              >
                I'm Ready
              </button>
              <button
                onClick={() => handleChoice('no')}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition-colors"
              >
                Need More Info
              </button>
            </div>
          )}
        </div>
      ))}
      {userChoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-4xl md:text-6xl font-bold text-center glitch-text">
            {userChoice === 'yes' 
              ? "Welcome to the Wishocracy Revolution" 
              : "Explore more at wishocracy.org"}
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

export default WishocracyExplainer;