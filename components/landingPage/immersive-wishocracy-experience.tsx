"use client"
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

interface Stage {
  text: string;
  subtext: string;
}

const stages: Stage[] = [
  { text: "Welcome to Wishocracy", subtext: "A new paradigm for global problem-solving" },
  { text: "What's your greatest wish for the world?", subtext: "Think big. Dream bigger." },
  { text: "Analyzing global impact...", subtext: "Connecting your wish to worldwide issues" },
  { text: "Global problems detected", subtext: "Your wish intersects with these challenges" },
  { text: "Initiating Wishocracy Protocol", subtext: "Optimizing global resources" },
  { text: "Synergy Achieved", subtext: "Your wish is now part of humanity's collective effort" },
  { text: "Welcome to the future", subtext: "Together, we can reshape reality" }
];

const WishocracyExperience: React.FC = () => {
  const [stage, setStage] = useState<number>(0);
  const [userWish, setUserWish] = useState<string>('');
  const [globalProblems, setGlobalProblems] = useState<string[]>([]);
  const [showAIPulse, setShowAIPulse] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const drawParticles = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (stage === 3) {
      setGlobalProblems(['Climate Change', 'Poverty', 'Disease', 'Education Inequality']);
    }
    if (stage === 4) {
      setShowAIPulse(true);
    }
  }, [stage]);

  const handleWishSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userWish) setStage(prev => prev + 1);
  };

  const handleNextStage = () => {
    setStage(prev => prev + 1);
  };

  return (
      <div className="relative h-screen w-screen bg-black text-green-400 font-mono overflow-hidden">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{stages[stage].text}</h1>
              <p className="text-xl mb-8">{stages[stage].subtext}</p>

              {stage === 1 && (
                  <form onSubmit={handleWishSubmit} className="mb-4">
                    <input
                        type="text"
                        value={userWish}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserWish(e.target.value)}
                        className="bg-transparent border-b-2 border-green-400 text-green-400 text-xl px-2 py-1 mb-4 w-full max-w-md"
                        placeholder="Enter your wish..."
                    />
                    <button type="submit" className="bg-green-400 text-black px-4 py-2 rounded">Submit</button>
                  </form>
              )}

              {stage === 3 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {globalProblems.map((problem, index) => (
                        <motion.div
                            key={problem}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-green-400 text-black p-2 rounded"
                        >
                          {problem}
                        </motion.div>
                    ))}
                  </div>
              )}

              {stage === 4 && showAIPulse && (
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute inset-0 bg-green-400 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
                      AI CORE
                    </div>
                  </div>
              )}

              {stage < stages.length - 1 && stage !== 1 && (
                  <button onClick={handleNextStage} className="bg-green-400 text-black px-4 py-2 rounded">
                    Continue
                  </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  );
};

export default WishocracyExperience;