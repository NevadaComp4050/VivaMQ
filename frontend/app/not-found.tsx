"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [starCount, setStarCount] = useState(100);
  const [stars, setStars] = useState<
    { x: number; y: number; opacity: number }[]
  >([]);

  useEffect(() => {
    const newStars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random(),
    }));
    setStars(newStars);
  }, [starCount]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            width: "2px",
            height: "2px",
            animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
          }}
        />
      ))}

      {/* Astronaut SVG */}
      <svg
        className="w-64 h-64 mb-8 animate-float"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M250 470C370.457 470 468 372.457 468 252C468 131.543 370.457 34 250 34C129.543 34 32 131.543 32 252C32 372.457 129.543 470 250 470Z"
          fill="#1E293B"
        />
        <path
          d="M250 440C354.934 440 440 354.934 440 250C440 145.066 354.934 60 250 60C145.066 60 60 145.066 60 250C60 354.934 145.066 440 250 440Z"
          fill="#334155"
        />
        <path
          d="M250 410C338.366 410 410 338.366 410 250C410 161.634 338.366 90 250 90C161.634 90 90 161.634 90 250C90 338.366 161.634 410 250 410Z"
          fill="#475569"
        />
        <path
          d="M230 320C268.66 320 300 288.66 300 250C300 211.34 268.66 180 230 180C191.34 180 160 211.34 160 250C160 288.66 191.34 320 230 320Z"
          fill="#CBD5E1"
        />
        <path
          d="M260 290C282.091 290 300 272.091 300 250C300 227.909 282.091 210 260 210C237.909 210 220 227.909 220 250C220 272.091 237.909 290 260 290Z"
          fill="#94A3B8"
        />
        <path
          d="M290 260C295.523 260 300 255.523 300 250C300 244.477 295.523 240 290 240C284.477 240 280 244.477 280 250C280 255.523 284.477 260 290 260Z"
          fill="#F1F5F9"
        />
      </svg>

      {/* 404 Message */}
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8 text-center px-4">
        Oops! Looks like you've drifted into uncharted space.
        <br />
        This page is lost in the cosmic void.
      </p>

      {/* Return Home Button */}
      <Button
        variant="outline"
        size="lg"
        className="text-white border-white hover:bg-white hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Return to Earth
      </Button>
    </div>
  );
}
