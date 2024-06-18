"use client";
import React, { useState, useEffect } from "react";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {DataTable} from "@/components/data-table";
import {globalSolutionColumns} from "@/components/global-solution-columns";
import {GlobalSolution} from "@prisma/client";

interface PollProps {
  user?: User;
}

export const GlobalSolutionsList: React.FC<PollProps> = ({ user }) => {
  const [globalSolutions, setGlobalSolutions] =
      useState<GlobalSolution[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchGlobalSolutions = async () => {
    setLoading(true);
    const response = await fetch('/api/globalSolutions');
    const data = await response.json();
    setGlobalSolutions(data);
    setLoading(false);
  };

  useEffect(() => {
    if(!loading){
      fetchGlobalSolutions();
    }
  }, []);

  if (loading || !globalSolutions || globalSolutions.length === 0) {
    return <SpinningLoader />;
  }

  return (
      <>
        {/*<GlobalSolutionsPieChart data={globalSolutions}></GlobalSolutionsPieChart>*/}
        <DataTable
          columns={globalSolutionColumns}
          data={globalSolutions}>
        </DataTable>
      </>
  );
};
