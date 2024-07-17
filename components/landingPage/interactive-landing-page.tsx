"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";


const globalProblems = [
    { emoji: '🧠', problem: 'Dementia', color: 'red' },
    { emoji: '🦠', problem: 'Cancer', color: 'pink' },
    { emoji: "🐭", problem: "Animal Suffering", color: "blue" },
    { emoji: "😢", problem: "Mental Illness", color: "emerald" },
    { emoji: '😖', problem: 'Chronic Pain', color: 'blue' },
    { emoji: '💀', problem: 'Death', color: 'green' },
    { emoji: '💊', problem: 'Drug Addiction', color: 'pink' },
    { emoji: '🏚️', problem: 'Homelessness', color: 'brown' },
    { emoji: '🍽️', problem: 'World Hunger', color: 'yellow' },
    { emoji: '💣', problem: 'War', color: 'gray' },
    { emoji: '🌊', problem: 'Water Scarcity', color: 'teal' },
    { emoji: '🏭', problem: 'Pollution', color: 'lime' },
    { emoji: '🧬', problem: 'Genetic Diseases', color: 'emerald' }
];

export const Sentence1 = () => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % globalProblems.length);
        }, 700); 

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <span className='uppercase font-bold'>SAY YOU WANT TO SOLVE</span> a<br />
            <span className='text-5xl md:text-7xl font-extrabold text-yellow-400 animate-pulse'>REALLY BIG</span>
            <br /> problem like:<br /><br />
            <ul className='list-none space-y-2 text-left'>
                {globalProblems.map((problem, index) => (
                    <li
                        key={index}
                        className={`transition-opacity duration-500 ${index === currentProblemIndex ? 'opacity-100' : 'opacity-0 hidden'}`}
                    >
                        {problem.emoji} <em className={`hover:text-${problem.color}-500 transition-colors duration-300 cursor-pointer`}>{problem.problem}</em>
                    </li>
                ))}
            </ul>
        </>
    );
};

const Sentence2 = () => (
    <>
      🤔 What's the <strong className='text-yellow-300 animate-pulse'>MOST EFFICIENT</strong> thing <u className='hover:text-pink-400 transition-colors duration-300 cursor-pointer'>YOU</u> can do with your:<br /><br />
      <ul className='list-none space-y-2 text-left'>
        <li>⏰ Time</li>
        <li>🔧 Skills</li>
        <li>💼 Resources</li>
      </ul><br />
      ...to solve it?
    </>
);

const Sentence3 = () => (
    <>
      It's IMPOSSIBLE to know! There are:<br /><br />
      <ul className='list-none space-y-2 text-left'>
        <li>🌐 <span className='text-red-500 hover:animate-bounce inline-block'>THOUSANDS</span> of problems</li>
        <li>💡 <span className='text-green-500 hover:animate-bounce inline-block'>THOUSANDS</span> of potential solutions</li>
        <li>🔨 <span className='text-blue-500 hover:animate-bounce inline-block'>BILLIONS</span> of tasks to implement them</li>
      </ul>
    </>
);

const Sentence4 = () => (
  <>
    🧠 Our caveman brains can only{" "}
    <strong className="group relative text-purple-400">
      REMEMBER SEVEN THINGS
      <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-purple-600 px-2 py-1 text-xs text-white group-hover:visible">
        Limited capacity!
      </span>
    </strong>{" "}
    in working memory at a time.
  </>
)

const WhatWeNeedToKnow = () => (
    <>
        So we have much less than{" "}
        <span className="animate-pulse font-extrabold text-yellow-400">
      1% of the information
    </span>{" "}
        we need to know to figure out the best thing to do!
        <div className="relative mx-auto h-64 w-64 mt-4">
            {/* Large circle - Everything We Need to Know */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-blue-500 dark:bg-blue-700">
              <span className="text-3xl font-bold text-white dark:text-gray-200 text-center uppercase">
                All Relevant Information
              </span>

                {/* Small circle - What We Know */}
                <div
                    className="absolute"
                    style={{ top: "20%", left: "20%" }}
                >
                    <div className="absolute left-5 -top-5 whitespace-nowrap">
                      <span className="text-sm">
                        🟡 👈 What We Know
                      </span>
                    </div>
                </div>
            </div>
        </div>
    </>
)


const Sentence5 = () => (
  <>
    Even if we knew what to do, solving global problems requires that a{" "}
    <span className="animate-bounce cursor-pointer text-green-400 hover:underline">
      LOT OF PEOPLE
    </span>{" "}
    know what to do and do it, too.
    <br />
    <br />
    To have a chance in hell of actually solving{" "}
    <span className="animate-pulse font-extrabold text-yellow-400">
      MASSIVE GLOBAL PROBLEMS
    </span>
    , we need...
    <br />
    <br />
  </>
)

const sentences = [
    Sentence1, Sentence2, Sentence3, Sentence4,
    WhatWeNeedToKnow,
    Sentence5]

const InteractiveLandingPage = () => {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const newIndex = Math.floor(scrollPosition / windowHeight)
      if (newIndex !== currentSentence && newIndex < sentences.length) {
        setCurrentSentence(newIndex)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentSentence])

  const scrollToNext = () => {
    const nextIndex = currentSentence + 1
    if (nextIndex < sentences.length) {
      const nextElement = document.getElementById(`sentence-${nextIndex}`)
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // For the last sentence, scroll down by a specific amount
      window.scrollBy({
        top: window.innerHeight, // Scroll by half the viewport height
        behavior: 'smooth'
      })
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {sentences.map((SentenceComponent, index) => (
        <div
          key={index}
          id={`sentence-${index}`}
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="bg-grid-pattern animate-grid h-full w-full"></div>
          </div>
          <div className="glitch-text relative z-10 max-w-4xl font-mono text-3xl md:text-5xl">
            <SentenceComponent />
          </div>
          <button
            onClick={() => scrollToNext()}
            className="mt-8 animate-pulse rounded-full border-2 border-white p-3 transition-colors hover:bg-white hover:text-black"
          >
            <ArrowDown size={32} />
          </button>
        </div>
      ))}

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
        }

        .animate-grid {
          animation: gridMove 20s linear infinite;
        }

        .glitch-text {
          text-shadow:
            0.03em 0 0 rgba(255, 0, 0, 0.5),
            -0.02em -0.03em 0 rgba(0, 255, 0, 0.5),
            0.02em 0.03em 0 rgba(0, 0, 255, 0.5);
          animation: glitch 3s infinite;
        }

        @keyframes glitch {
          0%, 100% {
            text-shadow:
              0.03em 0 0 rgba(255, 0, 0, 0.5),
              -0.02em -0.03em 0 rgba(0, 255, 0, 0.5),
              0.02em 0.03em 0 rgba(0, 0, 255, 0.5);
          }
          25% {
            text-shadow:
              -0.03em 0.01em 0 rgba(255, 0, 0, 0.5),
              0.02em -0.02em 0 rgba(0, 255, 0, 0.5),
              -0.02em 0.03em 0 rgba(0, 0, 255, 0.5);
          }
          50% {
            text-shadow:
              0.02em 0.03em 0 rgba(255, 0, 0, 0.5),
              0.03em 0 0 rgba(0, 255, 0, 0.5),
              0 -0.03em 0 rgba(0, 0, 255, 0.5);
          }
          75% {
            text-shadow:
              -0.02em 0 0 rgba(255, 0, 0, 0.5),
              -0.02em -0.02em 0 rgba(0, 255, 0, 0.5),
              -0.02em -0.03em 0 rgba(0, 0, 255, 0.5);
          }
        }
      `}</style>
    </div>
  )
}

export default InteractiveLandingPage