import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const SmartApproachScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // Main text animation
  const mainTextOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Feature cards animation
  const feature1Y = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 80 } });
  const feature2Y = spring({ frame: frame - 65, fps, config: { damping: 12, stiffness: 80 } });
  const feature3Y = spring({ frame: frame - 80, fps, config: { damping: 12, stiffness: 80 } });

  // Glow effect
  const glowIntensity = interpolate(Math.sin(frame * 0.12), [-1, 1], [30, 50]);

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
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Logo and title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 30,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.5)`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            fontFamily: 'system-ui',
          }}
        >
          Position<span style={{ color: '#22c55e' }}> Sticker</span>
        </h1>
      </div>

      {/* Main explanation */}
      <div
        style={{
          opacity: mainTextOpacity,
          textAlign: 'center',
          marginBottom: 50,
        }}
      >
        <h2
          style={{
            fontSize: 42,
            color: 'white',
            fontFamily: 'system-ui',
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Automatisch de beste positie, voor de laagste prijs
        </h2>
        <p
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'system-ui',
            maxWidth: 800,
          }}
        >
          Kies je gewenste positie en maximum bod — wij regelen de rest
        </p>
      </div>

      {/* Three feature cards */}
      <div
        style={{
          display: 'flex',
          gap: 32,
        }}
      >
        {/* Feature 1: Choose position */}
        <div
          style={{
            width: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 20,
            padding: 28,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            transform: `translateY(${(1 - Math.max(0, feature1Y)) * 40}px)`,
            opacity: Math.max(0, feature1Y),
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
            <span style={{ fontSize: 32 }}>🎯</span>
          </div>
          <h3
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'system-ui',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Kies je positie
          </h3>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'system-ui',
              lineHeight: 1.5,
            }}
          >
            Wil je #1 staan? Of liever #3? Jij bepaalt waar je product verschijnt
          </p>
        </div>

        {/* Feature 2: Set max bid */}
        <div
          style={{
            width: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 20,
            padding: 28,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            transform: `translateY(${(1 - Math.max(0, feature2Y)) * 40}px)`,
            opacity: Math.max(0, feature2Y),
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
            <span style={{ fontSize: 32 }}>💰</span>
          </div>
          <h3
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'system-ui',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Stel je maximum in
          </h3>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'system-ui',
              lineHeight: 1.5,
            }}
          >
            Je betaalt nooit meer dan jij wilt. Wij optimaliseren binnen jouw budget
          </p>
        </div>

        {/* Feature 3: We do the rest */}
        <div
          style={{
            width: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 20,
            padding: 28,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            transform: `translateY(${(1 - Math.max(0, feature3Y)) * 40}px)`,
            opacity: Math.max(0, feature3Y),
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
            <span style={{ fontSize: 32 }}>🤖</span>
          </div>
          <h3
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'system-ui',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Wij doen de rest
          </h3>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'system-ui',
              lineHeight: 1.5,
            }}
          >
            24/7 automatisch bieden. Altijd de laagste prijs voor jouw positie
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
