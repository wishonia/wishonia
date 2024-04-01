"use client";

import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";

export const DonorButton = ({
  isDonor = false
}: {
  isDonor: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant={isDonor ? "default" : "premium"} disabled={loading} onClick={onClick} >
      {isDonor ? "Manage Citizenship" : "Donate"}
      {!isDonor && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  )
};
