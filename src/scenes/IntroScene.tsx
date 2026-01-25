import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade from complete black
  const blackOverlay = interpolate(frame, [0, 60], [1, 0], {
    extrapolateRight: 'clamp',
  });

  // Logo icon scale - dramatic pop
  const iconScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1.2 },
  });

  // Logo glow intensity
  const glowIntensity = interpolate(frame, [60, 120], [0, 60], {
    extrapolateRight: 'clamp',
  });

  // Text fade in - staggered
  const textOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const textY = interpolate(frame, [80, 120], [40, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Particles floating up
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 67) % 100,
    delay: (i * 23) % 60,
    size: 2 + (i % 3),
    speed: 0.3 + (i % 5) * 0.1,
  }));

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Floating particles */}
      {particles.map((p, i) => {
        const particleY = ((frame - p.delay) * p.speed) % 120;
        const particleOpacity = interpolate(
          frame,
          [40 + p.delay, 60 + p.delay],
          [0, 0.3],
          { extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              bottom: `${particleY}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              opacity: particleOpacity * (1 - particleY / 120),
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(34, 197, 94, ${glowIntensity * 0.003}) 0%, transparent 70%)`,
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Logo icon */}
      <div
        style={{
          transform: `scale(${Math.max(0, iconScale)})`,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 35,
            background: 'linear-gradient(145deg, #22c55e 0%, #15803d 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.5), 0 20px 60px rgba(0, 0, 0, 0.5)`,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Logo text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-3px',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Position Sticker
        </h1>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 28,
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          fontWeight: 400,
          marginTop: 20,
          opacity: taglineOpacity,
          letterSpacing: '0.5px',
        }}
      >
        De toekomst van sponsored products
      </p>

      {/* Black overlay for fade from black */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          opacity: blackOverlay,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
