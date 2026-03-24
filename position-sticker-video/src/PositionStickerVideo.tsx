import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  Easing,
} from "remotion";

// ─── colour palette ───────────────────────────────────────────────────────────
const BLUE = "#1A56DB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_MID = "#DBEAFE";
const DARK = "#0F172A";
const GRAY = "#64748B";
const GRAY_LIGHT = "#F1F5F9";
const WHITE = "#FFFFFF";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#DCFCE7";
const ORANGE = "#EA580C";

// ─── scene frame boundaries ───────────────────────────────────────────────────
// Total: 720 frames = 24 s @ 30 fps
const SCENE_1_START = 0;    // Choose article           0–149  (5 s)
const SCENE_2_START = 150;  // Choose keyword           150–299 (5 s)
const SCENE_3_START = 300;  // Max bid + position       300–449 (5 s)
const SCENE_4_START = 450;  // Live tracker graph       450–599 (5 s)
const SCENE_5_START = 600;  // Conclusion               600–719 (4 s)

// ─── helpers ──────────────────────────────────────────────────────────────────
function useFadeIn(startFrame: number, durationFrames = 30) {
  const frame = useCurrentFrame();
  return interpolate(frame - startFrame, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function breathe(frame: number, period = 90, amount = 4) {
  return Math.sin((frame / period) * Math.PI * 2) * amount;
}

function slowFloat(frame: number, period = 120, amount = 6) {
  return Math.sin((frame / period) * Math.PI * 2) * amount;
}

// ─── shared layout helpers ────────────────────────────────────────────────────
const StepBadge: React.FC<{ n: number; label: string; active?: boolean }> = ({
  n,
  label,
  active = false,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      opacity: active ? 1 : 0.35,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: active ? BLUE : "#CBD5E1",
        color: WHITE,
        fontWeight: 700,
        fontSize: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {n}
    </div>
    <span
      style={{
        fontSize: 28,
        fontWeight: active ? 700 : 400,
        color: active ? DARK : GRAY,
      }}
    >
      {label}
    </span>
  </div>
);

// ─── SCENE 1 – Choose article ─────────────────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 30], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cardOpacity = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(frame, [20, 60], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const highlightOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const float = slowFloat(frame);

  return (
    <AbsoluteFill
      style={{
        background: GRAY_LIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          gap: 60,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 16,
        }}
      >
        <StepBadge n={1} label="Artikel" active />
        <StepBadge n={2} label="Zoekwoord" />
        <StepBadge n={3} label="Bieding & positie" />
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: DARK,
            margin: 0,
            textAlign: "center",
            letterSpacing: -1,
          }}
        >
          Kies een artikel
        </h1>
        <p
          style={{
            fontSize: 28,
            color: GRAY,
            margin: "12px 0 0",
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          Selecteer het product dat je wilt positioneren
        </p>
      </div>

      {/* Product card */}
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY + float}px)`,
          background: WHITE,
          borderRadius: 24,
          padding: "36px 48px",
          display: "flex",
          alignItems: "center",
          gap: 48,
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          border: `3px solid ${
            highlightOpacity > 0.5 ? BLUE : "transparent"
          }`,
          transition: "border-color 0.3s",
          minWidth: 700,
        }}
      >
        <Img
          src="https://media.s-bol.com/JkxZ9DgNKEzv/kRBJ8qK/550x512.jpg"
          style={{
            width: 120,
            height: 120,
            objectFit: "contain",
            borderRadius: 12,
            background: GRAY_LIGHT,
            padding: 8,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: DARK,
              marginBottom: 8,
            }}
          >
            Apple AirPods 4 – met reguliere oplaadcase (USB‑C)
          </div>
          <div style={{ fontSize: 22, color: GRAY, fontFamily: "monospace" }}>
            0195949688591
          </div>
        </div>

        {/* Selected checkmark */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: highlightOpacity,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 – Choose keyword ─────────────────────────────────────────────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideUp = interpolate(frame, [0, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const keywords = [
    { label: "airpods", popular: true },
    { label: "draadloze oortjes", popular: false },
    { label: "airpods 4", popular: false },
    { label: "apple oortjes", popular: false },
  ];

  const float = slowFloat(frame, 130, 5);

  return (
    <AbsoluteFill
      style={{
        background: GRAY_LIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          gap: 60,
          opacity: fadeIn,
          transform: `translateY(${slideUp}px)`,
        }}
      >
        <StepBadge n={1} label="Artikel" />
        <StepBadge n={2} label="Zoekwoord" active />
        <StepBadge n={3} label="Bieding & positie" />
      </div>

      <div
        style={{
          opacity: fadeIn,
          transform: `translateY(${slideUp}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: DARK,
            margin: 0,
            letterSpacing: -1,
          }}
        >
          Kies een zoekwoord
        </h1>
        <p style={{ fontSize: 28, color: GRAY, margin: "12px 0 0" }}>
          Of selecteer een categorie waarop je wilt scoren
        </p>
      </div>

      {/* Keyword pills */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          transform: `translateY(${float}px)`,
          opacity: fadeIn,
        }}
      >
        {keywords.map((kw, i) => {
          const isSelected = i === 0;
          const appearDelay = 10 + i * 12;
          const kwOpacity = interpolate(
            frame,
            [appearDelay, appearDelay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const kwScale = interpolate(
            frame,
            [appearDelay, appearDelay + 20],
            [0.8, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={kw.label}
              style={{
                opacity: kwOpacity,
                transform: `scale(${kwScale})`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 36px",
                borderRadius: 60,
                background: isSelected ? BLUE : WHITE,
                color: isSelected ? WHITE : DARK,
                fontSize: 26,
                fontWeight: isSelected ? 700 : 500,
                border: `2px solid ${isSelected ? BLUE : "#E2E8F0"}`,
                boxShadow: isSelected
                  ? "0 4px 20px rgba(26,86,219,0.30)"
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {kw.label}
              {kw.popular && (
                <span
                  style={{
                    background: WHITE,
                    color: BLUE,
                    fontSize: 16,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  populair
                </span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 – Max bid + desired position ────────────────────────────────────
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideUp = interpolate(frame, [0, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Animated bid value ticking up
  const maxBid = interpolate(frame, [30, 100], [0, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const positions = ["#1", "#2", "#3", "#4", "#5", "#6"];
  const selectedPos = 1; // 0-indexed → position #2

  const float = slowFloat(frame, 110, 5);

  const bidBoxOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const posBoxOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: GRAY_LIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          gap: 60,
          opacity: fadeIn,
          transform: `translateY(${slideUp}px)`,
        }}
      >
        <StepBadge n={1} label="Artikel" />
        <StepBadge n={2} label="Zoekwoord" />
        <StepBadge n={3} label="Bieding & positie" active />
      </div>

      <div
        style={{
          opacity: fadeIn,
          transform: `translateY(${slideUp}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: DARK,
            margin: 0,
            letterSpacing: -1,
          }}
        >
          Stel je bieding in
        </h1>
        <p style={{ fontSize: 28, color: GRAY, margin: "12px 0 0" }}>
          Jij betaalt altijd de{" "}
          <span style={{ color: GREEN, fontWeight: 700 }}>laagst mogelijke</span>{" "}
          prijs om je positie te houden
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
          transform: `translateY(${float}px)`,
        }}
      >
        {/* Max bid card */}
        <div
          style={{
            opacity: bidBoxOpacity,
            background: WHITE,
            borderRadius: 24,
            padding: "40px 56px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            textAlign: "center",
            minWidth: 320,
          }}
        >
          <div style={{ fontSize: 22, color: GRAY, marginBottom: 16, fontWeight: 600 }}>
            Maximale bieding
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: BLUE,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            €{maxBid.toFixed(2)}
          </div>
          <div style={{ fontSize: 18, color: GRAY, marginTop: 12 }}>
            per dag, per positie
          </div>
        </div>

        {/* Desired position card */}
        <div
          style={{
            opacity: posBoxOpacity,
            background: WHITE,
            borderRadius: 24,
            padding: "40px 48px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 22, color: GRAY, marginBottom: 20, fontWeight: 600 }}>
            Gewenste positie
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {positions.map((pos, i) => (
              <div
                key={pos}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: i === selectedPos ? BLUE : BLUE_MID,
                  color: i === selectedPos ? WHITE : BLUE,
                  fontSize: 20,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    i === selectedPos
                      ? "0 4px 16px rgba(26,86,219,0.40)"
                      : "none",
                }}
              >
                {pos}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info callout */}
      <div
        style={{
          opacity: interpolate(frame, [100, 130], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          background: GREEN_LIGHT,
          border: `2px solid ${GREEN}`,
          borderRadius: 16,
          padding: "18px 40px",
          fontSize: 24,
          color: GREEN,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={GREEN} />
          <path
            d="M12 7v5M12 16h.01"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        Je krijgt de plek als jouw bod binnen bereik ligt — voor de laagst mogelijke prijs
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 – Live tracker graph ─────────────────────────────────────────────
const LiveChart: React.FC<{ progress: number }> = ({ progress }) => {
  const W = 900;
  const H = 320;
  const PAD = { top: 30, right: 60, bottom: 50, left: 70 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  // price data: smooth wave that dips and spikes
  const totalPoints = 120;
  const visiblePoints = Math.floor(progress * totalPoints);

  const priceData: number[] = [];
  for (let i = 0; i < totalPoints; i++) {
    const t = i / totalPoints;
    const base = 1.3;
    const spike = t > 0.55 && t < 0.70 ? Math.exp(-Math.pow((t - 0.62) / 0.04, 2)) * 5.5 : 0;
    const dip = t > 0.55 && t < 0.58 ? -1.2 : 0;
    const noise = Math.sin(i * 0.8) * 0.12 + Math.sin(i * 2.1) * 0.07;
    priceData.push(Math.max(0, base + spike + dip + noise));
  }

  // position data: step function
  const posData: number[] = [];
  for (let i = 0; i < totalPoints; i++) {
    const t = i / totalPoints;
    if (t < 0.30) posData.push(9);
    else if (t < 0.55) posData.push(6);
    else if (t < 0.62) posData.push(12);
    else if (t < 0.75) posData.push(3);
    else posData.push(2);
  }

  const maxPrice = 8;
  const maxPos = 12;

  function xOf(i: number) {
    return PAD.left + (i / (totalPoints - 1)) * innerW;
  }
  function yPrice(v: number) {
    return PAD.top + innerH - (v / maxPrice) * innerH;
  }
  function yPos(v: number) {
    return PAD.top + innerH - ((maxPos - v) / maxPos) * innerH;
  }

  // build SVG path strings
  const pricePath =
    priceData
      .slice(0, visiblePoints)
      .map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yPrice(v).toFixed(1)}`)
      .join(" ") || "";

  const posPath =
    posData
      .slice(0, visiblePoints)
      .map((v, i) => {
        if (i === 0) return `M${xOf(0).toFixed(1)},${yPos(v).toFixed(1)}`;
        const prevV = posData[i - 1];
        return `L${xOf(i).toFixed(1)},${yPos(prevV).toFixed(1)} L${xOf(i).toFixed(1)},${yPos(v).toFixed(1)}`;
      })
      .join(" ") || "";

  const yLines = [0, 2, 4, 6, 8];
  const posLabels = [12, 9, 6, 3];

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      {/* grid */}
      {yLines.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            x2={PAD.left + innerW}
            y1={yPrice(v)}
            y2={yPrice(v)}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 10}
            y={yPrice(v) + 5}
            textAnchor="end"
            fontSize="18"
            fill={GRAY}
          >
            €{v}
          </text>
        </g>
      ))}

      {/* right axis: position labels */}
      {posLabels.map((v) => (
        <text
          key={v}
          x={PAD.left + innerW + 12}
          y={yPos(v) + 5}
          fontSize="18"
          fill={BLUE}
          fontWeight="600"
        >
          #{v}
        </text>
      ))}

      {/* price line */}
      <path d={pricePath} fill="none" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* position step line */}
      <path d={posPath} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />

      {/* x axis */}
      <line
        x1={PAD.left}
        x2={PAD.left + innerW}
        y1={PAD.top + innerH}
        y2={PAD.top + innerH}
        stroke="#CBD5E1"
        strokeWidth="2"
      />

      {/* current dot – price */}
      {visiblePoints > 1 && (
        <circle
          cx={xOf(visiblePoints - 1)}
          cy={yPrice(priceData[visiblePoints - 1])}
          r="8"
          fill={ORANGE}
        />
      )}
      {/* current dot – position */}
      {visiblePoints > 1 && (
        <circle
          cx={xOf(visiblePoints - 1)}
          cy={yPos(posData[visiblePoints - 1])}
          r="8"
          fill={BLUE}
        />
      )}
    </svg>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideUp = interpolate(frame, [0, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // progress drives how much of the chart is drawn
  const progress = interpolate(frame, [20, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const float = slowFloat(frame, 140, 4);

  const legendOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: GRAY_LIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          transform: `translateY(${slideUp}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: DARK,
            margin: 0,
            letterSpacing: -1,
          }}
        >
          Live tracker
        </h1>
        <p style={{ fontSize: 26, color: GRAY, margin: "10px 0 0" }}>
          Jouw bieding en positie in realtime
        </p>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 40,
          opacity: legendOpacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 4, background: ORANGE, borderRadius: 2 }} />
          <span style={{ fontSize: 20, color: DARK, fontWeight: 600 }}>Biedprijs</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 4, background: BLUE, borderRadius: 2 }} />
          <span style={{ fontSize: 20, color: DARK, fontWeight: 600 }}>Positie</span>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          opacity: fadeIn,
          transform: `translateY(${float}px)`,
          background: WHITE,
          borderRadius: 24,
          padding: "36px 48px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        }}
      >
        <LiveChart progress={progress} />
      </div>

      {/* Callout */}
      <div
        style={{
          opacity: interpolate(frame, [80, 110], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          background: BLUE_LIGHT,
          border: `2px solid ${BLUE}`,
          borderRadius: 14,
          padding: "16px 36px",
          fontSize: 22,
          color: BLUE,
          fontWeight: 600,
        }}
      >
        De positiesticker past je bieding automatisch aan — jij zit altijd op de juiste plek
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 – Conclusion ─────────────────────────────────────────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bg = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const items = [
    { icon: "🎯", text: "Kies artikel & zoekwoord" },
    { icon: "💰", text: "Stel maximale bieding in" },
    { icon: "📍", text: "Kies je gewenste positie" },
    { icon: "✅", text: "Altijd de laagst mogelijke prijs" },
  ];

  const logoOpacity = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, #0F172A 0%, #1A56DB 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        opacity: bg,
      }}
    >
      {/* Brand */}
      <div style={{ opacity: logoOpacity, textAlign: "center" }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "rgba(255,255,255,0.60)",
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          ADPAL
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: WHITE,
            margin: 0,
            letterSpacing: -2,
          }}
        >
          Positiesticker
        </h1>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.70)", margin: "12px 0 0" }}>
          Slimmer adverteren op bol.com
        </p>
      </div>

      {/* Summary items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        {items.map((item, i) => {
          const itemOpacity = interpolate(frame, [30 + i * 15, 55 + i * 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const itemX = interpolate(frame, [30 + i * 15, 55 + i * 15], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  width: 60,
                  height: 60,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 30, color: WHITE, fontWeight: 600 }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pulse dot */}
      <div
        style={{
          opacity: interpolate(frame, [60, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#4ADE80",
            boxShadow: `0 0 0 ${breathe(frame, 60, 6) + 6}px rgba(74,222,128,0.25)`,
          }}
        />
        <span style={{ fontSize: 24, color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>
          Actief & automatisch bijgestuurd
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── ROOT VIDEO ───────────────────────────────────────────────────────────────
export const PositionStickerVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Sequence from={SCENE_1_START} durationInFrames={150}>
        <Scene1 />
      </Sequence>
      <Sequence from={SCENE_2_START} durationInFrames={150}>
        <Scene2 />
      </Sequence>
      <Sequence from={SCENE_3_START} durationInFrames={150}>
        <Scene3 />
      </Sequence>
      <Sequence from={SCENE_4_START} durationInFrames={150}>
        <Scene4 />
      </Sequence>
      <Sequence from={SCENE_5_START} durationInFrames={120}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
