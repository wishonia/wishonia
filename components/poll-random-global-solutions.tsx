"use client";
import React, { useState, useEffect } from "react";
import {PollSpecificGlobalSolutions} from "@/components/poll-specific-global-solutions";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {useRouter} from "next/navigation";

interface PollProps {
    user?: User;
}

export const PollRandomGlobalSolutions: React.FC<PollProps> = ({ user }) => {
    const [globalSolutions, setGlobalSolutions] =
        useState<{ thisGlobalSolution?: any; thatGlobalSolution?: any }>({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const fetchGlobalSolutions = async () => {
        setLoading(true);
        const response = await fetch('/api/globalSolutionPairAllocation/random');
        const data = await response.json();
        if(!data.thisGlobalSolution){
            router.push('/globalSolutions/results');
            return;
        }
        if(!data.thatGlobalSolution){
            router.push('/globalSolutions/results');
            return;
        }
        setGlobalSolutions(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGlobalSolutions();
    }, []);

    if (loading) {
        return <SpinningLoader />;
    }

    return (
        <PollSpecificGlobalSolutions thisGlobalSolution={globalSolutions.thisGlobalSolution}
                            thatGlobalSolution={globalSolutions.thatGlobalSolution}
                            updatePair={fetchGlobalSolutions}
                            user={user} />
    );
};
