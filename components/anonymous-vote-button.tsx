"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import {User} from "next-auth";

interface PollProps {
    user?: User;
}
export const AnonymousVoteButton: React.FC<PollProps> = ({ user }) => {
    if (user) {
        return null;
    }
    return (
        <div id="not-logged-in-container">
            <Link id="vote-button" href="/signup">
                <Button
                    className="text-xl p-6 md:p-8 rounded-full font-semibold hover:border hover:border-black mt-2"
                >
                    Vote
                </Button>
            </Link>
            <div className="">
                <div className="text-xs px-4 pt-4">
                    It's necessary to sign in to ensure electoral integrity. Robots don't get to vote!
                </div>
            </div>
        </div>
    );
};