"use client"

import React, { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"

const sentences = [
  "<span class='uppercase font-bold'>SAY YOU WANT TO SOLVE</span> a<br>" +
  "<span class='text-5xl md:text-7xl font-extrabold text-yellow-400 animate-pulse'>REALLY BIG</span>" +
  "<br> problem like:<br><br>" +
  "<ul class='list-none space-y-2 text-left'>" +
  "<li>🧠 <em class='hover:text-red-500 transition-colors duration-300 cursor-pointer'>Dementia</em></li>" +
  "<li>⏳ <em class='hover:text-green-500 transition-colors duration-300 cursor-pointer'>Aging</em></li>" +
  "<li>🐾 <em class='hover:text-blue-500 transition-colors duration-300 cursor-pointer'>Chronic Pain</em></li>" +
  "</ul>",

  "🤔 What's the <strong class='text-yellow-300 animate-pulse'>MOST EFFICIENT</strong> thing <u class='hover:text-pink-400 transition-colors duration-300 cursor-pointer'>YOU</u> can do with your:<br><br>" +
  "<ul class='list-none space-y-2 text-left'>" +
  "<li>⏰ Time</li>" +
  "<li>🔧 Skills</li>" +
  "<li>💼 Resources</li>" +
  "</ul><br>" +
  "...to solve it?",

  "It's IMPOSSIBLE to know because there are:<br><br>" +
  "<ul class='list-none space-y-2 text-left'>" +
  "<li>🌐 <span class='text-red-500 hover:animate-bounce inline-block'>THOUSANDS</span> of problems</li>" +
  "<li>💡 <span class='text-green-500 hover:animate-bounce inline-block'>THOUSANDS</span> of potential solutions</li>" +
  "<li>🔨 <span class='text-blue-500 hover:animate-bounce inline-block'>BILLIONS</span> of tasks to implement them</li>" +
  "</ul>",

  "🧠 Our caveman brains can only <strong class='text-purple-400 relative group'>REMEMBER SEVEN THINGS" +
  "<span class='invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs rounded px-2 py-1'>" +
  "Limited capacity!</span></strong> in working memory at a time.",

  "To have a chance in hell of figuring out the " +
  "<em class='text-orange-400 hover:underline cursor-pointer animate-bounce'>" +
  "optimal action</em> for solving" +
  " a <span class='text-yellow-400 font-extrabold animate-pulse'>" +
  "MASSIVE GLOBAL PROBLEM" +
  "</span>, we need...<br><br>",
];

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
          {isClient ? (
            <p
              className="glitch-text relative z-10 max-w-4xl font-mono text-3xl md:text-5xl"
              dangerouslySetInnerHTML={{ __html: sentence }}
            />
          ) : (
            <p className="glitch-text relative z-10 max-w-4xl font-mono text-3xl md:text-5xl">
              Running societal optimization algorithm...  Please wait...
            </p>
          )}
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