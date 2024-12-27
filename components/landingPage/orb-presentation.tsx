"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

export interface Slide {
  id: number;
  speech: string;
  component?: React.ReactNode;
}

interface OrbPresentationProps {
  slides: Slide[];
}

const OrbPresentation: React.FC<OrbPresentationProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPresentationStarted, setIsPresentationStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const source = useRef<MediaStreamAudioSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    setCanvasSizes();
    window.addEventListener('resize', setCanvasSizes);

    return () => {
      window.removeEventListener('resize', setCanvasSizes);
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
      if (source.current) {
        source.current.disconnect();
      }
    };
  }, []);

  const setCanvasSizes = useCallback(() => {
    if (canvasRef.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasSize({ width, height });
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, []);

  const initializeAudioContext = async () => {
    console.log("Initializing audio context...");
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.smoothingTimeConstant = 0.97;
      analyser.current.fftSize = 1024;
      setStep(analyser.current.fftSize / 16);
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      source.current = audioContext.current.createMediaStreamSource(mediaStream);
      if (analyser.current) {
        source.current.connect(analyser.current);
      }
      console.log("Audio context initialized successfully");
    } catch (error) {
      console.error("Error initializing audio context:", error);
      throw error;
    }
  };

  const startPresentation = async () => {
    console.log("Starting presentation...");
    try {
      await initializeAudioContext();
      setIsPresentationStarted(true);
      setIsPlaying(true);
      speakText(slides[currentSlide].speech);
      console.log("Presentation started successfully");
    } catch (error) {
      console.error("Error starting presentation:", error);
    }
  };

  const speakText = async (text: string) => {
    console.log("Speaking text:", text);
    if (!audioContext.current) {
      console.error("AudioContext not initialized");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Set British female voice
    const voices = window.speechSynthesis.getVoices();
    const britishFemaleVoice = voices.find(voice => voice.lang === 'en-GB' && voice.name.includes('Female'));
    if (britishFemaleVoice) {
      utterance.voice = britishFemaleVoice;
    } else {
      console.warn('British female voice not found. Using default voice.');
    }

    utterance.onend = () => {
      console.log("Speech ended");
      setIsPlaying(false);
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setCurrentSlide(0);
      }
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPresentationStarted) {
      speakText(slides[currentSlide].speech);
    }
  }, [currentSlide, isPresentationStarted]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (analyser.current && dataArray.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvasSize;
        const w2 = width / 2;
        const h2 = height / 2;
        const h3 = height / 3;
        const h4 = height / 4;

        const frequencyData = new Uint8Array(analyser.current.frequencyBinCount);
        const waveData = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(frequencyData);
        analyser.current.getByteTimeDomainData(waveData);

        ctx.strokeStyle = `hsl(${byteToNum(frequencyData[0], 1000, 3600)}, 90%, 60%)`;
        ctx.fillStyle = 'hsla(250,10%,10%,0.09)';
        ctx.fillRect(0, 0, width, height);

        // Draw lines
        ctx.beginPath();
        for (let i = 0; i < frequencyData.length; i++) {
          ctx.lineTo(
            Math.sin(frequencyData[i * step] / 20) * h3 + w2,
            Math.cos(frequencyData[i * step] / 20) * h3 + h2
          );
        }
        ctx.closePath();
        ctx.stroke();

        // Draw circles
        for (let i = 0; i < frequencyData.length; i++) {
          ctx.beginPath();
          ctx.arc(
            w2,
            h2,
            byteToNum(waveData[i * step] + frequencyData[i * step], h4, h3),
            0,
            Math.PI * 2
          );
          ctx.closePath();
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, canvasSize, step]);

  // Add this effect to ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const byteToNum = (byte: number, min: number, max: number) => {
    const hue = (byte / 128) * (max - min) + min;
    return Math.round(hue);
  };

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.pause();
    }
  };

  const handleSkip = () => {
    window.speechSynthesis.cancel();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(slides.length - 1);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {!isPresentationStarted ? (
          <div className="flex-grow flex items-center justify-center">
            <button
              onClick={() => {
                console.log("Button clicked");
                startPresentation();
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold text-xl hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Start Presentation
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow flex items-center justify-center">
              {slides[currentSlide].component && slides[currentSlide].component}
            </div>
            <div className="text-center text-white text-2xl font-bold p-4 bg-black bg-opacity-50">
              {slides[currentSlide].speech}
            </div>
            <div className="flex justify-center space-x-4 p-4 bg-black bg-opacity-50">
              <button onClick={handleBack} className="text-white hover:text-blue-500 transition-colors">
                <FaStepBackward size={24} />
              </button>
              <button onClick={handlePausePlay} className="text-white hover:text-blue-500 transition-colors">
                {isPaused ? <FaPlay size={24} /> : <FaPause size={24} />}
              </button>
              <button onClick={handleSkip} className="text-white hover:text-blue-500 transition-colors">
                <FaStepForward size={24} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrbPresentation;