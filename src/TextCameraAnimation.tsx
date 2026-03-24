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

const FRAMES_PER_LINE = 48;

// Camera starts 2.2 "lines" before the first line — everyone begins as a tiny dot
const CAM_OFFSET = 2.2;

const LAST_IDX = LINES.length - 1;

// Camera freezes when last line reaches rel = 0.50 (comfortable reading scale ~1.15)
const FREEZE_CAM = LAST_IDX - 0.50;
const FREEZE_AT_FRAME = (FREEZE_CAM + CAM_OFFSET) * FRAMES_PER_LINE;

const TYPEWRITER_DURATION = 56; // frames to type the last line
const HOLD_FRAMES = 45;          // frames to hold after typing finishes

export const TOTAL_FRAMES = Math.ceil(FREEZE_AT_FRAME) + TYPEWRITER_DURATION + HOLD_FRAMES;

// Last line: "Of lekker AdPal alles laten doen"
const LAST_TEXT = LINES[LAST_IDX];
const ADPAL_START = LAST_TEXT.indexOf("AdPal");
const ADPAL_END = ADPAL_START + "AdPal".length;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Y-offsets so lines weave through the frame
const Y_OFFSETS = [0, 36, -26, 20, -34, 0];

// ─── Blob ────────────────────────────────────────────────────────────────────

function Blob({
  frame,
  cam,
  baseX,
  baseY,
  size,
  color,
  zDepth,
}: {
  frame: number;
  cam: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  zDepth: number;
}) {
  const drive = cam * (1 - zDepth);
  const scale = interpolate(drive, [0, LINES.length], [1, 1 + (1 - zDepth) * 3], clamp);
  const driftX = (baseX - 50) * (scale - 1) * 0.55;
  const driftY = (baseY - 50) * (scale - 1) * 0.55;
  const opacity = interpolate(
    frame,
    [0, 18, TOTAL_FRAMES - 18, TOTAL_FRAMES],
    [0, 1, 1, 0],
    clamp
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
        filter: "blur(60px)",
        willChange: "transform, opacity",
      }}
    />
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function TypewriterText({ frozenFrame }: { frozenFrame: number }) {
  const totalChars = LAST_TEXT.length;
  // Slight pause at start, then accelerates into rhythm
  const progress = interpolate(frozenFrame, [0, 6, TYPEWRITER_DURATION], [0, 0, 1], clamp);
  const visibleChars = Math.min(Math.floor(progress * totalChars), totalChars);

  // Cursor blinks at ~2 Hz; hide a beat after typing finishes
  const showCursor =
    frozenFrame < TYPEWRITER_DURATION + 18 &&
    Math.floor((frozenFrame * 2) / 30) % 2 === 0;

  const before = LAST_TEXT.slice(0, Math.min(visibleChars, ADPAL_START));
  const adpal = visibleChars > ADPAL_START
    ? LAST_TEXT.slice(ADPAL_START, Math.min(visibleChars, ADPAL_END))
    : "";
  const after = visibleChars > ADPAL_END
    ? LAST_TEXT.slice(ADPAL_END, visibleChars)
    : "";

  // AdPal glow pulses once typing is done
  const typingDone = visibleChars >= totalChars;
  const pulse = typingDone
    ? interpolate(
        frozenFrame - TYPEWRITER_DURATION,
        [0, 12, 26, 38],
        [0, 1, 0.6, 1],
        clamp
      )
    : adpal.length > 0
    ? 0.7
    : 0;

  const adpalGlow =
    pulse > 0
      ? `0 0 ${28 * pulse}px rgba(100,170,255,${0.7 * pulse}), 0 0 ${70 * pulse}px rgba(60,130,255,${0.35 * pulse})`
      : "none";

  return (
    <span>
      <span style={{ color: "#f0f4ff" }}>{before}</span>
      {adpal && (
        <span style={{ color: "#7eb8ff", textShadow: adpalGlow }}>{adpal}</span>
      )}
      <span style={{ color: "#f0f4ff" }}>{after}</span>
      {showCursor && (
        <span
          style={{
            color: "#7eb8ff",
            opacity: 0.85,
            marginLeft: 2,
            fontWeight: 300,
          }}
        >
          |
        </span>
      )}
    </span>
  );
}

// ─── Line ─────────────────────────────────────────────────────────────────────

function Line({
  text,
  index,
  cam,
  frozenFrame,
  isLast,
}: {
  text: string;
  index: number;
  cam: number;
  frozenFrame: number;
  isLast: boolean;
}) {
  const rel = index - cam; // positive = ahead, negative = behind camera

  // Opacity: invisible far away → fully lit → fade after passing
  const opacity = interpolate(
    rel,
    [-0.18, -0.04, 0.0, 0.28, 0.54, 1.0, 2.2, 4.2],
    [0,     0.04,  1,   1,    1,    0.5, 0.14, 0],
    clamp
  );

  // Scale: tiny dot far away → readable → explodes past camera
  const scale = interpolate(
    rel,
    [-0.18, 0,   0.14, 0.34, 0.54, 0.95, 1.6,  2.6,  4.2],
    [16,    7.5, 3.4,  1.55, 1.12, 0.72, 0.46, 0.30, 0.16],
    clamp
  );

  // Vertical stagger drift
  const baseY = Y_OFFSETS[index % Y_OFFSETS.length];
  const yDrift = interpolate(rel, [0, 0.5, 1.5, 4], [baseY * 0.25, baseY * 0.55, baseY, baseY], clamp);

  // Motion blur as line blasts past
  const blur = interpolate(rel, [-0.18, -0.06, 0, 0.15, 0.6], [8, 3.5, 0, 0, 1.5], clamp);

  // Text color: dim/blue-grey far → bright white in window → gone on pass
  const isActive = rel > -0.14 && rel < 0.26;
  const isPassed = rel < -0.05;

  let color: string;
  if (isPassed) {
    color = "rgba(255,255,255,0.02)";
  } else if (isActive) {
    color = isLast ? "#7eb8ff" : "#ffffff";
  } else {
    const dist = interpolate(rel, [0.26, 1.2, 2.5, 4.2], [1, 0.7, 0.45, 0.2], clamp);
    const v = Math.round(100 + dist * 130);
    color = `rgba(${v}, ${v + 8}, ${Math.min(v + 36, 230)}, ${dist * 0.9})`;
  }

  // Glow at readable peak — blue for last line
  const glowT = interpolate(rel, [0.22, 0.44, 0.66], [0, 1, 0], clamp);
  const glowCol = isLast
    ? `rgba(100,170,255,${glowT * 0.55})`
    : `rgba(200,220,255,${glowT * 0.4})`;
  const textShadow =
    glowT > 0.06
      ? `0 0 ${28 * glowT}px ${glowCol}, 0 0 ${72 * glowT}px ${glowCol}`
      : "none";

  // Last line in typewriter phase: show typewriter component instead of plain text
  const showTypewriter = isLast && frozenFrame > 0;
  const content = showTypewriter ? (
    <TypewriterText frozenFrame={frozenFrame} />
  ) : (
    text
  );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translateX(-50%) translateY(calc(-50% + ${yDrift}px)) scale(${scale})`,
        opacity,
        color: showTypewriter ? "#f0f4ff" : color,
        fontSize: 64,
        fontWeight: 700,
        fontFamily:
          '"Avenir Next", "Avenir", "Nunito Sans", system-ui, -apple-system, sans-serif',
        letterSpacing: "-0.025em",
        textShadow: showTypewriter ? "none" : textShadow,
        filter: blur > 0.1 ? `blur(${blur}px)` : "none",
        whiteSpace: "nowrap",
        willChange: "transform, opacity",
        textAlign: "center",
        lineHeight: 1,
      }}
    >
      {content}
    </div>
  );
}

// ─── Progress dots ───────────────────────────────────────────────────────────

function ProgressDots({ cam }: { cam: number }) {
  const current = Math.min(Math.floor(cam + 0.56), LINES.length - 1);

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
                ? "rgba(120,175,255,0.9)"
                : isPast
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.12)",
              boxShadow: isActive ? "0 0 10px rgba(100,160,255,0.6)" : "none",
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function TextCameraAnimation() {
  const frame = useCurrentFrame();

  // Raw camera position (starts negative so first line comes from far away)
  const rawCam = frame / FRAMES_PER_LINE - CAM_OFFSET;

  // Clamp camera: freeze once last line hits its readable spot
  const cam = Math.min(rawCam, FREEZE_CAM);

  // How many frames have elapsed since the camera froze (drives typewriter)
  const frozenFrame = Math.max(0, frame - FREEZE_AT_FRAME);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #07091a 0%, #0c1124 55%, #080d1c 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background nebulae */}
      <Blob frame={frame} cam={cam} baseX={-12} baseY={8}   size={820} color="rgba(60,110,230,0.18)"  zDepth={0.78} />
      <Blob frame={frame} cam={cam} baseX={112} baseY={90}  size={640} color="rgba(220,130,60,0.18)"  zDepth={0.58} />
      <Blob frame={frame} cam={cam} baseX={98}  baseY={15}  size={340} color="rgba(80,150,255,0.14)"  zDepth={0.32} />
      <Blob frame={frame} cam={cam} baseX={4}   baseY={88}  size={280} color="rgba(240,160,90,0.14)"  zDepth={0.28} />

      {/* Text tunnel */}
      <div style={{ position: "absolute", inset: 0 }}>
        {LINES.map((line, i) => (
          <Line
            key={i}
            text={line}
            index={i}
            cam={cam}
            frozenFrame={i === LAST_IDX ? frozenFrame : 0}
            isLast={i === LAST_IDX}
          />
        ))}
      </div>

      {/* Depth vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(4,6,16,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      <ProgressDots cam={cam} />
    </AbsoluteFill>
  );
}
