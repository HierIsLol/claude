import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

const LINES = [
  "TACoS gebaseerd sturen",
  "Of gewoon lekker, alles doen",
  "Overzicht van al je verkoopkanalen",
  "Meer zichtbaarheid voor dezelfde producten",
  "Hogere organische posities",
  "Volledig automatische campagnes",
];

// Each line occupies this many frames of "camera travel"
const FRAMES_PER_LINE = 60;
const HOLD_FRAMES = 20; // frames to hold on each line before moving
const TOTAL_FRAMES = LINES.length * FRAMES_PER_LINE;

// How many lines to show at once in perspective view
const PERSPECTIVE_DEPTH = 1200;

function Line({
  text,
  index,
  frame,
  totalLines,
}: {
  text: string;
  index: number;
  frame: number;
  totalLines: number;
}) {
  const { fps } = useVideoConfig();

  // Camera position in "line units" - how far we've traveled
  const cameraProgress = frame / FRAMES_PER_LINE;

  // Relative position of this line to camera (negative = behind, 0 = at camera, positive = ahead)
  const lineRelativePos = index - cameraProgress;

  // Z distance: lines ahead are positive, lines behind are negative
  // Map lineRelativePos to Z space
  const zPos = lineRelativePos * 280;

  // Opacity: fade in when approaching, fade out when passed
  const opacity = interpolate(
    lineRelativePos,
    [-0.4, -0.1, 0, 0.3, 1.5, 3],
    [0, 0.15, 1, 0.9, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale based on Z (perspective simulation on top of CSS perspective)
  const scale = interpolate(
    lineRelativePos,
    [-0.5, 0, 0.5, 1, 2, 4],
    [1.8, 1.05, 0.85, 0.7, 0.5, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Vertical position: lines spread out vertically based on distance
  // Lines far ahead appear near center, spread out as they approach
  const ySpread = interpolate(
    lineRelativePos,
    [0, 1, 2, 3, 4, 5],
    [0, 80, 140, 180, 210, 230],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Active line (currently at camera) gets dark color, others lighter
  const isActive = lineRelativePos > -0.3 && lineRelativePos < 0.3;
  const isPassed = lineRelativePos < -0.1;

  const colorValue = interpolate(
    lineRelativePos,
    [-0.3, 0, 0.5, 1.5],
    [180, 20, 80, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const color = isPassed
    ? `rgba(30, 45, 94, 0.12)`
    : isActive
    ? `rgb(30, 45, 94)`
    : `rgb(${colorValue}, ${colorValue + 20}, ${Math.min(colorValue + 60, 180)})`;

  // Font size varies with distance
  const fontSize = interpolate(
    lineRelativePos,
    [0, 0.5, 1, 2, 3],
    [52, 42, 34, 26, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fontWeight = isActive ? 700 : 500;

  // Blur for depth-of-field feel
  const blur = interpolate(
    Math.abs(lineRelativePos),
    [0, 0.2, 0.6, 1.5, 3],
    [0, 0, 1, 3, 6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translateX(-50%) translateY(calc(-50% + ${ySpread}px)) scale(${scale})`,
        opacity,
        color,
        fontSize,
        fontWeight,
        fontFamily:
          '"Avenir Next", "Avenir", "Nunito Sans", system-ui, -apple-system, sans-serif',
        letterSpacing: isActive ? "-0.02em" : "0em",
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        whiteSpace: "nowrap",
        transition: "none",
        willChange: "transform, opacity",
        textAlign: "center",
        lineHeight: 1.1,
      }}
    >
      {text}
    </div>
  );
}

function AccentLine({ frame }: { frame: number }) {
  const cameraProgress = frame / FRAMES_PER_LINE;
  const currentLineIndex = Math.floor(cameraProgress);
  const lineProgress = cameraProgress - currentLineIndex;

  const opacity = interpolate(lineProgress, [0, 0.1, 0.85, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(calc(-50% + 36px))",
        width: interpolate(lineProgress, [0, 0.3, 0.7, 1], [0, 60, 60, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        height: 3,
        borderRadius: 2,
        background:
          "linear-gradient(90deg, #4a7fe0, #6fa0ff)",
        opacity,
      }}
    />
  );
}

function ProgressDots({ frame }: { frame: number }) {
  const cameraProgress = frame / FRAMES_PER_LINE;
  const currentIndex = Math.min(
    Math.floor(cameraProgress),
    LINES.length - 1
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      {LINES.map((_, i) => {
        const progress = interpolate(
          cameraProgress - i,
          [-0.5, 0, 0.5],
          [0, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const isActive = i === currentIndex;
        const isPast = i < currentIndex;

        return (
          <div
            key={i}
            style={{
              width: isActive ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: isActive
                ? "#4a7fe0"
                : isPast
                ? "#c0cce8"
                : "#e0e5f0",
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid #1e2d5e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderTop: "2px solid #1e2d5e",
            borderRight: "2px solid #1e2d5e",
            transform: "rotate(45deg) translate(-2px, 2px)",
          }}
        />
      </div>
    </div>
  );
}

export function TextCameraAnimation() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Smooth camera progress with easing between lines
  const smoothFrame = interpolate(
    frame,
    [0, TOTAL_FRAMES],
    [0, TOTAL_FRAMES],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #f9f8f5 0%, #f0eee8 100%)",
        overflow: "hidden",
        fontFamily:
          '"Avenir Next", "Avenir", "Nunito Sans", system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Subtle background circles like Adpal */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(200, 210, 235, 0.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(220, 195, 185, 0.2)",
        }}
      />

      {/* Text lines with camera perspective */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {LINES.map((line, i) => (
          <Line
            key={i}
            text={line}
            index={i}
            frame={smoothFrame}
            totalLines={LINES.length}
          />
        ))}
        <AccentLine frame={smoothFrame} />
      </div>

      {/* Progress dots */}
      <ProgressDots frame={smoothFrame} />

      {/* Subtle logo mark */}
      <Logo />
    </AbsoluteFill>
  );
}
