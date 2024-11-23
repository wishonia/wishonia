const insights = [
  {
    text: "If a child asks 'Why does it rain?', tell them 'It's because God is crying'. And if the child asks 'Why is God crying?', tell them 'Probably because of something you did.'",
  },
  {
    text: `One thing kids like is to be tricked. For instance, I was going to take my little nephew to Disneyland, but instead I drove him to an old burned-out warehouse. "Oh, no," I said, "Disneyland burned down." He cried and cried, but I think that deep down he thought it was a pretty good joke. I started to drive over to the real Disneyland, but it was getting pretty late`,
  },
  {
    text: "If trees could scream, would we be so cavalier about cutting them down? We might, if they screamed all the time, for no good reason.",
  },
  {
    text: `It's sad that a family can be torn apart by something as simple as wild dogs.`,
  },
  {
    text: "War is stupid.",
  },
]

export default function Loading() {
  const randomQuote = insights[Math.floor(Math.random() * insights.length)]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="flex max-w-xl flex-col items-center gap-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <div className="space-y-3">
          <p className="font-serif text-xl italic text-slate-100">
            {randomQuote.text}
          </p>
        </div>
      </div>
    </div>
  )
}
