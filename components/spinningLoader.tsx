import GlobalBrainNetwork from "./landingPage/global-brain-network"

export const SpinningLoader = () => {
  return (
    <main className="flex justify-center p-8 w-full max-w-full">
      <div className="w-[300px] overflow-hidden p-2">
        <GlobalBrainNetwork />
      </div>
    </main>
  )
}
