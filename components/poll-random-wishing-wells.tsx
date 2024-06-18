"use client";
import React, { useState, useEffect } from "react";
import {PollSpecificWishingWells} from "@/components/poll-specific-wishing-wells";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {useRouter} from "next/navigation";

interface PollProps {
    user?: User;
}

export const PollRandomWishingWells: React.FC<PollProps> = ({ user }) => {
    const [wishingWells, setWishingWells] =
        useState<{ thisWishingWell?: any; thatWishingWell?: any }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const fetchWishingWells = async () => {
        setLoading(true);
        const response = await fetch('/api/wishingWellPairAllocation/random');
        const data = await response.json();
        if(!data.thisWishingWell){
            router.push('/wishingWells/results');
            return;
        }
        if(!data.thatWishingWell){
            router.push('/wishingWells/results');
            return;
        }
        setWishingWells(data);
        setLoading(false);
    };

    useEffect(() => {
        if (!loading) {
            fetchWishingWells();
        }
    }, []);

    if (loading || !wishingWells.thisWishingWell || !wishingWells.thatWishingWell) {
        return <SpinningLoader />;
    }

    return (
        <PollSpecificWishingWells thisWishingWell={wishingWells.thisWishingWell}
                                    thatWishingWell={wishingWells.thatWishingWell}
                                    updatePair={fetchWishingWells}
                                    user={user} />
    );
};
