"use client";
import React, { useState, useEffect } from 'react';
import GlobalBrainNetwork from "@/components/landingPage/global-brain-network";
import {globalProblems} from "@/components/landingPage/interactive-landing-page";

interface GlobalCoordinationAgentProps {
  initialIssue?: string;
  title?: string;
}

const GlobalCoordinationAgent: React.FC<GlobalCoordinationAgentProps> = ({ 
  initialIssue,
  title = "GLOBAL COORDINATION AGENT" // Default title if none provided
}) => {
  const [currentIssue, setCurrentIssue] = useState(initialIssue || '');
  const [aiProgress, setAiProgress] = useState(0);
  const [networkNodes, setNetworkNodes] = useState(0);

  const globalIssues =
    globalProblems.map(problem => `${problem.emoji} ${problem.name}`);

  useEffect(() => {
    let issueInterval: NodeJS.Timeout | undefined;
    
    if (!initialIssue) {
      issueInterval = setInterval(() => {
        setCurrentIssue(globalIssues[Math.floor(Math.random() * globalIssues.length)]);
      }, 1000);
    }

    const progressInterval = setInterval(() => {
      setAiProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);

    const nodeInterval = setInterval(() => {
      setNetworkNodes(prev => (prev < 100 ? prev + 1 : 0));
    }, 100);

    return () => {
      if (issueInterval) clearInterval(issueInterval);
      clearInterval(progressInterval);
      clearInterval(nodeInterval);
    };
  }, [initialIssue]);

  return (
    <div className="flex items-center justify-center p-4 overflow-hidden">
      <div
          className="relative w-full max-w-4xl p-4 bg-black border-4 border-cyan-500 rounded-lg">
        <div className="absolute inset-0 opacity-10 animate-pulse"></div>

        <h1 className="text-4xl font-bold text-cyan-500 mb-6 animate-glitch">
          {title}
        </h1>

        <div className="mb-8 relative">
          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 animate-gradient"
                style={{width: `${aiProgress}%`}}
            ></div>
          </div>
          <p className="absolute top-full left-0 text-xs text-cyan-300 mt-1">
            Processing: {aiProgress}% - Analyzing global data streams
          </p>
        </div>

        <div className="mb-6">
          <p className="text-lg text-cyan-300 mb-2 p-2">Coordinating Effort to Solve:</p>
          <p className="text-3xl font-bold text-white animate-neon">
            {currentIssue}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-purple-500">
            <p className="text-purple-400 text-sm mb-2">Collective Intelligence Network</p>
            <div className="flex flex-wrap gap-1">
              {[...Array(100)].map((_, index) => (
                  <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index < networkNodes ? 'bg-purple-500' : 'bg-gray-600'} 
                              transition-colors duration-300 ease-in-out`}
                  ></div>
              ))}
            </div>
            <p className="text-xs text-purple-300 mt-2">{networkNodes} Nodes Active</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500">
            <p className="text-cyan-400 text-sm mb-2">Global Resource Allocation</p>
            <div className="space-y-2">
              {['Research', 'Implementation', 'Coordination'].map((phase, index) => (
                  <div key={index} className="w-full">
                    <p className="text-xs text-cyan-300 mb-1">{phase}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                          className="bg-cyan-500 h-2 rounded-full animate-pulse"
                          style={{width: `${Math.random() * 100}%`}}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 w-3/5 mx-auto">
          <GlobalBrainNetwork/>
        </div>
      </div>
    </div>
  );
};

export default GlobalCoordinationAgent;
