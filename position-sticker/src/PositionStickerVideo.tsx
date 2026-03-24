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

// ─── Design tokens ───────────────────────────────────────────────────────────
const BLUE = "#1E4FD8";
const BLUE_LIGHT = "#3B6EF8";
const BG = "#F4F6FB";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#1A2340";
const TEXT_MID = "#4B5778";
const TEXT_LIGHT = "#8A94AE";
const BORDER = "#D8DFF0";
const FONT = "'Inter', 'Segoe UI', sans-serif";
const AIRPODS_URL =
  "https://media.s-bol.com/JkxZ9DgNKEzv/kRBJ8qK/550x512.jpg";

// ─── Gentle float helper (hospital / breathing rhythm) ───────────────────────
function useFloat(
  amplitude = 6,
  period = 90,
  offset = 0
): number {
  const frame = useCurrentFrame();
  return Math.sin(((frame + offset) / period) * 2 * Math.PI) * amplitude;
}

// ─── Fade-in helper ───────────────────────────────────────────────────────────
function useFadeIn(startFrame: number, durationFrames = 20): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Spring helper ────────────────────────────────────────────────────────────
function useSpringFrom(
  startFrame: number,
  fps: number,
  from = 40,
  config = { damping: 18, mass: 0.6 }
): number {
  const frame = useCurrentFrame();
  const s = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config,
  });
  return interpolate(s, [0, 1], [from, 0]);
}

// ─── Shared card shell ────────────────────────────────────────────────────────
const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: WHITE,
      borderRadius: 16,
      boxShadow: "0 4px 32px rgba(30,79,216,0.10)",
      border: `1.5px solid ${BORDER}`,
      padding: "28px 32px",
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Step label badge ─────────────────────────────────────────────────────────
const StepBadge: React.FC<{ n: number }> = ({ n }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: BLUE,
      color: WHITE,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 15,
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);

// ─── Position slot ────────────────────────────────────────────────────────────
const PositionSlot: React.FC<{
  rank: number;
  filled?: boolean;
  product?: string;
  highlight?: boolean;
  floatY?: number;
}> = ({ rank, filled = false, product, highlight = false, floatY = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 10,
      transform: `translateY(${floatY}px)`,
      transition: "transform 0.1s",
    }}
  >
    {/* Rank badge */}
    <div
      style={{
        width: 64,
        height: 64,
        background: highlight ? BLUE_LIGHT : BLUE,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: highlight
          ? `0 0 0 3px rgba(59,110,248,0.4), 0 4px 16px rgba(30,79,216,0.3)`
          : "none",
      }}
    >
      <span
        style={{
          color: WHITE,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        #{rank}
      </span>
      <span
        style={{
          color: "rgba(255,255,255,0.7)",
          fontFamily: FONT,
          fontSize: 11,
        }}
      >
        ?%
      </span>
    </div>

    {/* Content */}
    <div
      style={{
        flex: 1,
        background: filled ? "rgba(30,79,216,0.04)" : BG,
        borderRadius: 10,
        border: `1.5px solid ${highlight ? BLUE_LIGHT : BORDER}`,
        padding: "10px 18px",
        minHeight: 44,
        display: "flex",
        alignItems: "center",
      }}
    >
      {filled && product ? (
        <span
          style={{
            fontFamily: FONT,
            fontSize: 14,
            color: TEXT_DARK,
            fontWeight: 600,
          }}
        >
          {product}
        </span>
      ) : (
        <span
          style={{ fontFamily: FONT, fontSize: 14, color: TEXT_LIGHT }}
        >
          {rank}e positie
        </span>
      )}
    </div>
  </div>
);

// ─── Product card ─────────────────────────────────────────────────────────────
const ProductCard: React.FC<{ floatY?: number; opacity?: number }> = ({
  floatY = 0,
  opacity = 1,
}) => (
  <div
    style={{
      transform: `translateY(${floatY}px)`,
      opacity,
      background: WHITE,
      borderRadius: 14,
      border: `1.5px solid ${BORDER}`,
      boxShadow: "0 4px 24px rgba(30,79,216,0.10)",
      padding: "18px 22px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      width: 380,
    }}
  >
    <Img
      src={AIRPODS_URL}
      style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 8 }}
    />
    <div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 14,
          color: TEXT_DARK,
          marginBottom: 4,
        }}
      >
        Apple AirPods 4 - met reguliere oplaadcase (USB-C)
      </div>
      <div style={{ fontFamily: FONT, fontSize: 12, color: TEXT_LIGHT }}>
        0195949688591
      </div>
    </div>
  </div>
);

// ─── Scenes ───────────────────────────────────────────────────────────────────

// Scene 1: Intro title  (frames 0-89)
const SceneIntro: React.FC = () => {
  const { fps } = useVideoConfig();
  const floatY = useFloat(8, 100, 0);
  const titleOpacity = useFadeIn(10);
  const subOpacity = useFadeIn(30);
  const titleY = useSpringFrom(10, fps, 30);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* floating bg circles */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(30,79,216,0.06)",
          top: -80,
          right: -80,
          transform: `translateY(${floatY * 0.5}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(30,79,216,0.05)",
          bottom: -60,
          left: -60,
          transform: `translateY(${-floatY * 0.4}px)`,
        }}
      />

      {/* ADPAL brand pill */}
      <div
        style={{
          opacity: subOpacity,
          background: "rgba(30,79,216,0.10)",
          borderRadius: 999,
          padding: "6px 20px",
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          color: BLUE,
          letterSpacing: 2,
          marginBottom: 24,
        }}
      >
        ADPAL
      </div>

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY + floatY * 0.3}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 900,
            color: TEXT_DARK,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Positionering
        </h1>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 22,
            color: TEXT_MID,
            margin: "16px 0 0",
          }}
        >
          Hoe werkt de positiesticker?
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Step 1 — Kies een artikel (frames 90-179)
const SceneStep1: React.FC = () => {
  const { fps } = useVideoConfig();
  const floatY = useFloat(6, 90, 10);
  const cardOpacity = useFadeIn(5);
  const cardY = useSpringFrom(5, fps, 50);
  const labelOpacity = useFadeIn(15);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* Step header */}
      <div
        style={{
          opacity: labelOpacity,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <StepBadge n={1} />
        <span
          style={{
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 800,
            color: TEXT_DARK,
          }}
        >
          Kies een artikel
        </span>
      </div>

      {/* Floating product card */}
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY + floatY}px)`,
        }}
      >
        <ProductCard />
      </div>

      <p
        style={{
          opacity: labelOpacity,
          fontFamily: FONT,
          fontSize: 16,
          color: TEXT_MID,
          margin: 0,
          textAlign: "center",
        }}
      >
        Selecteer het product dat je wilt positioneren
      </p>
    </AbsoluteFill>
  );
};

// Scene 3: Step 2 — Kies de gewenste plaatsing (frames 180-269)
const SceneStep2: React.FC = () => {
  const { fps } = useVideoConfig();
  const floatY = useFloat(5, 85, 20);
  const labelOpacity = useFadeIn(5);
  const slotsOpacity = useFadeIn(15);
  const slotsY = useSpringFrom(15, fps, 40);

  const slots = [1, 2, 3, 4, 5, 6];

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
        padding: "0 80px",
      }}
    >
      {/* Left: step label */}
      <div
        style={{
          flex: 1,
          opacity: labelOpacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <StepBadge n={2} />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 800,
              color: TEXT_DARK,
            }}
          >
            Kies de gewenste plaatsing
          </span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 16, color: TEXT_MID, margin: 0, lineHeight: 1.6 }}>
          Selecteer op welke positie je wilt verschijnen in de zoekresultaten.
        </p>
        <div
          style={{
            marginTop: 24,
            background: "rgba(30,79,216,0.08)",
            borderRadius: 10,
            padding: "12px 18px",
            fontFamily: FONT,
            fontSize: 14,
            color: BLUE,
            fontWeight: 600,
          }}
        >
          €1,99 per product / dag
        </div>
      </div>

      {/* Right: slots */}
      <div
        style={{
          flex: 1,
          opacity: slotsOpacity,
          transform: `translateY(${slotsY + floatY}px)`,
        }}
      >
        {slots.map((rank) => (
          <PositionSlot key={rank} rank={rank} floatY={0} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Step 3 — Kies de gewenste plek (frames 270-349)
const SceneStep3: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const floatY = useFloat(5, 88, 5);
  const labelOpacity = useFadeIn(5);

  // Product moves from left into #1 slot
  const progress = spring({
    fps,
    frame: Math.max(0, frame - 20),
    config: { damping: 20, mass: 0.7 },
  });

  const productX = interpolate(progress, [0, 1], [-260, 0]);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
        padding: "0 80px",
      }}
    >
      {/* Left: step label + product */}
      <div style={{ flex: 1, opacity: labelOpacity }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <StepBadge n={3} />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 800,
              color: TEXT_DARK,
            }}
          >
            Kies de gewenste plek
          </span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 16, color: TEXT_MID, margin: 0, lineHeight: 1.6 }}>
          Sleep het artikel naar de positie waar je wilt staan.
        </p>

        {/* product card slides in */}
        <div
          style={{
            marginTop: 28,
            transform: `translateX(${productX}px) translateY(${floatY}px)`,
            opacity: labelOpacity,
          }}
        >
          <ProductCard />
        </div>
      </div>

      {/* Right: slots, first one highlighted */}
      <div
        style={{
          flex: 1,
          transform: `translateY(${floatY * 0.5}px)`,
          opacity: labelOpacity,
        }}
      >
        <PositionSlot
          rank={1}
          highlight={progress > 0.6}
          filled={progress > 0.85}
          product="Apple AirPods 4 - met reguliere oplaadcase (USB-C)"
        />
        {[2, 3, 4, 5, 6].map((r) => (
          <PositionSlot key={r} rank={r} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Step 4 — Kies je maximale bieding (frames 350-419)
const SceneStep4: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const floatY = useFloat(6, 92, 30);
  const labelOpacity = useFadeIn(5);
  const cardY = useSpringFrom(10, fps, 50);

  // Animate the price value up
  const price = interpolate(frame, [20, 55], [0, 2.49], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const bidWon = frame > 55;

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 36,
        padding: "0 120px",
      }}
    >
      {/* Step label */}
      <div
        style={{
          opacity: labelOpacity,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <StepBadge n={4} />
        <span
          style={{
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 800,
            color: TEXT_DARK,
          }}
        >
          Kies wat je maximaal wil bieden
        </span>
      </div>

      {/* Main card */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${cardY + floatY}px)`,
          width: "100%",
          maxWidth: 640,
        }}
      >
        <Card>
          {/* Bid input simulation */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                fontFamily: FONT,
                fontSize: 13,
                color: TEXT_MID,
                fontWeight: 600,
                letterSpacing: 0.5,
                display: "block",
                marginBottom: 10,
              }}
            >
              MAXIMALE BIEDING
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: BG,
                border: `2px solid ${BLUE}`,
                borderRadius: 12,
                padding: "14px 20px",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 22,
                  fontWeight: 700,
                  color: BLUE,
                }}
              >
                €
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 800,
                  color: TEXT_DARK,
                  minWidth: 80,
                }}
              >
                {price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Result explanation */}
          <div
            style={{
              opacity: bidWon
                ? interpolate(frame, [55, 70], [0, 1], {
                    extrapolateRight: "clamp",
                  })
                : 0,
              background: "rgba(30,79,216,0.06)",
              borderRadius: 12,
              padding: "16px 20px",
              borderLeft: `4px solid ${BLUE}`,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 15,
                color: TEXT_DARK,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Hoe werkt de bieding?
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 14,
                color: TEXT_MID,
                lineHeight: 1.7,
              }}
            >
              Je krijgt de plek als je bod <strong>binnen het bereik</strong> zit
              — voor de <strong>laagst mogelijke bieding</strong>.
              <br />
              Je betaalt nooit meer dan nodig is.
            </div>
          </div>
        </Card>
      </div>

      {/* #1 badge floating */}
      <div
        style={{
          opacity: bidWon
            ? interpolate(frame, [60, 75], [0, 1], {
                extrapolateRight: "clamp",
              })
            : 0,
          transform: `translateY(${-floatY}px)`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: BLUE,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(30,79,216,0.35)",
          }}
        >
          <span style={{ color: WHITE, fontFamily: FONT, fontWeight: 800, fontSize: 16 }}>#1</span>
        </div>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>
            Apple AirPods 4 staat op positie #1
          </div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: TEXT_MID }}>
            Je betaalt de laagst mogelijke prijs
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Background pulse circles (hospital feel) ─────────────────────────────────
const PulseBg: React.FC = () => {
  const frame = useCurrentFrame();
  const scale1 = 1 + Math.sin((frame / 120) * 2 * Math.PI) * 0.04;
  const scale2 = 1 + Math.sin((frame / 150) * 2 * Math.PI + 1) * 0.03;

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(30,79,216,0.04)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%,-50%) scale(${scale1})`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "rgba(30,79,216,0.025)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%,-50%) scale(${scale2})`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
export const PositionStickerVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <PulseBg />

      {/* Scene 1: Intro — 0..89 */}
      <Sequence from={0} durationInFrames={90}>
        <SceneIntro />
      </Sequence>

      {/* Scene 2: Step 1 — 90..179 */}
      <Sequence from={90} durationInFrames={90}>
        <SceneStep1 />
      </Sequence>

      {/* Scene 3: Step 2 — 180..269 */}
      <Sequence from={180} durationInFrames={90}>
        <SceneStep2 />
      </Sequence>

      {/* Scene 4: Step 3 — 270..349 */}
      <Sequence from={270} durationInFrames={80}>
        <SceneStep3 />
      </Sequence>

      {/* Scene 5: Step 4 — 350..419 */}
      <Sequence from={350} durationInFrames={70}>
        <SceneStep4 />
      </Sequence>
    </AbsoluteFill>
  );
};
