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

// Palette – AdPal style
const NAVY = "#1B2E5E";
const BLUE = "#3B5FC0";
const BLUE_LIGHT = "#EEF2FB";
const BLUE_MID = "#C7D6F5";
const SALMON = "#F4A89A";
const SALMON_LIGHT = "#FEF0EE";
const GRAY = "#6B7A99";
const BG = "#EEF1F8";
const WHITE = "#FFFFFF";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#DCFCE7";

const LOGO_URL =
  "https://instructies.s3.us-east-1.amazonaws.com/AdPal_logo_no_white+(1)+kopie.png";
const AIRPODS_URL =
  "https://media.s-bol.com/JkxZ9DgNKEzv/kRBJ8qK/550x512.jpg";

// Scene boundaries – 900 frames = 30 s @ 30 fps
const S1 = 0;    // 0–179   Artikel kiezen
const S2 = 180;  // 180–359 Zoekwoord kiezen
const S3 = 360;  // 360–539 Maximaal bod + positie
const S4 = 540;  // 540–719 Live tracker
const S5 = 720;  // 720–899 Conclusie

function f(frame: number, from: number, to: number, lo = 0, hi = 1) {
  return interpolate(frame, [from, to], [lo, hi], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
function fEase(
  frame: number,
  from: number,
  to: number,
  lo = 0,
  hi = 1,
  easing = Easing.out(Easing.cubic)
) {
  return interpolate(frame, [from, to], [lo, hi], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}
function wave(frame: number, period = 120, amount = 5) {
  return Math.sin((frame / period) * Math.PI * 2) * amount;
}

// Shared logo header
const Logo: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      top: 48,
      left: 64,
      opacity,
      display: "flex",
      alignItems: "center",
    }}
  >
    <Img
      src={LOGO_URL}
      style={{ height: 44, width: "auto", objectFit: "contain" }}
    />
  </div>
);

// Step progress bar
const Steps: React.FC<{ active: 1 | 2 | 3; opacity?: number }> = ({
  active,
  opacity = 1,
}) => {
  const steps = ["Artikel", "Zoekwoord", "Bod en positie"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        opacity,
      }}
    >
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < active;
        const current = n === active;
        return (
          <React.Fragment key={label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: current ? 1 : done ? 0.7 : 0.3,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: current ? BLUE : done ? BLUE_MID : "#D1D9EF",
                  color: current ? WHITE : done ? BLUE : GRAY,
                  fontWeight: 700,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke={BLUE}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  n
                )}
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: current ? 700 : 500,
                  color: current ? NAVY : GRAY,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 56,
                  height: 2,
                  background: done ? BLUE_MID : "#D1D9EF",
                  margin: "0 16px",
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── SCENE 1  Kies een artikel ──────────────────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOp = fEase(frame, 0, 25, 0, 1);
  const stepsOp = fEase(frame, 10, 40, 0, 1);
  const titleOp = fEase(frame, 20, 50, 0, 1);
  const titleY = fEase(frame, 20, 50, 30, 0);
  const cardOp = fEase(frame, 45, 80, 0, 1);
  const cardY = fEase(frame, 45, 85, 50, 0);
  const checkOp = fEase(frame, 100, 130, 0, 1);
  const checkScale = fEase(frame, 100, 130, 0.4, 1, Easing.out(Easing.back(2)));
  const borderOp = f(frame, 95, 115);

  const float = wave(frame, 150, 5);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Logo opacity={logoOp} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 44,
        }}
      >
        <Steps active={1} opacity={stepsOp} />

        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <h1 style={{ fontSize: 72, fontWeight: 800, color: NAVY, margin: 0, letterSpacing: -1 }}>
            Kies een artikel
          </h1>
          <p style={{ fontSize: 28, color: GRAY, margin: "14px 0 0", fontWeight: 400 }}>
            Selecteer het product dat je wilt positioneren
          </p>
        </div>

        {/* Product card */}
        <div
          style={{
            opacity: cardOp,
            transform: `translateY(${cardY + float}px)`,
            background: WHITE,
            borderRadius: 28,
            padding: "36px 52px",
            display: "flex",
            alignItems: "center",
            gap: 44,
            boxShadow: "0 10px 48px rgba(27,46,94,0.10)",
            border: `3px solid ${borderOp > 0.5 ? BLUE : "transparent"}`,
            minWidth: 760,
          }}
        >
          <Img
            src={AIRPODS_URL}
            style={{
              width: 110,
              height: 110,
              objectFit: "contain",
              borderRadius: 14,
              background: BG,
              padding: 8,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              Apple AirPods 4 met reguliere oplaadcase (USB-C)
            </div>
            <div style={{ fontSize: 20, color: GRAY, fontFamily: "monospace" }}>
              0195949688591
            </div>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: checkOp,
              transform: `scale(${checkScale})`,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 2  Kies een zoekwoord ───────────────────────────────────────────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOp = fEase(frame, 0, 20, 0, 1);
  const stepsOp = fEase(frame, 5, 30, 0, 1);
  const titleOp = fEase(frame, 15, 45, 0, 1);
  const titleY = fEase(frame, 15, 45, 30, 0);

  const keywords = [
    { label: "airpods", tag: "populair" },
    { label: "draadloze oortjes", tag: null },
    { label: "airpods 4", tag: null },
    { label: "apple oortjes", tag: null },
  ];

  // Keywords appear one by one unselected
  // Then at frame 100 "airpods" gets clicked
  const CLICK_FRAME = 105;
  const isClicking = frame >= CLICK_FRAME - 5 && frame <= CLICK_FRAME + 20;
  const clickScale = frame >= CLICK_FRAME
    ? fEase(frame, CLICK_FRAME, CLICK_FRAME + 18, 1.08, 1, Easing.out(Easing.back(1.5)))
    : frame >= CLICK_FRAME - 5
    ? fEase(frame, CLICK_FRAME - 5, CLICK_FRAME, 1, 1.08, Easing.out(Easing.quad))
    : 1;

  const selected = frame >= CLICK_FRAME;

  const float = wave(frame, 140, 4);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Logo opacity={logoOp} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 44,
        }}
      >
        <Steps active={2} opacity={stepsOp} />

        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <h1 style={{ fontSize: 72, fontWeight: 800, color: NAVY, margin: 0, letterSpacing: -1 }}>
            Kies een zoekwoord
          </h1>
          <p style={{ fontSize: 28, color: GRAY, margin: "14px 0 0", fontWeight: 400 }}>
            Of kies een categorie waarop je wilt scoren
          </p>
        </div>

        {/* Keyword pills */}
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
            transform: `translateY(${float}px)`,
          }}
        >
          {keywords.map((kw, i) => {
            const appearStart = 40 + i * 20;
            const kwOp = fEase(frame, appearStart, appearStart + 22, 0, 1);
            const kwY = fEase(frame, appearStart, appearStart + 22, 18, 0);
            const isFirst = i === 0;
            const isSelected = isFirst && selected;

            return (
              <div
                key={kw.label}
                style={{
                  opacity: kwOp,
                  transform: `translateY(${kwY}px) scale(${isFirst ? clickScale : 1})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "18px 36px",
                  borderRadius: 60,
                  background: isSelected ? BLUE : WHITE,
                  color: isSelected ? WHITE : NAVY,
                  fontSize: 26,
                  fontWeight: isSelected ? 700 : 500,
                  border: `2px solid ${isSelected ? BLUE : "#D6DFEE"}`,
                  boxShadow: isSelected
                    ? "0 6px 24px rgba(59,95,192,0.30)"
                    : "0 2px 10px rgba(27,46,94,0.07)",
                }}
              >
                {kw.label}
                {kw.tag && (
                  <span
                    style={{
                      background: isSelected ? "rgba(255,255,255,0.22)" : BLUE_LIGHT,
                      color: isSelected ? WHITE : BLUE,
                      fontSize: 15,
                      fontWeight: 700,
                      padding: "3px 12px",
                      borderRadius: 20,
                    }}
                  >
                    {kw.tag}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Confirmed callout */}
        <div
          style={{
            opacity: fEase(frame, CLICK_FRAME + 15, CLICK_FRAME + 38, 0, 1),
            transform: `translateY(${fEase(frame, CLICK_FRAME + 15, CLICK_FRAME + 38, 14, 0)}px)`,
            background: GREEN_LIGHT,
            border: `2px solid ${GREEN}`,
            borderRadius: 14,
            padding: "14px 36px",
            fontSize: 22,
            color: GREEN,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Zoekwoord geselecteerd: airpods
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 3  Maximaal bod en positie ─────────────────────────────────────────
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOp = fEase(frame, 0, 20, 0, 1);
  const stepsOp = fEase(frame, 5, 30, 0, 1);
  const titleOp = fEase(frame, 15, 45, 0, 1);
  const titleY = fEase(frame, 15, 45, 30, 0);
  const bidOp = fEase(frame, 35, 65, 0, 1);
  const posOp = fEase(frame, 75, 105, 0, 1);
  const calloutOp = fEase(frame, 115, 140, 0, 1);

  // Bid ticks up to €2.50
  const maxBid = fEase(frame, 40, 120, 0, 2.5, Easing.out(Easing.cubic));

  // Position select animation: #2 highlights at frame 90
  const POS_CLICK = 90;
  const positions = ["#1", "#2", "#3", "#4", "#5", "#6"];
  const selectedPos = 1;
  const posClickScale = frame >= POS_CLICK
    ? fEase(frame, POS_CLICK, POS_CLICK + 16, 1.12, 1, Easing.out(Easing.back(1.5)))
    : 1;

  const float = wave(frame, 130, 4);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Logo opacity={logoOp} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 44,
        }}
      >
        <Steps active={3} opacity={stepsOp} />

        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <h1 style={{ fontSize: 72, fontWeight: 800, color: NAVY, margin: 0, letterSpacing: -1 }}>
            Stel je maximaal bod in
          </h1>
          <p style={{ fontSize: 28, color: GRAY, margin: "14px 0 0", fontWeight: 400 }}>
            En kies de positie waar je wilt staan
          </p>
        </div>

        <div style={{ display: "flex", gap: 36, alignItems: "stretch", transform: `translateY(${float}px)` }}>
          {/* Max bid card */}
          <div
            style={{
              opacity: bidOp,
              background: WHITE,
              borderRadius: 28,
              padding: "44px 60px",
              boxShadow: "0 10px 48px rgba(27,46,94,0.10)",
              textAlign: "center",
              minWidth: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 18, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Maximaal bod
            </div>
            <div style={{ fontSize: 80, fontWeight: 800, color: BLUE, letterSpacing: -2, lineHeight: 1 }}>
              {"\u20AC"}{maxBid.toFixed(2)}
            </div>
            <div style={{ fontSize: 18, color: GRAY }}>per product, per dag</div>
          </div>

          {/* Desired position card */}
          <div
            style={{
              opacity: posOp,
              background: WHITE,
              borderRadius: 28,
              padding: "44px 52px",
              boxShadow: "0 10px 48px rgba(27,46,94,0.10)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ fontSize: 18, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Gewenste positie
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {positions.map((pos, i) => {
                const isSelected = i === selectedPos;
                return (
                  <div
                    key={pos}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      background: isSelected ? BLUE : BLUE_LIGHT,
                      color: isSelected ? WHITE : BLUE,
                      fontSize: 20,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isSelected ? "0 6px 20px rgba(59,95,192,0.35)" : "none",
                      transform: isSelected ? `scale(${posClickScale})` : "scale(1)",
                    }}
                  >
                    {pos}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 18, color: GRAY }}>
              Je betaalt nooit meer dan je maximaal bod
            </div>
          </div>
        </div>

        {/* Info callout */}
        <div
          style={{
            opacity: calloutOp,
            transform: `translateY(${fEase(frame, 115, 140, 12, 0)}px)`,
            background: BLUE_LIGHT,
            border: `2px solid ${BLUE}`,
            borderRadius: 16,
            padding: "18px 44px",
            fontSize: 24,
            color: BLUE,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill={BLUE} />
            <path d="M12 7v5M12 16h.01" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Je krijgt altijd je plek, voor de laagst mogelijke prijs
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 4  Live tracker ─────────────────────────────────────────────────────
const LiveChart: React.FC<{ progress: number }> = ({ progress }) => {
  const W = 980;
  const H = 330;
  const PAD = { top: 30, right: 70, bottom: 50, left: 72 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const N = 140;
  const visible = Math.max(2, Math.floor(progress * N));

  const prices: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const base = 1.3;
    const spike =
      t > 0.53 && t < 0.72
        ? Math.exp(-Math.pow((t - 0.62) / 0.045, 2)) * 5.8
        : 0;
    const dip = t > 0.52 && t < 0.555 ? -1.3 : 0;
    const noise = Math.sin(i * 0.85) * 0.13 + Math.sin(i * 2.3) * 0.07;
    prices.push(Math.max(0, base + spike + dip + noise));
  }

  const positions: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / N;
    if (t < 0.28) positions.push(9);
    else if (t < 0.52) positions.push(6);
    else if (t < 0.63) positions.push(12);
    else if (t < 0.76) positions.push(3);
    else positions.push(2);
  }

  const maxP = 8;
  const maxPos = 12;
  const x = (i: number) => PAD.left + (i / (N - 1)) * iW;
  const yP = (v: number) => PAD.top + iH - (v / maxP) * iH;
  const yPos = (v: number) => PAD.top + iH - ((maxPos - v) / maxPos) * iH;

  const pricePath = prices
    .slice(0, visible)
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yP(v).toFixed(1)}`)
    .join(" ");

  const posPath = positions
    .slice(0, visible)
    .map((v, i) => {
      if (i === 0) return `M${x(0).toFixed(1)},${yPos(v).toFixed(1)}`;
      const pv = positions[i - 1];
      return `L${x(i).toFixed(1)},${yPos(pv).toFixed(1)} L${x(i).toFixed(1)},${yPos(v).toFixed(1)}`;
    })
    .join(" ");

  const yLines = [0, 2, 4, 6, 8];
  const posLabels = [12, 9, 6, 3];

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      {yLines.map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={PAD.left + iW} y1={yP(v)} y2={yP(v)} stroke="#DDE4F0" strokeWidth="1" />
          <text x={PAD.left - 10} y={yP(v) + 5} textAnchor="end" fontSize="17" fill={GRAY}>
            {"\u20AC"}{v}
          </text>
        </g>
      ))}
      {posLabels.map((v) => (
        <text key={v} x={PAD.left + iW + 12} y={yPos(v) + 5} fontSize="17" fill={BLUE} fontWeight="600">
          #{v}
        </text>
      ))}
      <path d={pricePath} fill="none" stroke={SALMON} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={posPath} fill="none" stroke={BLUE} strokeWidth="3.5" strokeLinecap="round" />
      <line x1={PAD.left} x2={PAD.left + iW} y1={PAD.top + iH} y2={PAD.top + iH} stroke="#C7D6F5" strokeWidth="2" />
      {visible > 1 && (
        <>
          <circle cx={x(visible - 1)} cy={yP(prices[visible - 1])} r="8" fill={SALMON} />
          <circle cx={x(visible - 1)} cy={yPos(positions[visible - 1])} r="8" fill={BLUE} />
        </>
      )}
    </svg>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOp = fEase(frame, 0, 20, 0, 1);
  const titleOp = fEase(frame, 10, 40, 0, 1);
  const titleY = fEase(frame, 10, 40, 28, 0);
  const legendOp = fEase(frame, 30, 55, 0, 1);
  const chartOp = fEase(frame, 25, 55, 0, 1);
  const calloutOp = fEase(frame, 100, 128, 0, 1);

  const progress = fEase(frame, 30, 168, 0, 1, Easing.inOut(Easing.cubic));
  const float = wave(frame, 150, 3);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Logo opacity={logoOp} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 28,
        }}
      >
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <h1 style={{ fontSize: 68, fontWeight: 800, color: NAVY, margin: 0, letterSpacing: -1 }}>
            Live tracker
          </h1>
          <p style={{ fontSize: 26, color: GRAY, margin: "12px 0 0" }}>
            Jouw bod en positie in realtime
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 36, opacity: legendOp }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 4, background: SALMON, borderRadius: 2 }} />
            <span style={{ fontSize: 20, color: NAVY, fontWeight: 600 }}>Biedprijs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 4, background: BLUE, borderRadius: 2 }} />
            <span style={{ fontSize: 20, color: NAVY, fontWeight: 600 }}>Positie</span>
          </div>
        </div>

        {/* Chart */}
        <div
          style={{
            opacity: chartOp,
            transform: `translateY(${float}px)`,
            background: WHITE,
            borderRadius: 28,
            padding: "36px 48px 28px",
            boxShadow: "0 10px 48px rgba(27,46,94,0.10)",
          }}
        >
          <LiveChart progress={progress} />
        </div>

        {/* Callout */}
        <div
          style={{
            opacity: calloutOp,
            transform: `translateY(${fEase(frame, 100, 128, 12, 0)}px)`,
            background: BLUE_LIGHT,
            border: `2px solid ${BLUE}`,
            borderRadius: 16,
            padding: "18px 44px",
            fontSize: 23,
            color: BLUE,
            fontWeight: 600,
          }}
        >
          De positiesticker past je bod automatisch aan. Jij zit altijd op je plek.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 5  Conclusie ────────────────────────────────────────────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOp = fEase(frame, 0, 30, 0, 1);
  const logoOp = fEase(frame, 15, 45, 0, 1);
  const headOp = fEase(frame, 25, 55, 0, 1);
  const headY = fEase(frame, 25, 55, 24, 0);

  const steps = [
    { icon: "🔍", title: "Kies een artikel en zoekwoord", sub: "Je product en de zoekterm waarop je wilt scoren" },
    { icon: "💶", title: "Stel je maximaal bod in", sub: "Het maximale bedrag dat je per dag wilt betalen" },
    { icon: "📍", title: "Kies je gewenste positie", sub: "Jij bepaalt op welke plek je product staat" },
  ];

  const float = wave(frame, 160, 4);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily: "Inter, system-ui, sans-serif",
        opacity: bgOp,
      }}
    >
      {/* Decorative blobs – AdPal style */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: BLUE_MID,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: SALMON_LIGHT,
          opacity: 0.6,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 40,
          position: "relative",
        }}
      >
        {/* Logo */}
        <div style={{ opacity: logoOp }}>
          <Img src={LOGO_URL} style={{ height: 52, width: "auto", objectFit: "contain" }} />
        </div>

        {/* Heading */}
        <div
          style={{
            opacity: headOp,
            transform: `translateY(${headY}px)`,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 76, fontWeight: 800, color: NAVY, margin: 0, letterSpacing: -2 }}>
            Positiesticker
          </h1>
          <p style={{ fontSize: 30, color: BLUE, margin: "10px 0 0", fontWeight: 600 }}>
            Altijd je plek. Altijd de laagste prijs.
          </p>
        </div>

        {/* Dashboard card */}
        <div
          style={{
            transform: `translateY(${float}px)`,
            background: WHITE,
            borderRadius: 32,
            padding: "44px 60px",
            boxShadow: "0 16px 64px rgba(27,46,94,0.12)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            minWidth: 780,
          }}
        >
          {steps.map((s, i) => {
            const op = fEase(frame, 55 + i * 18, 78 + i * 18, 0, 1);
            const tx = fEase(frame, 55 + i * 18, 78 + i * 18, -30, 0);
            return (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  opacity: op,
                  transform: `translateX(${tx}px)`,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: i === 0 ? BLUE_LIGHT : i === 1 ? SALMON_LIGHT : GREEN_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: NAVY }}>{s.title}</div>
                  <div style={{ fontSize: 19, color: GRAY, marginTop: 3 }}>{s.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: BLUE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Divider + tagline */}
          <div
            style={{
              opacity: fEase(frame, 115, 138, 0, 1),
              borderTop: `2px solid ${BG}`,
              paddingTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 22, color: NAVY, fontWeight: 700 }}>
              Slimmer adverteren op bol.com
            </div>
            <div
              style={{
                background: BLUE,
                color: WHITE,
                borderRadius: 50,
                padding: "12px 32px",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Probeer nu
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
export const PositionStickerVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sequence from={S1} durationInFrames={180}>
        <Scene1 />
      </Sequence>
      <Sequence from={S2} durationInFrames={180}>
        <Scene2 />
      </Sequence>
      <Sequence from={S3} durationInFrames={180}>
        <Scene3 />
      </Sequence>
      <Sequence from={S4} durationInFrames={180}>
        <Scene4 />
      </Sequence>
      <Sequence from={S5} durationInFrames={180}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
