"use client";

import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");
  const [boxAnimation, setBoxAnimation] = useState(false);

  useEffect(() => {
    // Start box animation after a short delay
    setTimeout(() => {
      setBoxAnimation(true);
    }, 300);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadComplete();
          }, 1000); // Slightly longer delay to allow the animation to complete
          return 100;
        }
        return next;
      });
    }, 200);

    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      {/* Logo container with expanding border animation */}
      <div className="relative mb-8">
        {/* The expanding box animation */}
        <div
          className={`absolute ${
            boxAnimation ? "w-full h-full" : "w-0 h-0"
          } border-white border-2 transition-all duration-1000 ease-in-out`}
          style={{
            transformOrigin: "top left",
          }}
        />
        <div
          className={`absolute ${
            boxAnimation ? "w-full h-full" : "w-0 h-0"
          } border-white border-2 transition-all duration-1000 ease-in-out`}
          style={{
            bottom: 0,
            right: 0,
            transformOrigin: "bottom right",
          }}
        />

        {/* The actual logo */}
        <div className="relative p-8">
          <div className="text-5xl md:text-6xl font-bold tracking-tighter leading-none">
            Dig
            <br />
            Drip
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
              animation: "float 10s infinite ease-in-out",
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, -30px) rotate(10deg);
          }
          50% {
            transform: translate(20px, 40px) rotate(-5deg);
          }
          75% {
            transform: translate(-30px, 20px) rotate(7deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
