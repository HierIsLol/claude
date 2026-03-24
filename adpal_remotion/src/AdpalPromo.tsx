import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

/* ─── helpers ───────────────────────────────────────────── */

const spr = (
  frame: number,
  fps: number,
  from = 0,
  config?: { damping?: number; stiffness?: number; mass?: number }
) =>
  spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8, ...config },
    from,
    to: 1,
  });

/* ─── particles ─────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 1920,
  y: Math.random() * 1080,
  r: Math.random() * 3 + 1,
  speed: Math.random() * 0.4 + 0.15,
  opacity: Math.random() * 0.5 + 0.1,
  color: i % 5 === 0 ? "#ffd700" : i % 3 === 0 ? "#4fc3f7" : "#1d3557",
}));

const Particles: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {PARTICLES.map((p) => (
      <div
        key={p.id}
        style={{
          position: "absolute",
          left: p.x,
          top: ((p.y + frame * p.speed * 60) % 1200) - 100,
          width: p.r * 2,
          height: p.r * 2,
          borderRadius: "50%",
          background: p.color,
          opacity: p.opacity,
        }}
      />
    ))}
  </AbsoluteFill>
);

/* ─── gradient background ───────────────────────────────── */
const BG: React.FC<{ tint?: string }> = ({ tint = "0,0,0" }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 30% 40%, rgba(29,53,87,0.95) 0%, #040812 70%)`,
    }}
  />
);

/* ─── glowing circle ────────────────────────────────────── */
const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number }> = ({
  x, y, r, color, opacity = 0.3,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

/* ─── Scene 1: INTRO LOGO BURST (0–90f) ────────────────── */
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spr(frame, fps, 0, { damping: 12, stiffness: 80 });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const ringScale = interpolate(frame, [10, 60], [0.3, 3], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame, [10, 60], [0.7, 0], {
    extrapolateRight: "clamp",
  });

  // tagline flies in
  const taglineY = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 90 }, from: 80, to: 0 });
  const taglineOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Glow x={960} y={540} r={500} color="rgba(79,195,247,0.15)" />

      {/* Ring burst */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          border: "4px solid rgba(79,195,247,0.6)",
          borderRadius: "50%",
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />

      {/* Logo */}
      <div style={{ textAlign: "center", transform: `scale(${scale})`, opacity }}>
        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            fontFamily: "'Arial Black', Impact, sans-serif",
            letterSpacing: "-4px",
            lineHeight: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #4fc3f7 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ad<span style={{ WebkitTextFillColor: "#e63946", background: "none" }}>Pal</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
            letterSpacing: "8px",
            textTransform: "uppercase",
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOpacity,
            marginTop: 16,
          }}
        >
          Amazon Advertising · Volledig Automatisch
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: HOOK (90–210f) ───────────────────────────── */
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "Meer verkopen.", delay: 0, color: "#fff", size: 100 },
    { text: "Minder betalen.", delay: 12, color: "#4fc3f7", size: 100 },
    { text: "Volledig automatisch.", delay: 26, color: "#ffd700", size: 80 },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Glow x={200} y={800} r={400} color="rgba(230,57,70,0.25)" />
      <Glow x={1700} y={200} r={350} color="rgba(79,195,247,0.2)" />

      <div style={{ textAlign: "center" }}>
        {lines.map(({ text, delay, color, size }) => {
          const s = spr(Math.max(0, frame - delay), fps, 0, { damping: 16, stiffness: 100 });
          const y = interpolate(s, [0, 1], [60, 0]);
          const op = interpolate(s, [0, 0.3], [0, 1]);
          return (
            <div
              key={text}
              style={{
                fontSize: size,
                fontWeight: 900,
                fontFamily: "'Arial Black', Impact, sans-serif",
                color,
                transform: `translateY(${y}px)`,
                opacity: op,
                lineHeight: 1.1,
                textShadow: `0 0 40px ${color}55`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Animated counter ───────────────────────────────────── */
const Counter: React.FC<{
  from: number;
  to: number;
  frame: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ from, to, frame, duration, prefix = "", suffix = "", decimals = 0 }) => {
  const progress = interpolate(frame, [0, duration], [0, 1], {
    easing: Easing.out(Easing.exp),
    extrapolateRight: "clamp",
  });
  const value = from + (to - from) * progress;
  return (
    <span>
      {prefix}
      {value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      {suffix}
    </span>
  );
};

/* ─── Scene 3: BIG NUMBERS (210–390f) ───────────────────── */
const SceneNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { label: "Vertoningen", from: 0, to: 544000, suffix: "", prefix: "", format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`, color: "#4fc3f7", delay: 0 },
    { label: "Omzet gegenereerd", from: 0, to: 23700, suffix: "", prefix: "€", format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v.toFixed(0)}`, color: "#ffd700", delay: 15 },
    { label: "Conversies", from: 0, to: 420, suffix: "+", prefix: "", format: (v: number) => `${v.toFixed(0)}`, color: "#69f0ae", delay: 28 },
    { label: "Gem. ACoS daling", from: 0, to: 34, suffix: "%", prefix: "-", format: (v: number) => `${v.toFixed(0)}`, color: "#e63946", delay: 42 },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Glow x={960} y={540} r={700} color="rgba(29,53,87,0.4)" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          width: 1400,
        }}
      >
        {stats.map(({ label, from, to, prefix, suffix, format, color, delay }) => {
          const s = spr(Math.max(0, frame - delay), fps, 0, { damping: 14 });
          const y = interpolate(s, [0, 1], [80, 0]);
          const opacity = interpolate(s, [0, 0.3], [0, 1]);
          const progress = interpolate(Math.max(0, frame - delay), [0, 90], [0, 1], {
            easing: Easing.out(Easing.exp),
            extrapolateRight: "clamp",
          });
          const value = from + (to - from) * progress;

          return (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${color}44`,
                borderRadius: 24,
                padding: "40px 48px",
                transform: `translateY(${y}px)`,
                opacity,
                boxShadow: `0 0 60px ${color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
            >
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 900,
                  fontFamily: "'Arial Black', sans-serif",
                  color,
                  lineHeight: 1,
                  textShadow: `0 0 30px ${color}88`,
                }}
              >
                {prefix}{format(value)}{suffix}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 12,
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: DASHBOARD MOCKUP (390–540f) ─────────────── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame, fps, config: { damping: 18, stiffness: 80 }, from: 300, to: 0 });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const glowOpacity = interpolate(frame, [0, 40, 100, 150], [0, 0.8, 0.5, 0.3], { extrapolateRight: "clamp" });

  // Bars animate in
  const barProgress = interpolate(frame, [20, 100], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  const bars = [
    { label: "SoundMax", val: 89, color: "#4fc3f7" },
    { label: "TechCase", val: 95, color: "#ffd700" },
    { label: "RunFlex", val: 72, color: "#69f0ae" },
    { label: "ErgoDesk", val: 58, color: "#ff8a65" },
    { label: "Forge", val: 45, color: "#ce93d8" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <Glow x={960} y={400} r={600} color="rgba(79,195,247,0.12)" opacity={glowOpacity} />

      <div
        style={{
          width: "100%",
          transform: `translateY(${slideUp}px)`,
          opacity,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black', sans-serif" }}>
              Campagne Overzicht
            </div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
              Afgelopen 30 dagen · Alle campagnes
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #1d3557, #2d5986)",
              border: "1px solid rgba(79,195,247,0.4)",
              borderRadius: 16,
              padding: "16px 32px",
              fontSize: 20,
              fontWeight: 700,
              color: "#4fc3f7",
            }}
          >
            + Nieuwe campagne
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {bars.map(({ label, val, color }, i) => {
            const delay = i * 8;
            const progress = interpolate(Math.max(0, frame - 20 - delay), [0, 60], [0, 1], {
              easing: Easing.out(Easing.exp),
              extrapolateRight: "clamp",
            });
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div
                  style={{
                    width: 160,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.7)",
                    textAlign: "right",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 48,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${val * progress}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${color}99, ${color})`,
                      borderRadius: 10,
                      boxShadow: `0 0 20px ${color}66`,
                      position: "relative",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 100,
                    fontSize: 22,
                    fontWeight: 900,
                    color,
                    fontFamily: "'Arial Black', sans-serif",
                  }}
                >
                  €{(val * 0.95 * progress).toFixed(0)}K
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5: AUTO-BIDDING (540–660f) ─────────────────── */
const SceneAutoBid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, from: -50, to: 0 });
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Pulsing bid nodes
  const nodes = [
    { x: 300, y: 400, label: "Bid: €1.20", color: "#ff8a65", delay: 10 },
    { x: 700, y: 250, label: "Bid: €0.85", color: "#ffd700", delay: 20 },
    { x: 960, y: 540, label: "Bid: €1.50 ✓", color: "#69f0ae", delay: 30, active: true },
    { x: 1220, y: 280, label: "Bid: €2.10", color: "#4fc3f7", delay: 40 },
    { x: 1600, y: 430, label: "Bid: €0.65", color: "#ce93d8", delay: 50 },
  ];

  return (
    <AbsoluteFill>
      <Glow x={960} y={540} r={500} color="rgba(105,240,174,0.1)" />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${titleIn}px)`,
          opacity: titleOp,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black', sans-serif" }}>
          AI-gestuurde bodoptimalisatie
        </div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
          AdPal past je biedingen automatisch aan — 24/7
        </div>
      </div>

      {/* Lines between nodes */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {nodes.slice(0, -1).map((n, i) => {
          const next = nodes[i + 1];
          const lineOpacity = interpolate(frame, [n.delay + 5, n.delay + 20], [0, 0.4], { extrapolateRight: "clamp" });
          return (
            <line
              key={i}
              x1={n.x} y1={n.y} x2={next.x} y2={next.y}
              stroke="rgba(79,195,247,0.5)"
              strokeWidth="2"
              strokeDasharray="8,6"
              opacity={lineOpacity}
            />
          );
        })}
      </svg>

      {/* Bid nodes */}
      {nodes.map(({ x, y, label, color, delay, active }) => {
        const s = spr(Math.max(0, frame - delay), fps, 0, { damping: 12, stiffness: 100 });
        const pulse = Math.sin((frame - delay) * 0.15) * 0.15 + 1;

        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: x - 100,
              top: y - 40,
              width: 200,
              textAlign: "center",
              transform: `scale(${s * (active ? pulse : 1)})`,
              opacity: s,
            }}
          >
            <div
              style={{
                background: active
                  ? `linear-gradient(135deg, ${color}33, ${color}22)`
                  : "rgba(255,255,255,0.06)",
                border: `2px solid ${color}${active ? "cc" : "66"}`,
                borderRadius: 16,
                padding: "16px 24px",
                fontSize: 20,
                fontWeight: 700,
                color,
                boxShadow: active ? `0 0 40px ${color}66` : "none",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}

      {/* Center label for active */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontSize: 28, color: "#69f0ae", fontWeight: 700 }}>
          ✓ Optimale bod automatisch geselecteerd
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 6: ACOS METER (660–780f) ───────────────────── */
const SceneAcos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // ACoS gauge from 70% → 28%
  const acosValue = interpolate(frame, [20, 100], [70, 28], {
    easing: Easing.out(Easing.exp),
    extrapolateRight: "clamp",
  });

  const savings = interpolate(frame, [30, 110], [0, 8400], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  const gaugeProgress = interpolate(acosValue, [0, 100], [1, 0]);
  const gaugeAngle = interpolate(gaugeProgress, [0, 1], [-140, 140]);
  const gaugeColor = acosValue < 40
    ? `hsl(${interpolate(acosValue, [20, 40], [130, 50])}, 90%, 55%)`
    : `hsl(${interpolate(acosValue, [40, 80], [50, 0])}, 90%, 55%)`;

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Glow x={960} y={540} r={600} color={`${gaugeColor}22`} />

      <div style={{ textAlign: "center", opacity: titleOp }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", marginBottom: 16, fontFamily: "'Arial Black', sans-serif" }}>
          Verlaag je ACoS automatisch
        </div>

        {/* Gauge */}
        <div style={{ position: "relative", width: 500, height: 300, margin: "0 auto" }}>
          <svg viewBox="0 0 500 280" style={{ width: "100%", height: "100%" }}>
            {/* Background arc */}
            <path
              d="M 50 250 A 200 200 0 0 1 450 250"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d="M 50 250 A 200 200 0 0 1 450 250"
              fill="none"
              stroke={gaugeColor}
              strokeWidth="24"
              strokeLinecap="round"
              strokeDasharray={`${gaugeProgress * 628} 628`}
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Needle */}
            <g transform={`translate(250, 250) rotate(${gaugeAngle})`}>
              <line x1="0" y1="0" x2="0" y2="-170" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="10" fill="white" />
            </g>

            {/* Labels */}
            <text x="40" y="275" fill="rgba(255,255,255,0.4)" fontSize="18" fontFamily="Arial">100%</text>
            <text x="215" y="45" fill="rgba(255,255,255,0.4)" fontSize="18" fontFamily="Arial" textAnchor="middle">50%</text>
            <text x="440" y="275" fill="rgba(255,255,255,0.4)" fontSize="18" fontFamily="Arial">0%</text>
          </svg>

          {/* Value */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 88,
                fontWeight: 900,
                color: gaugeColor,
                fontFamily: "'Arial Black', sans-serif",
                textShadow: `0 0 40px ${gaugeColor}88`,
                lineHeight: 1,
              }}
            >
              {acosValue.toFixed(1)}%
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>ACoS</div>
          </div>
        </div>

        {/* Savings callout */}
        <div
          style={{
            marginTop: 32,
            display: "inline-block",
            background: "rgba(105,240,174,0.12)",
            border: "1px solid #69f0ae66",
            borderRadius: 20,
            padding: "20px 48px",
            opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ fontSize: 38, fontWeight: 900, color: "#69f0ae", fontFamily: "'Arial Black', sans-serif" }}>
            + €{savings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} extra marge
          </div>
          <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
            Bespaard t.o.v. handmatig beheer
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 7: FEATURES (780–870f) ─────────────────────── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🎯", title: "Auto-targeting", desc: "AI vindt de beste zoekwoorden voor je product" },
    { icon: "💸", title: "Smart bidding", desc: "Biedingen worden realtime geoptimaliseerd" },
    { icon: "📊", title: "Live dashboard", desc: "Alle campagnes op één scherm, altijd up-to-date" },
    { icon: "🔔", title: "Slimme alerts", desc: "Notificaties als je campagne aandacht nodig heeft" },
    { icon: "📈", title: "Groei rapporten", desc: "Wekelijkse inzichten en aanbevelingen" },
    { icon: "⚡", title: "Snel starten", desc: "Live in 5 minuten, zonder technische kennis" },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ width: "100%" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 56,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 900, color: "#fff", fontFamily: "'Arial Black', sans-serif" }}>
            Alles wat je nodig hebt
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {features.map(({ icon, title, desc }, i) => {
            const delay = i * 8;
            const s = spr(Math.max(0, frame - delay), fps, 0, { damping: 14 });
            const y = interpolate(s, [0, 1], [60, 0]);
            return (
              <div
                key={title}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: "32px 36px",
                  transform: `translateY(${y}px)`,
                  opacity: s,
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "Arial, sans-serif", marginBottom: 10 }}>
                  {title}
                </div>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 8: CTA (870–900f) ───────────────────────────── */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spr(frame, fps, 0, { damping: 14, stiffness: 100 });
  const pulse = Math.sin(frame * 0.12) * 0.03 + 1;

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Glow x={960} y={540} r={700} color="rgba(230,57,70,0.2)" />
      <Glow x={960} y={540} r={400} color="rgba(79,195,247,0.15)" />

      <div style={{ textAlign: "center", transform: `scale(${s})`, opacity: s }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            fontFamily: "'Arial Black', Impact, sans-serif",
            background: "linear-gradient(135deg, #ffffff 0%, #4fc3f7 40%, #ffd700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
          }}
        >
          Ad<span style={{ WebkitTextFillColor: "#e63946", background: "none" }}>Pal</span>
        </div>
        <div style={{ fontSize: 36, color: "rgba(255,255,255,0.7)", marginTop: 16, marginBottom: 48, fontFamily: "Arial, sans-serif" }}>
          adpal.nl · Start gratis vandaag
        </div>

        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #e63946, #c62828)",
            borderRadius: 20,
            padding: "28px 80px",
            fontSize: 38,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "'Arial Black', sans-serif",
            transform: `scale(${pulse})`,
            boxShadow: "0 0 60px rgba(230,57,70,0.6), 0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          Gratis starten →
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── MAIN COMPOSITION ───────────────────────────────────── */
export const AdpalPromo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#040812", fontFamily: "Arial, sans-serif" }}>
      <BG />
      <Particles frame={frame} />

      <Sequence from={0} durationInFrames={90}>
        <SceneIntro />
      </Sequence>

      <Sequence from={90} durationInFrames={120}>
        <SceneHook />
      </Sequence>

      <Sequence from={210} durationInFrames={180}>
        <SceneNumbers />
      </Sequence>

      <Sequence from={390} durationInFrames={150}>
        <SceneDashboard />
      </Sequence>

      <Sequence from={540} durationInFrames={120}>
        <SceneAutoBid />
      </Sequence>

      <Sequence from={660} durationInFrames={120}>
        <SceneAcos />
      </Sequence>

      <Sequence from={780} durationInFrames={90}>
        <SceneFeatures />
      </Sequence>

      <Sequence from={870} durationInFrames={30}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
