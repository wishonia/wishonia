import {SignIn, SignInButton} from "@clerk/nextjs";

export default function Page() {
  return (
      <div>
        <h1>Are you a damn robot?</h1>
        <SignInButton>
          <button>Please sign in to submit your vote and see results</button>
        </SignInButton>
      </div>
  );
  //return <SignIn />;
}