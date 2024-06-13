"use client";
import React, { useState, useEffect } from "react";
import {User} from "next-auth";
import {SpinningLoader} from "@/components/spinningLoader";
import {DataTable} from "@/components/data-table";
import {globalProblemSolutionColumns} from "@/components/global-problem-solution-columns";
import {GlobalProblemSolution} from "@prisma/client";

interface PollProps {
  user?: User;
    globalProblemId: string;
}

export const GlobalProblemSolutionsList: React.FC<PollProps> = ({ globalProblemId, user }) => {
  const [globalProblemSolutions, setGlobalProblemSolutions] =
      useState<GlobalProblemSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchGlobalProblemSolutions = async (globalProblemId: string) => {
    setLoading(true);
    const response = await fetch('/api/globalProblems/' + globalProblemId + '/solutions');
    const data = await response.json();
    setGlobalProblemSolutions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGlobalProblemSolutions(globalProblemId);
  }, [globalProblemId]);

  if (loading) {
    return <SpinningLoader />;
  }

  return (
      <>
        {/*<GlobalProblemSolutionsPieChart data={globalProblemSolutions}></GlobalProblemSolutionsPieChart>*/}
        <DataTable
            columns={globalProblemSolutionColumns}
            data={globalProblemSolutions}>
        </DataTable>
      </>
  );
};
