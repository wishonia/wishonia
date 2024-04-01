import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { donateModal } from "@/hooks/donate-modal";

export const SignatureCounter = ({
  isDonor = false,
  voteCount = 0,
}: {
  isDonor: boolean,
  voteCount: number
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = donateModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  

  if (isDonor) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              You've gotten {voteCount} votes so far.
            </p>
            <Progress className="h-3" value={(voteCount / MAX_FREE_COUNTS) * 100} />
          </div>
          <Button onClick={proModal.onOpen} variant="premium" className="w-full">
            Donate
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}