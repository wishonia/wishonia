"use client";
import React, { useState, useEffect } from 'react';
import GlobalBrainNetwork from "@/components/landingPage/global-brain-network";

const GlobalHealthOptimizationAgent = () => {
  const [currentDisease, setCurrentDisease] = useState('');
  const [taskProgress, setTaskProgress] = useState(0);
  const [activeAgents, setActiveAgents] = useState(0);

  const diseases = [
    'Alzheimer\'s Disease',
    'Chronic Pain Syndrome',
    'Major Depressive Disorder',
    'Amyotrophic Lateral Sclerosis',
    'Pancreatic Cancer',
    'Cerebral Malaria',
    'Multi-Drug Resistant Tuberculosis'
  ];

  const tasks = [
    'Genetic Analysis',
    'Protein Folding Simulation',
    'Clinical Trial Design',
    'Drug Interaction Modeling',
    'Patient Data Mining',
    'Biomarker Identification',
    'Treatment Protocol Optimization'
  ];

  const [progressWidths, setProgressWidths] =
      useState<number[]>([]);

  useEffect(() => {  
    setProgressWidths(['Data Analysis', 'Experimental Design', 'Clinical Trials', 'Treatment Development']
        .map(() => Math.random() * 100));
  }, []);  

  useEffect(() => {
    const diseaseInterval = setInterval(() => {
      setCurrentDisease(diseases[Math.floor(Math.random() * diseases.length)]);
    }, 4000);

    const progressInterval = setInterval(() => {
      setTaskProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);

    const agentInterval = setInterval(() => {
      setActiveAgents(prev => (prev < 1000 ? prev + 5 : 0));
    }, 100);

    return () => {
      clearInterval(diseaseInterval);
      clearInterval(progressInterval);
      clearInterval(agentInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center p-4 text-cyan-300 overflow-hidden">
      <div
          className="relative w-full max-w-4xl p-4 bg-black border-4 border-cyan-500 rounded-lg">


        <h1 className="text-4xl font-bold text-cyan-400 mb-6 animate-glitch">
          GLOBAL HEALTH OPTIMIZATION AGENT v3.0
        </h1>

        <div className="mb-8">
          <p className="text-lg text-purple-400 mb-2">Current Disease Focus:</p>
          <p className="text-3xl font-bold text-white animate-neon">
            {currentDisease}
          </p>
        </div>

        <div className="mb-6 relative">
          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 animate-gradient"
                style={{width: `${taskProgress}%`}}
            ></div>
          </div>
          <p className="absolute top-full left-0 text-xs text-cyan-400 mt-1">
            Task Decomposition Progress: {taskProgress}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-purple-500">
            <p className="text-purple-400 text-sm mb-2">Active Problem Solvers</p>
            <p className="text-2xl font-bold text-white">{activeAgents.toLocaleString()}</p>
            <p className="text-xs text-purple-300 mt-1">Experts collaborating globally</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500">
            <p className="text-cyan-400 text-sm mb-2">Current Task Assignment</p>
            <p className="text-lg font-bold text-white animate-blink">
              {tasks[Math.floor(taskProgress / 100 * tasks.length)]}
            </p>
            <p className="text-xs text-cyan-300 mt-1">Matching experts to specific tasks</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-cyan-400 mb-1">Resource Allocation by Research Phase:</p>
          {['Data Analysis', 'Experimental Design', 'Clinical Trials', 'Treatment Development'].map((phase, index) => (
              <div key={index} className="w-full">
                <p className="text-xs text-purple-300 mb-1">{phase}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                      className="bg-cyan-500 h-2 rounded-full animate-pulse"
                      style={{width: `${progressWidths[index]}%`}}
                  ></div>
                </div>
              </div>
          ))}
        </div>

        <div className="p-4 w-3/5 mx-auto">
          <GlobalBrainNetwork/>
        </div>
      </div>
    </div>
  );
};

export default GlobalHealthOptimizationAgent;