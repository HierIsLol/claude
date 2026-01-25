import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const OutroScene: React.FC = () => {
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
    config: { damping: 12, stiffness: 100 },
  });

  // CTA button animation
  const ctaScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Tagline animation
  const taglineOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Features list animation
  const feature1Opacity = interpolate(frame, [45, 55], [0, 1], { extrapolateRight: 'clamp' });
  const feature2Opacity = interpolate(frame, [50, 60], [0, 1], { extrapolateRight: 'clamp' });
  const feature3Opacity = interpolate(frame, [55, 65], [0, 1], { extrapolateRight: 'clamp' });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [30, 60]
  );

  // Button pulse
  const buttonPulse = 1 + Math.sin(frame * 0.2) * 0.03;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a0a 30%, #1a2a1a 70%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: sceneOpacity,
      }}
    >
      {/* Animated background glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.6)`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>
        <h1
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-2px',
          }}
        >
          Position<span style={{ color: '#22c55e' }}> Sticker</span>
        </h1>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 32,
          color: 'white',
          fontFamily: 'system-ui',
          fontWeight: 600,
          marginBottom: 40,
          opacity: taglineOpacity,
          textAlign: 'center',
        }}
      >
        Altijd op de positie die jij wilt
      </p>

      {/* Features list */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginBottom: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: feature1Opacity,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 20, fontFamily: 'system-ui' }}>
            Kies je keyword
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: feature2Opacity,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 20, fontFamily: 'system-ui' }}>
            Stel je max bod in
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: feature3Opacity,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 20, fontFamily: 'system-ui' }}>
            Wij doen de rest
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          transform: `scale(${Math.max(0, ctaScale) * buttonPulse})`,
        }}
      >
        <div
          style={{
            padding: '24px 64px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: 16,
            boxShadow: `0 8px 32px rgba(34, 197, 94, 0.4), 0 0 ${glowIntensity}px rgba(34, 197, 94, 0.3)`,
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'white',
              fontFamily: 'system-ui',
            }}
          >
            Start nu gratis
          </span>
        </div>
      </div>

      {/* Subtext */}
      <p
        style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'system-ui',
          marginTop: 20,
          opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Geen creditcard nodig • Direct aan de slag
      </p>
    </AbsoluteFill>
  );
};
