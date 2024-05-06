"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React, { useState } from "react";
import WarVsResearchBarChart from "@/components/war-vs-research-bar-chart";
import BarChart from "@/components/bar-chart";

import { warImages } from '@/lib/warImagePaths';
export const PollWarResearch = () => {
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
    <>
        <section className="space-y-4 pb-12 pt-4 md:space-y-8 md:pt-5 lg:py-16">
            <div className="container flex max-w-[64rem] flex-col items-center gap-0 text-center">
                <p className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
                    Global Priorities Referendum on
                </p>
                <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl pt-2">
                    War and Disease
                </h1>
                <div id="poll-description">
                    <div className="text-sm md:text-xl px-0 pb-2 pt-2">
                        Humanity has a finite amount of brains and resources.
                    </div>
                    <div className="text-sm md:text-xl px-0 pb-2">
                        Adjust how much governments globally should allocate to war/military vs helping the 2 billion
                        people suffering from chronic diseases (like Grandma Kay).
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div id="chart-and-slider-container"
                         className="px-4 lg:px-8"
                         style={{maxWidth: '300px'}}>
                        <WarVsResearchBarChart warPercentageDesired={warPercentageDesired}/>
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
                        It&apos;s necessary to sign in to ensure electoral integrity.  Robots don&apos;t get to vote!
                    </div>
                </div>
            </div>

        </section>
    </>
)
}
