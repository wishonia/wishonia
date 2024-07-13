"use client"

import React, { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"

const sentences = [
  "Say you want to solve a very large problem like dementia, aging, animal suffering, etc.",
  "What's the most efficient thing YOU can do with your time, skills and resources to solve it?",
  "There are thousands of problems, with thousands of potential solutions, and billions of tasks required to implement them",
  "Our caveman brains can only seven things in working memory at a time",
  "To have any hope of figuring out the optimal action to take, we need a better system.",
  "This is the goal of Wishocracy",
]

const InteractiveLandingPage = () => {
  const [currentSentence, setCurrentSentence] = useState(0)

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
    const nextIndex = currentSentence + 1;
    const nextElement = document.getElementById(`sentence-${nextIndex}`);
    if (nextElement) {
      const nextPosition = nextElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: nextPosition,
        behavior: "smooth",
      });
    } else {
      // just scroll down so the bottom of the current view becomes the
      // top of the current view + the height of the current view
      window.scrollTo({
        top: window.scrollY + window.innerHeight,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {sentences.map((sentence, index) => (
        <div
          key={index}
          id={`sentence-${index}`}
          className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden p-8"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="bg-grid-pattern animate-grid h-full w-full"></div>
          </div>
          <p className="glitch-text relative z-10 max-w-4xl font-mono text-3xl md:text-5xl">
            {sentence}
          </p>
          {/* Conditionally render the button if it's not the last sentence */}
            <button
              onClick={() => scrollToNext()}
              className="animate-pulse mt-8 rounded-full border-2 border-white p-3 transition-colors hover:bg-white hover:text-black"
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
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 500ms infinite;
        }

        @keyframes glitch {
          0% {
            text-shadow:
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow:
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow:
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow:
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow:
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow:
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow:
              -0.025em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
      `}</style>
    </div>
  )
}

export default InteractiveLandingPage