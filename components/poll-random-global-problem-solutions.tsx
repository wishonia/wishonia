"use client";
import React, { useState, useEffect } from "react";
import {PollSpecificGlobalProblemSolutions} from "@/components/poll-specific-global-problem-solutions";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {useRouter} from "next/navigation";

interface PollProps {
    user?: User;
    globalProblemId: string;
}

export const PollRandomGlobalProblemSolutions: React.FC<PollProps> = ({ globalProblemId, user }) => {
    const [globalProblemSolutions, setGlobalProblemSolutions] =
        useState<{ thisGlobalProblemSolution?: any; thatGlobalProblemSolution?: any }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const fetchGlobalProblemSolutions = async () => {
        setLoading(true);
        const response = await fetch('/api/globalProblems/' + globalProblemId + '/solutions/random');
        const data = await response.json();
        if(!data.thisGlobalProblemSolution){
            router.push('/globalProblemSolutions/results');
            return;
        }
        if(!data.thatGlobalProblemSolution){
            router.push('/globalProblemSolutions/results');
            return;
        }
        setGlobalProblemSolutions(data);
        setLoading(false);
    };

    useEffect(() => {
        if(!loading){
            fetchGlobalProblemSolutions();
        }
    }, []);

    if (loading || !globalProblemSolutions.thisGlobalProblemSolution ||
        !globalProblemSolutions.thatGlobalProblemSolution) {
        return <SpinningLoader />;
    }

    return (
        <PollSpecificGlobalProblemSolutions thisGlobalProblemSolution={globalProblemSolutions.thisGlobalProblemSolution}
                            thatGlobalProblemSolution={globalProblemSolutions.thatGlobalProblemSolution}
                            updatePair={fetchGlobalProblemSolutions}
                            user={user} />
    );
};
