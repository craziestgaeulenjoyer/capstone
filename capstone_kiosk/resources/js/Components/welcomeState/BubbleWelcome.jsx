import React, { useEffect, useState } from "react";

export default function BubbleWelcome() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(2), 2500), // After 2.5 seconds
      setTimeout(() => setStep(3), 4500), // After 4.5 seconds
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white overflow-hidden relative">
      {/* 1st View: Animated Bubbles */}
      {step === 1 && (
        <div className="absolute inset-0 bg-green-400 animate-bubble">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-green-500 opacity-70 animate-float"
              style={{
                width: `${100 + Math.random() * 150}px`,
                height: `${100 + Math.random() * 150}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* 2nd View: Welcome Text */}
      {step === 2 && (
        <h1 className="text-green-600 text-3xl font-semibold tracking-widest animate-fade-in">
          WELCOME
        </h1>
      )}

      {/* 3rd View: Logo + Welcome */}
      {step === 3 && (
        <div className="flex flex-col items-center animate-fade-in">
          <div className="text-green-500 text-6xl font-bold mb-2">m*</div>
          <h1 className="text-green-600 text-3xl font-semibold tracking-widest">
            WELCOME
          </h1>
        </div>
      )}
    </div>
  );
}