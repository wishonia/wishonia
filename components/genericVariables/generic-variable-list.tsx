"use client";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Icons } from "@/components/icons";

import { UserVariableItem } from "../userVariables/user-variable-item";
import { FC, useEffect, useState } from "react";
import { UserVariable } from "@/types/models/UserVariable";
import {GenericVariableAddButton} from "@/components/genericVariables/generic-variable-add-button";

type UserVariableListProps = {
  user: {
    id: string;
  };
  searchParams: {
    includePublic?: boolean | null;
    sort?: string | null;
    limit?: number | null;
    offset?: number | null;
    searchPhrase?: string | null;
  };
};

export const GenericVariableList: FC<UserVariableListProps> = ({ user, searchParams }) => {

  const [genericVariables, setGenericVariables] = useState<UserVariable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Ensure searchParams is an object
    const safeSearchParams = searchParams ?? {};

    // Construct query string from searchParams
    const queryParams = new URLSearchParams();
    Object.entries(safeSearchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    let url = `/api/dfda/variables${queryString ? `?${queryString}` : ''}`;
    if(!searchParams.includePublic){
      url = `/api/dfda/userVariables${queryString ? `?${queryString}` : ''}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(userVariables => {
        setGenericVariables(userVariables);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user variables:', error);
        setIsLoading(false); // Ensure loading is set to false even if there's an error
      });

  }, [user, searchParams]);

  return (
    <>
    {isLoading ? ( <div className="flex justify-center items-center">
    <Icons.spinner className="animate-spin text-4xl" /> </div>) : "" }
      {genericVariables?.length ? (
        <div className="flex flex-col"> {/* Add Tailwind classes here */}
          {genericVariables.map((userVariable) => (
            <UserVariableItem key={userVariable.id} userVariable={userVariable} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.activity className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>Get Started!</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Add a symptom, food or treatment to start tracking!
          </EmptyPlaceholder.Description>
          <GenericVariableAddButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </>
  )
}
