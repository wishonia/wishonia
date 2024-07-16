"use client"
import GlobalCoordinationAgent from "@/components/landingPage/global-coordination-agent";
import GlobalHealthOptimizationAgent from "@/components/landingPage/global-health-optimization-agent";
import React from "react";

const WorldOptimizationHeader = () => {
    return (
        <header className="p-6 text-center relative overflow-hidden mx-4 sm:mx-8 md:mx-12 lg:mx-16">
            <div className="relative bg-black bg-opacity-80 p-6 rounded-lg border-4 border-cyan-500 transform -skew-x-12">
                <div className="transform skew-x-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-cyan-400">
                        World Optimization Monitoring Dashboard
                    </h1>
                </div>
            </div>
        </header>
    );
};

const WorldOptimizationDashboard = () => {
  return (
    <div className="min-h-screen font-mono">
      <WorldOptimizationHeader/>

      <main className="flex flex-col p-2 md:flex-row md:flex-wrap justify-center">
        <GlobalCoordinationAgent></GlobalCoordinationAgent>
        <GlobalHealthOptimizationAgent></GlobalHealthOptimizationAgent>
      </main>
    </div>
  );
};

export default WorldOptimizationDashboard;