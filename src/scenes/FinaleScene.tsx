import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo reveal
  const logoOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const taglineY = interpolate(frame, [50, 80], [30, 0], {
    extrapolateRight: 'clamp',
  });

  // CTA
  const ctaOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const ctaScale = spring({
    frame: frame - 100,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // URL
  const urlOpacity = interpolate(frame, [140, 170], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glow effect
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [40, 80]
  );

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 73) % 100,
    delay: (i * 17) % 40,
    size: 2 + (i % 3),
    speed: 0.2 + (i % 4) * 0.08,
  }));

  // Fade to end
  const endFade = interpolate(frame, [200, 240], [0, 1], {
    extrapolateRight: 'clamp',
  });

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
        const particleY = ((frame - p.delay) * p.speed) % 110;
        const particleOpacity = logoOpacity * 0.4 * (1 - particleY / 110);
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
              opacity: particleOpacity,
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)`,
          filter: `blur(${glowIntensity}px)`,
          opacity: logoOpacity,
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${Math.max(0.8, logoScale)})`,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 25,
            background: 'linear-gradient(145deg, #22c55e 0%, #15803d 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.4), 0 20px 50px rgba(0, 0, 0, 0.3)`,
            margin: '0 auto',
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Product name */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${Math.max(0.9, logoScale)})`,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-2px',
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
          fontSize: 26,
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          fontWeight: 400,
          marginTop: 16,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          letterSpacing: '-0.5px',
        }}
      >
        Domineer bol.com sponsored products
      </p>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 60,
          opacity: ctaOpacity,
          transform: `scale(${Math.max(0.9, ctaScale)})`,
        }}
      >
        <div
          style={{
            padding: '20px 50px',
            background: 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: 50,
            boxShadow: `0 10px 40px rgba(34, 197, 94, 0.3), 0 0 ${glowIntensity * 0.5}px rgba(34, 197, 94, 0.2)`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: 'white',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-0.5px',
            }}
          >
            Start vandaag nog
          </span>
        </div>
      </div>

      {/* URL */}
      <p
        style={{
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.4)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          fontWeight: 400,
          marginTop: 30,
          opacity: urlOpacity,
        }}
      >
        ad-pal.com
      </p>

      {/* Fade to black at end */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black',
          opacity: endFade,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
