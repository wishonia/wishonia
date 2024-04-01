import { LandingNavbar } from "@/components/landing-navbar";
import { Poll } from "@/components/poll";
import { LandingContent } from "@/components/landing-content";

const LandingPage = () => {
  return ( 
    <div className="h-full ">
      {/*<LandingNavbar />*/}
        <Poll />
      {/*<LandingContent />*/}
    </div>
   );
}
 
export default LandingPage;
