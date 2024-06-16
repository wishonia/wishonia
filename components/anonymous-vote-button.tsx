"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { User } from "next-auth";
import {UserAuthForm} from "@/components/user/user-auth-form";

interface PollProps {
    user?: User;
}
export const AnonymousVoteButton: React.FC<PollProps> = ({ user }) => {
    if (user) {
        return null;
    }

    const [showModal, setShowModal] = useState(false);

    const handleVoteButtonClick = () => {
        const currentUrl = window.location.href;
        localStorage.setItem("returnUrl", currentUrl);
        setShowModal(true);
    };

    return (
        <div id="not-logged-in-container">
            <div id="vote-button" >
                <Button onClick={handleVoteButtonClick}
                    className="text-xl p-6 md:p-8 rounded-full font-semibold hover:border hover:border-black mt-2"
                >
                    Vote
                </Button>
            </div>
            <div className="">
                <div className="text-xs px-4 pt-4">
                    It's necessary to sign in to ensure electoral integrity. Robots don't get to vote!
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <UserAuthForm callbackUrl={window.location.href}/>
                </div>
            )}
        </div>
    );
};