import React, { useEffect, useMemo, useState } from "react";

export default function BubbleWelcome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [moveImage, setMoveImage] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  const CIRCLE_FADE_MS = 2000;
  const BUFFER_MS = 200;
  const IMAGE_DELAY_MS = 800;
  const IMAGE_MOVE_DELAY_MS = 2200;
  const TAGLINE_DELAY_MS = 2500;

  // Circles configuration
  const baseCircles = [
    { top: "2rem", left: "2rem", size: "18rem" },
    { top: "-4rem", left: "16rem", size: "18rem" },
    { top: "-4rem", left: "26rem", size: "20rem" },
    { top: "4rem", left: "14rem", size: "20rem" },
    { top: "2rem", left: "28rem", size: "22rem" },
    { top: "6rem", right: "2rem", size: "24rem" },
    { top: "4rem", right: "1rem", size: "28rem" },
    { top: "-2rem", left: "50%", transform: "translateX(-50%)", size: "20rem" },
    { top: "22rem", left: "-6rem", size: "22rem" },
    { top: "22rem", right: "-6rem", size: "22rem" },
    { top: "16rem", left: "4rem", size: "20rem" },
    { top: "18rem", left: "20rem", size: "26rem" },
    { top: "16rem", right: "6rem", size: "24rem" },
    { bottom: "10rem", left: "4rem", size: "22rem" },
    { bottom: "-2rem", left: "22rem", size: "24rem" },
    { bottom: "4rem", right: "4rem", size: "22rem" },
    { top: "-6rem", left: "-2rem", size: "22rem" },
    { top: "-8rem", left: "8rem", size: "20rem" },
    { top: "-10rem", right: "-4rem", size: "26rem" },
    { top: "-6rem", right: "6rem", size: "22rem" },
    { top: "-2rem", right: "16rem", size: "20rem" },
    { top: "14rem", left: "-8rem", size: "24rem" },
    { top: "18rem", left: "-10rem", size: "30rem" },
    { top: "18rem", left: "0rem", size: "20rem" },
    { top: "20rem", left: "10rem", size: "18rem" },
    { top: "14rem", right: "-8rem", size: "24rem" },
    { top: "18rem", right: "-10rem", size: "30rem" },
    { top: "18rem", right: "0rem", size: "20rem" },
    { top: "20rem", right: "10rem", size: "18rem" },
  ];

  const fadeAnimations = [
    "animate-fade-out-top",
    "animate-fade-out-bottom",
    "animate-fade-out-left",
    "animate-fade-out-right",
  ];

  const colors = ["#76B13A", "#8CB662"];

  const circles = useMemo(() => {
    return baseCircles.map((c, i) => {
      const fadeAnim =
        fadeAnimations[Math.floor(Math.random() * fadeAnimations.length)];
      const delay = (Math.random() * 0.45).toFixed(2) + "s";
      const color = colors[i % colors.length];
      return { ...c, fadeAnim, delay, color };
    });
  }, []);

  // --- Sequence control ---
  useEffect(() => {
    const welcomeTimer = setTimeout(
      () => setShowWelcome(true),
      CIRCLE_FADE_MS + BUFFER_MS
    );
    const imageTimer = setTimeout(
      () => setShowImage(true),
      CIRCLE_FADE_MS + BUFFER_MS + IMAGE_DELAY_MS
    );
    const moveTimer = setTimeout(
      () => setMoveImage(true),
      CIRCLE_FADE_MS + BUFFER_MS + IMAGE_MOVE_DELAY_MS
    );
    const taglineTimer = setTimeout(
      () => setShowTagline(true),
      CIRCLE_FADE_MS + BUFFER_MS + TAGLINE_DELAY_MS
    );

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(imageTimer);
      clearTimeout(moveTimer);
      clearTimeout(taglineTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-white">
      {/* --- Circles --- */}
      <div className="absolute inset-0">
        {circles.map((circle, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${circle.fadeAnim}`}
            style={{
              width: circle.size,
              height: circle.size,
              top: circle.top,
              left: circle.left,
              right: circle.right,
              bottom: circle.bottom,
              transform: circle.transform,
              backgroundColor: circle.color,
              opacity: 0.95,
              animationDelay: circle.delay,
            }}
          />
        ))}
      </div>

      {/* --- WELCOME text --- */}
      {showWelcome && (
        <div className="flex flex-col items-center">
          <h1
            className="text-[#76B13A] text-6xl font-extrabold tracking-widest opacity-0 animate-fade-in mb-3"
            style={{
              animationDuration: "1s",
              animationFillMode: "forwards",
              zIndex: 50,
            }}
          >
            WELCOME
          </h1>

          {/* --- Tagline below --- */}
          {showTagline && (
            <p
              className="text-gray-600 text-base tracking-wide opacity-0 animate-fade-in text-center max-w-xl"
              style={{
                animationDuration: "1.2s",
                animationFillMode: "forwards",
                zIndex: 55,
              }}
            >
              Your cozy spot for handcrafted drinks and 
               <br />
              delicious treats, made with love.
            </p>
          )}
        </div>
      )}

      {/* --- MiAmoreWelcome.png image --- */}
      {showImage && (
        <img
          src="/images/MiAmoreWelcome.png"
          alt="MiAmore Welcome"
          className={`absolute transition-all duration-[1500ms] ease-in-out opacity-0 animate-fade-in ${
            moveImage
              ? "top-[1.5rem] right-[1.5rem] w-[90px]" // Final small top-right
              : "bottom-[58%] w-[300px]" // Starts above WELCOME
          }`}
          style={{
            animationDuration: "1s",
            animationFillMode: "forwards",
            zIndex: 60,
          }}
        />
      )}
      
    </div>

  );
}
