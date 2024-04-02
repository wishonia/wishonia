"use client";
import Link from "next/link";
import {SignInButton, useAuth} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import ChartContainer from "@/components/ui/chart-container";

export const Poll = () => {
  const { isSignedIn } = useAuth();
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
    <div className="text-black font-bold py-4 text-center space-y-4">
        <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
            <h1>Global Referendum on War and Disease</h1>
        </div>
        <div id="poll-description">
            <div className="text-sm md:text-xl px-4 pb-2">
                Humanity has a finite amount of brains and resources.
            </div>
            <div className="text-sm md:text-xl px-4 pb-4">
                Please adjust the slider to indicate how much governments globally should allocate to war and
                the military vs helping the 2 billion people suffering from chronic diseases (like my Grandma Kay).
            </div>
        </div>
        <div id="chart-and-slider-container" className="px-4 lg:px-8">
            <ChartContainer warPercentageDesired={warPercentageDesired}/>
            <Input type="range" min="0" max="100" value={researchPercentageDesired.toString()}
                   onChange={handleSliderChange}/>
            <div>
                <span style={{float: 'left'}}>👈 More War</span>
                <span style={{float: 'right'}}>More Cures 👉</span>
            </div>
        </div>

        <div>
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                <Button
                    //onClick={() => handleClick()}
                    className="text-xl p-6 md:p-8 rounded-full font-semibold bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black mt-8"
                >
                    Vote to See Results
                </Button>
            </Link>
            {!isSignedIn && (
                <>
                    <div className="text-xs px-4 pt-4">
                        It&apos;s necessary to sign in to ensure electoral integrity.
                    </div>
                    <div className="text-xs px-4 py-0">
                        Robots don&apos;t get to vote!
                    </div>
                </>)
            }
        </div>
    </div>
);
};

