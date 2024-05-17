"use client";
import React, { useState, useEffect } from "react";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {DataTable} from "@/components/data-table";
import {wishingWellColumns} from "@/components/wishing-well-columns";
import {WishingWell} from "@prisma/client";

interface PollProps {
  user?: User;
}

export const WishingWellsList: React.FC<PollProps> = ({ user }) => {
  const [wishingWells, setWishingWells] =
      useState<WishingWell[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchWishingWells = async () => {
    setLoading(true);
    const response = await fetch('/api/wishingWells');
    const data = await response.json();
    setWishingWells(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWishingWells();
  }, []);

  if (loading) {
    return <SpinningLoader />;
  }

  return (
      <>
        {/*<WishingWellsPieChart data={wishingWells}></WishingWellsPieChart>*/}
        <DataTable
          columns={wishingWellColumns}
          data={wishingWells}>
        </DataTable>
      </>
  );
};
