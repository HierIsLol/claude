import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Text fade in
  const textOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tagline slide up
  const taglineY = interpolate(frame, [45, 65], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glow pulse effect
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [20, 40]
  );

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Animated background particles */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {[...Array(20)].map((_, i) => {
          const x = (i * 97) % 100;
          const y = ((frame * 0.5 + i * 50) % 120) - 10;
          const size = 4 + (i % 3) * 2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.3)',
              }}
            />
          );
        })}
      </div>

      {/* Main Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.6)`,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Logo Text */}
        <div
          style={{
            opacity: textOpacity,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-2px',
            }}
          >
            Position
            <span style={{ color: '#22c55e' }}> Sticker</span>
          </h1>
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.8)',
          marginTop: 40,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 400,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Altijd op de positie die jij wilt
      </p>
    </AbsoluteFill>
  );
};
