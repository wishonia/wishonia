import React, { useMemo } from "react"
import Link from "next/link"
import { Bot, LucideIcon, Network, Vote } from "lucide-react"

interface FeatureCardProps {
  Icon: LucideIcon
  title: string
  description: string
  listItems?: string[]
  buttonText: string
  path?: string
  className?: string
  imageUrl?: string // Optional image URL
  component?: React.ReactNode
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  Icon,
  title,
  description,
  listItems,
  buttonText,
  path,
  className,
  imageUrl,
  component,
}) => (
  <section className={`mb-16 border-4 border-black p-8 ${className}`}>
    <h2 className="mb-8 flex items-center text-4xl font-bold">
      <Icon size={48} className="mr-4" />
      {title}
    </h2>
    <p className="mb-4 text-xl">{description}</p>
    {listItems && listItems.length > 0 && (
      <ul className="mb-8 list-inside list-disc text-xl">
        {listItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )}
    {path && (
      <Link href={path}>
        <button className="border-4 px-8 py-4 text-xl transition-colors">
          {buttonText}
        </button>
      </Link>
    )}
    {imageUrl && (
      <img
        src={imageUrl}
        alt={title}
        className="mt-4 shadow-[5px_5px_rgba(0,0,0,0.8)]"
      />
    )}
    {component && component}
  </section>
)

const fdaiVimeoComponent = (
  <>
    <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
      <iframe
        src="https://player.vimeo.com/video/940591330?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
        title="FDAi - Let's Automate Clinical Research!"
      ></iframe>
    </div>
    <script src="https://player.vimeo.com/api/player.js"></script>
  </>
)

const ForkableWorldSection: React.FC = () => {
  const features = useMemo(
    () => [
      {
        Icon: Bot,
        title: "DIGITAL TWINS",
        description:
          "AI agents aligned to your goals, automating tasks and coordinating with 8 billion other digital twins. ",
        listItems: [
          // "Trained on your data and preferences",
          // "Work together to maximize health and happiness",
          // "Collaborate with other digital twins"
        ],
        buttonText: "TRAIN YOUR DIGITAL TWIN",
        //path: "/dashboard",
        imageUrl:
          "/assets/Digital Twin Knowledge Agent brains consuming existing data.jpg",
      },
      {
        Icon: Network,
        title: "POSITRON AGENTS",
        description:
          "Prosocial AI agents working to automate the production of public goods.",
        // listItems: [
        //     // "Represent organizations like FDAi",
        //     // "Automate and crowdsource clinical research",
        //     // "Maximize universal health and happiness"
        // ],
        buttonText: "EXPLORE POSITRON AGENTS",
        //path: "/positron-nodes"
        component: fdaiVimeoComponent,
      },
      {
        Icon: Vote,
        title: "WISHOCRACY",
        description:
          "Uses Aggregated Pairwise Preference Allocation (APPA) to " +
          "optimize scarce resource allocation to maximize universal wish fulfillment.",
        listItems: [
          //"A new system of governance based on collective intelligence.  ",
          //"Aggregated pairwise preference allocation",
          // "Uses Aggregated Pairwise Preference Allocation (APPA) to optimize scarce resources and maximize universal wish fulfillment.",
          //"Maximize universal wish fulfillment"
        ],
        buttonText: "PARTICIPATE IN WISHOCRACY",
        //path: "/wishocracy"
        imageUrl: "/assets/positron-city.jpg",
      },
    ],
    []
  )

  return (
      <div className="min-h-screen font-mono">
          <header className="p-4 sm:p-8 text-center">
              <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  A Decentralized Semi-Autonomous Todo List For Humanity
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl">
                  We want a system to optimize all human actions to maximize universal health and happiness of all
                  sentient
                  beings.
              </p>
          </header>
          <div className="p-4 sm:p-8 text-center">
              <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Here's the ingredients:
              </h1>
          </div>
          <main className="flex flex-col p-8 md:flex-row md:flex-wrap">
              {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} className="md:w-1/2 lg:w-1/3"/>
              ))}
          </main>
      </div>
  )
}

export default ForkableWorldSection
