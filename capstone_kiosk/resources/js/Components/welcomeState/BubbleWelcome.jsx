import React, { useEffect, useMemo, useState } from "react";

export default function BubbleWelcome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const CIRCLE_FADE_MS = 2000; // must match Tailwind fade-out duration
  const BUFFER_MS = 200; // small gap between circle fade & WELCOME
  const IMAGE_DELAY_MS = 1000; // show image after WELCOME appears

const baseCircles = [
  // --- Existing circles ---
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

  // --- Lower half circles ---
  { top: "16rem", left: "4rem", size: "20rem" },
  { top: "18rem", left: "20rem", size: "26rem" },
  { top: "16rem", right: "6rem", size: "24rem" },
  { bottom: "10rem", left: "4rem", size: "22rem" },
  { bottom: "-2rem", left: "22rem", size: "24rem" },
  { bottom: "4rem", right: "4rem", size: "22rem" },

  // --- 🆕 Extra top-left / top-right richness ---
  { top: "-6rem", left: "-2rem", size: "22rem" },
  { top: "-8rem", left: "8rem", size: "20rem" },
  { top: "-10rem", right: "-4rem", size: "26rem" },
  { top: "-6rem", right: "6rem", size: "22rem" },
  { top: "-2rem", right: "16rem", size: "20rem" },

  // --- 🆕 NEW: Middle-left and middle-right enhancements ---
  { top: "14rem", left: "-8rem", size: "24rem" },  // far middle-left edge
  { top: "18rem", left: "-10rem", size: "30rem" },  // far middle-left edge

  { top: "18rem", left: "0rem", size: "20rem" },   // slightly inner left
  { top: "20rem", left: "10rem", size: "18rem" },  // balanced inner left
  { top: "14rem", right: "-8rem", size: "24rem" }, // far middle-right edge
    { top: "18rem", right: "-10rem", size: "30rem" }, // far middle-right edge
  { top: "18rem", right: "0rem", size: "20rem" },  // slightly inner right
  { top: "20rem", right: "10rem", size: "18rem" }, // balanced inner right
];


  // Fade animation classes from Tailwind
  const fadeAnimations = [
    "animate-fade-out-top",
    "animate-fade-out-bottom",
    "animate-fade-out-left",
    "animate-fade-out-right",
  ];

  // Colors
  const colors = ["#76B13A", "#8CB662"];

  // Assign fade animation + delay per circle once
  const circles = useMemo(() => {
    return baseCircles.map((c, i) => {
      const fadeAnim =
        fadeAnimations[Math.floor(Math.random() * fadeAnimations.length)];
      const delay = (Math.random() * 0.45).toFixed(2) + "s";
      const color = colors[i % colors.length];
      return { ...c, fadeAnim, delay, color };
    });
  }, []);

  // Sequence: fade circles → show WELCOME → show image
  useEffect(() => {
    const showWelcomeTimer = setTimeout(
      () => setShowWelcome(true),
      CIRCLE_FADE_MS + BUFFER_MS
    );

    const showImageTimer = setTimeout(
      () => setShowImage(true),
      CIRCLE_FADE_MS + BUFFER_MS + IMAGE_DELAY_MS
    );

    return () => {
      clearTimeout(showWelcomeTimer);
      clearTimeout(showImageTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-white">
      {/* --- Static Overlapping Circles --- */}
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
        <h1
          className="absolute bottom-[40%] text-[#76B13A] text-6xl font-extrabold tracking-widest opacity-0 animate-fade-in"
          style={{ animationDuration: "1s", animationFillMode: "forwards", zIndex: 50 }}
        >
          WELCOME
        </h1>
      )}

      {/* --- MiAmoreWelcome.png image --- */}
      {showImage && (
        <img
          src="/images/MiAmoreWelcome.png"
          alt="MiAmore Welcome"
          className="absolute top-[-10%] w-[320px] opacity-0 animate-fade-in"
          style={{ animationDuration: "1.2s", animationFillMode: "forwards", zIndex: 60 }}
        />
      )}
    </div>
  );
}

