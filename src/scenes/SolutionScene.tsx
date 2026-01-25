import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Card animations
  const card1Scale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const card2Scale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const card3Scale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Checkmark animations
  const check1Opacity = interpolate(frame, [60, 70], [0, 1], { extrapolateRight: 'clamp' });
  const check2Opacity = interpolate(frame, [75, 85], [0, 1], { extrapolateRight: 'clamp' });
  const check3Opacity = interpolate(frame, [90, 100], [0, 1], { extrapolateRight: 'clamp' });

  // Bid value animation
  const bidValue = interpolate(frame, [30, 70], [0, 5], { extrapolateRight: 'clamp' });

  // Position target animation
  const targetPosition = Math.round(interpolate(frame, [40, 60], [5, 1], { extrapolateRight: 'clamp' }));

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a1a0a 0%, #0f2a1a 50%, #0a1a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: sceneOpacity,
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: 52,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 60,
          textAlign: 'center',
        }}
      >
        Met <span style={{ color: '#22c55e' }}>Position Sticker</span> bepaal jij
      </h2>

      {/* Three feature cards */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
        }}
      >
        {/* Card 1: Keyword Selection */}
        <div
          style={{
            width: 320,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 20,
            padding: 32,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            transform: `scale(${Math.max(0, card1Scale)})`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#22c55e" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h3
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'system-ui',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Kies je keyword
          </h3>
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 8,
              padding: '10px 16px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            <span style={{ color: '#22c55e', fontSize: 18, fontFamily: 'monospace' }}>
              "eiwitpoeder"
            </span>
          </div>
          <div style={{ opacity: check1Opacity, marginTop: 16, textAlign: 'center' }}>
            <span style={{ color: '#22c55e', fontSize: 28 }}>✓</span>
          </div>
        </div>

        {/* Card 2: Position Selection */}
        <div
          style={{
            width: 320,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 20,
            padding: 32,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            transform: `scale(${Math.max(0, card2Scale)})`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke="#22c55e" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h3
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'system-ui',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Kies je positie
          </h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              #{targetPosition}
            </span>
          </div>
          <div style={{ opacity: check2Opacity, marginTop: 16, textAlign: 'center' }}>
            <span style={{ color: '#22c55e', fontSize: 28 }}>✓</span>
          </div>
        </div>

        {/* Card 3: Max Bid */}
        <div
          style={{
            width: 320,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 20,
            padding: 32,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            transform: `scale(${Math.max(0, card3Scale)})`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'system-ui',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Stel je max bod in
          </h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              €{bidValue.toFixed(2)}
            </span>
          </div>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 14,
              textAlign: 'center',
              marginTop: 8,
              fontFamily: 'system-ui',
            }}
          >
            Je betaalt nooit meer
          </p>
          <div style={{ opacity: check3Opacity, marginTop: 8, textAlign: 'center' }}>
            <span style={{ color: '#22c55e', fontSize: 28 }}>✓</span>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <p
        style={{
          fontSize: 28,
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: 'system-ui',
          marginTop: 50,
          opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Wij zorgen dat je daar <span style={{ color: '#22c55e', fontWeight: 700 }}>altijd</span> staat
      </p>
    </AbsoluteFill>
  );
};
