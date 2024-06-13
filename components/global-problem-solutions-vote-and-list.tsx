"use client";
import React, { useState, useEffect } from "react";
import {User} from "next-auth";
import {GlobalProblem} from "@prisma/client";
import {SpinningLoader} from "@/components/spinningLoader";
import {Shell} from "@/components/layout/shell";
import {DashboardHeader} from "@/components/pages/dashboard/dashboard-header";
import {PollRandomGlobalProblemSolutions} from "@/components/poll-random-global-problem-solutions";
import {GlobalProblemSolutionsList} from "@/components/global-problem-solutions-list";
interface PollProps {
    user?: User;
    globalProblemId: string;
}

export const GlobalProblemSolutionsVoteAndSolutionsList: React.FC<PollProps> = ({ globalProblemId, user }) => {
    const [globalProblem, setGlobalProblem] =
        useState<GlobalProblem>();
    const [loading, setLoading] = useState(true);


    const fetchGlobalProblem = async (globalProblemId: string) => {
        setLoading(true);
        const response = await fetch('/api/globalProblems/' + globalProblemId);
        const data = await response.json();
        setGlobalProblem(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGlobalProblem(globalProblemId);
    }, [globalProblemId]);

    if (loading || !globalProblem) {
        return <SpinningLoader />;
    }

    return (
        <Shell>
            <DashboardHeader
                heading={`Solutions for ${globalProblem.name}`}
                text={`Vote on the best solutions to ${globalProblem.name}!`}
            >
            </DashboardHeader>
            <PollRandomGlobalProblemSolutions globalProblemId={globalProblemId} user={user}>
            </PollRandomGlobalProblemSolutions>
            <GlobalProblemSolutionsList globalProblemId={globalProblemId}>
            </GlobalProblemSolutionsList>
        </Shell>
    )
};
