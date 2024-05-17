"use client";
import React from "react";
import {GlobalProblem, GlobalProblemPairAllocation} from "@prisma/client";
import {User} from "next-auth";
import {PollSpecificGeneral} from "@/components/poll-specific-general";

interface PollProps {
    thisGlobalProblem: GlobalProblem;
    thatGlobalProblem: GlobalProblem;
    updatePair?: () => void;
    user?: User
}

export const PollSpecificGlobalProblems: React.FC<PollProps> = ({ thisGlobalProblem,
                                                            thatGlobalProblem,
                                                            updatePair, user }) => {

    const getGlobalProblemName = (item: {
        name: string;
    }) => "Solving " + item.name;

    const getGlobalProblemImage = (item: {
        featuredImage: string | null;
    }) => item.featuredImage || "";

    const createGlobalProblemAllocation = (
        thisGlobalProblemId: string,
        thatGlobalProblemId: string,
        thisGlobalProblemPercentage: number
    ) => {
        const allocation: Partial<GlobalProblemPairAllocation> = {
            thisGlobalProblemId,
            thatGlobalProblemId,
            thisGlobalProblemPercentage,
        };
        localStorage.setItem("globalProblemPairAllocation", JSON.stringify(allocation));
    };

    return (
        <PollSpecificGeneral
            thisItem={thisGlobalProblem}
            thatItem={thatGlobalProblem}
            updatePair={updatePair}
            user={user}
            getItemName={getGlobalProblemName}
            getItemImage={getGlobalProblemImage}
            createAllocation={createGlobalProblemAllocation}
        />
    );
};
