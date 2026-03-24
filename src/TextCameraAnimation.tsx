import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

const LINES = [
  "Volledig automatische campagnes",
  "Hogere organische posities",
  "Meer zichtbaarheid voor dezelfde producten",
  "Overzicht van al je verkoopkanalen",
  "TACoS gebaseerd sturen",
  "Of lekker AdPal alles laten doen",
];

// Faster: 42 frames per line
const FRAMES_PER_LINE = 42;
const TOTAL_FRAMES = LINES.length * FRAMES_PER_LINE;

// Animated blobs that scale/move with camera parallax
function Blob({
  frame,
  baseX,
  baseY,
  size,
  color,
  zDepth, // 0 = same speed as camera, 1 = slow (far), -1 = fast (close)
}: {
  frame: number;
  baseX: number; // % from left
  baseY: number; // % from top
  size: number;
  color: string;
  zDepth: number;
}) {
  const cameraProgress = frame / FRAMES_PER_LINE;

  // Parallax: blobs closer to camera move faster and scale up more
  const parallaxFactor = 1 - zDepth; // zDepth 0.8 = far/slow, 0.2 = close/fast
  const scaleDrive = cameraProgress * parallaxFactor;

  const scale = interpolate(scaleDrive, [0, LINES.length], [1, 1 + parallaxFactor * 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Drift slightly outward from center as camera approaches
  const cx = 50;
  const cy = 50;
  const driftX = (baseX - cx) * (scale - 1) * 0.6;
  const driftY = (baseY - cy) * (scale - 1) * 0.6;

  const opacity = interpolate(
    scaleDrive,
    [0, 0.3, LINES.length - 0.5, LINES.length],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${baseX + driftX}%`,
        top: `${baseY + driftY}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
      }}
    />
  );
}

function Line({
  text,
  index,
  frame,
  isLastLine,
}: {
  text: string;
  index: number;
  frame: number;
  isLastLine: boolean;
}) {
  const cameraProgress = frame / FRAMES_PER_LINE;
  const lineRelativePos = index - cameraProgress;

  const opacity = interpolate(
    lineRelativePos,
    [-0.35, -0.05, 0, 0.25, 1.4, 3],
    [0, 0.12, 1, 0.92, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    lineRelativePos,
    [-0.5, 0, 0.5, 1, 2, 4],
    [2.1, 1.08, 0.82, 0.66, 0.46, 0.28],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const ySpread = interpolate(
    lineRelativePos,
    [0, 1, 2, 3, 4, 5],
    [0, 88, 148, 190, 220, 242],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isActive = lineRelativePos > -0.3 && lineRelativePos < 0.3;
  const isPassed = lineRelativePos < -0.1;

  // Last line gets a special blue accent color when active
  const activeColor = isLastLine ? "#4a7fe0" : "rgb(30, 45, 94)";

  const colorValue = interpolate(
    lineRelativePos,
    [-0.3, 0, 0.5, 1.5],
    [185, 20, 75, 145],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const color = isPassed
    ? `rgba(30, 45, 94, 0.1)`
    : isActive
    ? activeColor
    : `rgb(${colorValue}, ${colorValue + 18}, ${Math.min(colorValue + 55, 175)})`;

  const fontSize = interpolate(
    lineRelativePos,
    [0, 0.5, 1, 2, 3],
    [54, 42, 33, 25, 19],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const blur = interpolate(
    Math.abs(lineRelativePos),
    [0, 0.15, 0.55, 1.5, 3],
    [0, 0, 1.5, 4, 7],
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
        fontWeight: isActive ? 700 : 500,
        fontFamily:
          '"Avenir Next", "Avenir", "Nunito Sans", system-ui, -apple-system, sans-serif',
        letterSpacing: isActive ? "-0.02em" : "0.01em",
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        whiteSpace: "nowrap",
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

  const opacity = interpolate(lineProgress, [0, 0.08, 0.82, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const width = interpolate(lineProgress, [0, 0.25, 0.75, 1], [0, 56, 56, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(calc(-50% + 40px))",
        width,
        height: 3,
        borderRadius: 2,
        background: "linear-gradient(90deg, #4a7fe0, #6fa0ff)",
        opacity,
      }}
    />
  );
}

function ProgressDots({ frame }: { frame: number }) {
  const cameraProgress = frame / FRAMES_PER_LINE;
  const currentIndex = Math.min(Math.floor(cameraProgress), LINES.length - 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 56,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      {LINES.map((_, i) => {
        const isActive = i === currentIndex;
        const isPast = i < currentIndex;
        return (
          <div
            key={i}
            style={{
              width: isActive ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: isActive ? "#4a7fe0" : isPast ? "#b8c8e6" : "#dde3f0",
            }}
          />
        );
      })}
    </div>
  );
}

export function TextCameraAnimation() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #f9f8f5 0%, #ede9e0 100%)",
        overflow: "hidden",
        fontFamily:
          '"Avenir Next", "Avenir", "Nunito Sans", system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Blue blob — top-left, far away (slow parallax) */}
      <Blob
        frame={frame}
        baseX={-8}
        baseY={10}
        size={680}
        color="rgba(180, 200, 240, 0.28)"
        zDepth={0.75}
      />
      {/* Orange/salmon blob — bottom-right, medium distance */}
      <Blob
        frame={frame}
        baseX={108}
        baseY={88}
        size={520}
        color="rgba(230, 180, 155, 0.28)"
        zDepth={0.55}
      />
      {/* Smaller blue blob — mid-right, closer (faster parallax) */}
      <Blob
        frame={frame}
        baseX={95}
        baseY={18}
        size={300}
        color="rgba(160, 190, 235, 0.18)"
        zDepth={0.3}
      />
      {/* Small orange blob — bottom-left, close */}
      <Blob
        frame={frame}
        baseX={5}
        baseY={90}
        size={240}
        color="rgba(235, 175, 145, 0.2)"
        zDepth={0.25}
      />

      {/* Text lines */}
      <div style={{ position: "absolute", inset: 0 }}>
        {LINES.map((line, i) => (
          <Line
            key={i}
            text={line}
            index={i}
            frame={frame}
            isLastLine={i === LINES.length - 1}
          />
        ))}
        <AccentLine frame={frame} />
      </div>

      <ProgressDots frame={frame} />
    </AbsoluteFill>
  );
}
