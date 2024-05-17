import { Icons } from "./icons";

export const SpinningLoader = () => {
  return (
      <main className="flex justify-center p-8">
          <Icons.spinner className="animate-spin text-4xl"/>
      </main>
  );
};
