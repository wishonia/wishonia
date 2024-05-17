import React, { useEffect, useState } from 'react';
import {WishingWell} from "@prisma/client";
import BarChartGeneral from "@/components/bar-chart-general";

interface BarChartProps {
    thisWishingWell: WishingWell;
    thatWishingWell: WishingWell;
    thisPercentageDesired?: number;
}

const BarChartWishingWells: React.FC<BarChartProps> = ({ thisWishingWell,
                                                           thatWishingWell,
                                                           thisPercentageDesired}) => {

    const getWishingWellName = (wishingWell: WishingWell) => wishingWell.name;
    const getWishingWellImage = (wishingWell: WishingWell) => wishingWell.featuredImage || "";

    return (
        <BarChartGeneral
            thisItem={thisWishingWell}
            thatItem={thatWishingWell}
            thisPercentageDesired={thisPercentageDesired}
            getItemName={getWishingWellName}
            getItemImage={getWishingWellImage}
        />
    );
};

export default BarChartWishingWells;