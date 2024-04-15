import type { Metadata } from "next";
import { VotersList } from "./VotersList";

import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Voter list",
  description: "All Voters",
};

export default function VotersPage() {
  return (
    <div className="container py-20">
      <VotersList />
    </div>
  );
}
