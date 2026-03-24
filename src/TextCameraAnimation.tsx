import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
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

const FRAMES_PER_LINE = 42;
const TOTAL_FRAMES = LINES.length * FRAMES_PER_LINE;

// Stagger each line slightly off-center so camera "weaves" through them
const LINE_Y_OFFSETS = [0, 38, -28, 22, -36, 0];

// ─── Blobs ──────────────────────────────────────────────────────────────────

function Blob({
  frame,
  baseX,
  baseY,
  size,
  color,
  zDepth,
}: {
  frame: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  zDepth: number; // 1 = far/slow, 0 = close/fast
}) {
  const cam = frame / FRAMES_PER_LINE;
  const factor = 1 - zDepth;
  const drive = cam * factor;

  const scale = interpolate(drive, [0, LINES.length], [1, 1 + factor * 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const driftX = (baseX - 50) * (scale - 1) * 0.55;
  const driftY = (baseY - 50) * (scale - 1) * 0.55;

  const opacity = interpolate(
    drive,
    [0, 0.4, LINES.length - 0.4, LINES.length],
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
        filter: "blur(60px)",
      }}
    />
  );
}

// ─── Text line ───────────────────────────────────────────────────────────────

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
  const cam = frame / FRAMES_PER_LINE;
  const rel = index - cam; // positive = ahead, negative = behind

  // Opacity: dim in tunnel → fully lit at readable window → quick fade on pass
  const opacity = interpolate(
    rel,
    [-0.16, -0.04, 0.0, 0.28, 0.52, 0.95, 2.0, 4.0],
    [0,     0.04,  1,   1,    1,    0.55, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale: tiny dot → snaps into readable size → explodes past camera
  const scale = interpolate(
    rel,
    [-0.18, 0,   0.14, 0.34, 0.54, 0.95, 1.6,  2.6,  4.2],
    [16,    7.5, 3.4,  1.55, 1.08, 0.72, 0.46, 0.30, 0.16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Vertical drift: each line sits at its stagger offset
  const baseY = LINE_Y_OFFSETS[index % LINE_Y_OFFSETS.length];
  const yDrift = interpolate(
    rel,
    [0, 0.5, 1.5, 4],
    [baseY * 0.25, baseY * 0.55, baseY, baseY],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color: muted far → bright white in readable zone → electric on pass
  const isReadable = rel > 0.25 && rel < 0.65;
  const isActive   = rel > -0.14 && rel < 0.26;
  const isPassed   = rel < -0.04;

  let color: string;
  if (isPassed) {
    color = "rgba(255,255,255,0.03)";
  } else if (isActive) {
    color = isLastLine ? "#7eb8ff" : "#ffffff";
  } else if (isReadable) {
    color = isLastLine ? "#a8d0ff" : "#f0f4ff";
  } else {
    const v = interpolate(rel, [0.65, 1.5, 3.5], [200, 130, 70], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    color = `rgba(${v}, ${v + 10}, ${Math.min(v + 40, 220)}, ${interpolate(rel, [0.65, 2, 4], [0.85, 0.5, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`;
  }

  // Glow at readable peak
  const glowIntensity = interpolate(
    rel,
    [0.2, 0.42, 0.65],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowColor = isLastLine
    ? `rgba(100, 170, 255, ${glowIntensity * 0.6})`
    : `rgba(200, 220, 255, ${glowIntensity * 0.45})`;
  const textShadow =
    glowIntensity > 0.05
      ? `0 0 ${30 * glowIntensity}px ${glowColor}, 0 0 ${80 * glowIntensity}px ${glowColor}`
      : "none";

  // Motion blur right as line blasts past
  const blur = interpolate(
    rel,
    [-0.18, -0.06, 0, 0.1, 0.5, 1.5],
    [10,    4,     0, 0,   0.5, 3.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translateX(-50%) translateY(calc(-50% + ${yDrift}px)) scale(${scale})`,
        opacity,
        color,
        fontSize: 64,
        fontWeight: 700,
        fontFamily:
          '"Avenir Next", "Avenir", "Nunito Sans", system-ui, -apple-system, sans-serif',
        letterSpacing: "-0.025em",
        textShadow,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        whiteSpace: "nowrap",
        willChange: "transform, opacity",
        textAlign: "center",
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
}

// ─── Progress dots ───────────────────────────────────────────────────────────

function ProgressDots({ frame }: { frame: number }) {
  const cam = frame / FRAMES_PER_LINE;
  const current = Math.min(Math.floor(cam), LINES.length - 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 52,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 9,
        alignItems: "center",
      }}
    >
      {LINES.map((_, i) => {
        const isActive = i === current;
        const isPast = i < current;
        return (
          <div
            key={i}
            style={{
              width: isActive ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: isActive
                ? "rgba(120, 175, 255, 0.9)"
                : isPast
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.12)",
              boxShadow: isActive ? "0 0 10px rgba(100,160,255,0.6)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Vignette ────────────────────────────────────────────────────────────────

function Vignette() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(4,6,16,0.75) 100%)",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function TextCameraAnimation() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #07091a 0%, #0c1124 55%, #080d1c 100%)",
        overflow: "hidden",
      }}
    >
      {/* Large blue nebula — top-left, far */}
      <Blob frame={frame} baseX={-12} baseY={8}   size={820} color="rgba(60,110,230,0.18)"  zDepth={0.78} />
      {/* Warm amber — bottom-right, mid */}
      <Blob frame={frame} baseX={112} baseY={90}  size={640} color="rgba(220,130,60,0.18)"  zDepth={0.58} />
      {/* Small blue accent — right, closer */}
      <Blob frame={frame} baseX={98}  baseY={15}  size={340} color="rgba(80,150,255,0.14)"  zDepth={0.32} />
      {/* Small amber accent — left, closer */}
      <Blob frame={frame} baseX={4}   baseY={88}  size={280} color="rgba(240,160,90,0.14)"  zDepth={0.28} />

      {/* Text tunnel */}
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
      </div>

      {/* Depth vignette */}
      <Vignette />

      <ProgressDots frame={frame} />
    </AbsoluteFill>
  );
}
