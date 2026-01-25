import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Introducing" text
  const introducingOpacity = interpolate(frame, [0, 30, 60, 80], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  const introducingY = interpolate(frame, [0, 30], [30, 0], {
    extrapolateRight: 'clamp',
  });

  // Product name reveal
  const nameOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const nameScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Animated ring
  const ringScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const ringRotation = interpolate(frame, [80, 240], [0, 360], {
    extrapolateRight: 'clamp',
  });

  // Glow pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [40, 80]
  );

  // Value propositions
  const prop1Opacity = interpolate(frame, [160, 180], [0, 1], { extrapolateRight: 'clamp' });
  const prop2Opacity = interpolate(frame, [180, 200], [0, 1], { extrapolateRight: 'clamp' });
  const prop3Opacity = interpolate(frame, [200, 220], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)`,
          filter: `blur(${glowPulse}px)`,
          opacity: nameOpacity,
        }}
      />

      {/* Animated ring */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          transform: `scale(${Math.max(0, ringScale)}) rotate(${ringRotation}deg)`,
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          transform: `scale(${Math.max(0, ringScale)}) rotate(${-ringRotation * 0.5}deg)`,
          opacity: 0.3,
        }}
      />

      {/* Introducing text */}
      <p
        style={{
          position: 'absolute',
          top: '30%',
          fontSize: 24,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          opacity: introducingOpacity,
          transform: `translateY(${introducingY}px)`,
        }}
      >
        Introductie
      </p>

      {/* Product name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `scale(${Math.max(0.8, nameScale)})`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-4px',
            margin: 0,
            lineHeight: 1,
          }}
        >
          Position
        </h1>
        <h1
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: '#22c55e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-4px',
            margin: 0,
            marginTop: -10,
            lineHeight: 1,
            textShadow: `0 0 ${glowPulse}px rgba(34, 197, 94, 0.5)`,
          }}
        >
          Sticker
        </h1>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.7)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          fontWeight: 400,
          marginTop: 40,
          opacity: taglineOpacity,
          letterSpacing: '-0.5px',
        }}
      >
        Jouw positie. Automatisch. Altijd.
      </p>

      {/* Value propositions */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          marginTop: 80,
          position: 'absolute',
          bottom: '15%',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            opacity: prop1Opacity,
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: '#22c55e',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Laagste bod
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              marginTop: 8,
            }}
          >
            Nooit meer betalen dan nodig
          </p>
        </div>

        <div
          style={{
            width: 1,
            height: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity: prop2Opacity,
          }}
        />

        <div
          style={{
            textAlign: 'center',
            opacity: prop2Opacity,
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: '#22c55e',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            24/7 Actief
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              marginTop: 8,
            }}
          >
            Ook als jij slaapt
          </p>
        </div>

        <div
          style={{
            width: 1,
            height: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity: prop3Opacity,
          }}
        />

        <div
          style={{
            textAlign: 'center',
            opacity: prop3Opacity,
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: '#22c55e',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Direct reageren
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              marginTop: 8,
            }}
          >
            Op elke concurrent
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
