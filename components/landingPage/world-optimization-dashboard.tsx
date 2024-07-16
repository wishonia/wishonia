"use client"
import GlobalCoordinationAgent from "@/components/landingPage/global-coordination-agent";
import GlobalHealthOptimizationAgent from "@/components/landingPage/global-health-optimization-agent";
import React from "react";

const WorldOptimizationHeader = () => {
  return (
    <header className="relative mx-4 overflow-hidden p-6 text-center sm:mx-8 md:mx-12 lg:mx-16">
      <div className="relative -skew-x-12 transform rounded-lg border-4 border-cyan-500 bg-black bg-opacity-80 p-6">
        <div className="skew-x-12 transform">
          <h1 className="text-4xl font-bold leading-tight text-cyan-400 sm:text-5xl md:text-6xl">
            END GOAL:
          </h1>
          <h1 className="text-4xl font-bold leading-tight text-cyan-400 sm:text-5xl md:text-6xl">
            Global Optimization
          </h1>
        </div>
      </div>
    </header>
  )
}

const WorldOptimizationDashboard = () => {
  return (
    <div className="min-h-screen font-mono">
      <WorldOptimizationHeader />

      <main className="flex flex-col justify-center p-2 md:flex-row md:flex-wrap">
        <GlobalCoordinationAgent></GlobalCoordinationAgent>
        <GlobalHealthOptimizationAgent></GlobalHealthOptimizationAgent>
      </main>
    </div>
  );
};

export default WorldOptimizationDashboard;