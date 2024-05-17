"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {User} from "next-auth";
import {postVoteData} from "@/lib/api/postVoteData";

interface PollProps {
    user?: User;
    data: object;
    onButtonClick?: () => void;
}
export const LoggedInVoteButton: React.FC<PollProps> = ({ user, data, onButtonClick }) => {
    if (!user) {
        return null;
    }
    const handleClick = () => {
        //debugger
        postVoteData()
        if (onButtonClick) {
            onButtonClick();
        }

    };
    return (
        <Button id="logged-in-vote-button"
                onClick={handleClick}
                className="text-xl p-6 md:p-8 rounded-full font-semibold hover:border hover:border-black mt-2"
        >
            Vote
        </Button>
    );
};