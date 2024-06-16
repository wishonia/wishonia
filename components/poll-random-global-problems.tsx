"use client";
import React, { useState, useEffect } from "react";
import {PollSpecificGlobalProblems} from "@/components/poll-specific-global-problems";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {useRouter} from "next/navigation";

interface PollProps {
    user?: User;
}

export const PollRandomGlobalProblems: React.FC<PollProps> = ({ user }) => {
    const [globalProblems, setGlobalProblems] =
        useState<{ thisGlobalProblem?: any; thatGlobalProblem?: any }>({});
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const router = useRouter();
    const fetchGlobalProblems = async () => {
        setLoading(true);
        const response = await fetch('/api/globalProblemPairAllocation/random');
        const data = await response.json();
        if(!data.thisGlobalProblem){
            router.push('/globalProblems/results');
            return;
        }
        if(!data.thatGlobalProblem){
            router.push('/globalProblems/results');
            return;
        }
        setGlobalProblems(data);
        setLoading(false);
        setDataLoaded(true);
    };

    useEffect(() => {
        if (!dataLoaded) {
            fetchGlobalProblems();
        }
    }, [dataLoaded]);

    if (loading) {
        return <SpinningLoader />;
    }

    return (
        <PollSpecificGlobalProblems thisGlobalProblem={globalProblems.thisGlobalProblem}
                            thatGlobalProblem={globalProblems.thatGlobalProblem}
                            updatePair={fetchGlobalProblems}
                            user={user} />
    );
};
