import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { DonorButton } from "@/components/donor-button";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
  const isDonor = await checkSubscription();

  return ( 
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isDonor ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <DonorButton isDonor={isDonor} />
      </div>
    </div>
   );
}
 
export default SettingsPage;

