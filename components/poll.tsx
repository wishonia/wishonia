"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React, { useState } from "react";
import BarChart from "@/components/bar-chart";

export const Poll = () => {
  const [researchPercentageDesired, setResearchPercentageDesired] = useState(50); // Define allocation state
  const [warPercentageDesired, setWarPercentageDesired] = useState(50); // Define allocation state

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const researchPercentageDesired = parseInt(event.target.value, 10);
      const warPercentageDesired = 100 - researchPercentageDesired;
      setResearchPercentageDesired(researchPercentageDesired);
      setWarPercentageDesired(warPercentageDesired);
      localStorage.setItem('warPercentageDesired', warPercentageDesired.toString());
  };

return (
    <div className="font-bold py-4 text-center container flex flex-col px-2">
        <p className="text-sm md:text-xl px-4 pb-1">
            Global Referendum on
        </p>
        <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold pb-4">
            <h1>War and Disease</h1>
        </div>
        <div id="poll-description">
            <div className="text-sm md:text-xl px-0 pb-4">
                Humanity has a finite amount of brains and resources.
            </div>
            <div className="text-sm md:text-xl px-0 pb-4">
                Adjust how much governments globally should allocate to war/military vs helping the 2 billion people suffering from chronic diseases (like Grandma Kay).
            </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px'}}>
            <div id="chart-and-slider-container" className="px-4 lg:px-8" style={{maxWidth: '600px'}}>
                <BarChart warPercentageDesired={warPercentageDesired}/>
                <Input type="range" min="0" max="100" value={researchPercentageDesired.toString()}
                       onChange={handleSliderChange}/>
                <div>
                    <span style={{float: 'left'}}>👈 More War</span>
                    <span style={{float: 'right'}}>More Cures 👉</span>
                </div>
            </div>
        </div>
        <Link href={"/signup"}>
            <Button
                //onClick={() => handleClick()}
                className="text-xl p-6 md:p-8 rounded-full font-semibold
                 hover:border hover:border-black mt-2"
            >
                Vote to See Results
            </Button>
        </Link>
        <div className="">
            <div className="text-xs px-4 pt-4">
                It&apos;s necessary to sign in to ensure electoral integrity.
            </div>
            <div className="text-xs px-4 py-0">
                Robots don&apos;t get to vote!
            </div>
            
        </div>
    </div>
);
};

