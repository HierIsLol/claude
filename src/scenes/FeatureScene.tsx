import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const FeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Feature 1: Position Selection (0-90 frames)
  // Feature 2: Auto Optimization (90-180 frames)
  // Feature 3: Real-time Response (180-270 frames)
  // Feature 4: Result (270-360 frames)

  const currentFeature = Math.floor(frame / 90);

  // Feature 1 animations
  const f1Opacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const f1Scale = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  // Feature 2 animations
  const f2Opacity = interpolate(frame, [90, 110, 160, 180], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const f2Scale = spring({ frame: frame - 90, fps, config: { damping: 15, stiffness: 100 } });

  // Feature 3 animations
  const f3Opacity = interpolate(frame, [180, 200, 250, 270], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const f3Scale = spring({ frame: frame - 180, fps, config: { damping: 15, stiffness: 100 } });

  // Feature 4 animations
  const f4Opacity = interpolate(frame, [270, 290, 340, 360], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const f4Scale = spring({ frame: frame - 270, fps, config: { damping: 15, stiffness: 100 } });

  // Position indicator animation for feature 1
  const positionValue = interpolate(frame, [20, 60], [5, 1], { extrapolateRight: 'clamp' });

  // Bid optimization animation for feature 2
  const bidOptimize = interpolate(frame, [110, 160], [2.50, 0.85], { extrapolateRight: 'clamp' });

  // Response time counter for feature 3 (15 -> 5)
  const responseTime = interpolate(frame, [200, 240], [15, 5], { extrapolateRight: 'clamp' });

  // Subtle floating animation for liveliness
  const floatY = Math.sin(frame * 0.05) * 8;
  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.6]);

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
          background: `radial-gradient(circle, rgba(34, 197, 94, ${glowPulse * 0.15}) 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Feature 1: Kies je positie */}
      <div
        style={{
          position: 'absolute',
          opacity: f1Opacity,
          transform: `scale(${Math.max(0.9, f1Scale)}) translateY(${floatY}px)`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: '#22c55e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 30,
          }}
        >
          Kies je positie
        </p>

        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            lineHeight: 1,
            textShadow: `0 0 ${40 + glowPulse * 40}px rgba(34, 197, 94, ${glowPulse})`,
          }}
        >
          #{Math.round(positionValue)}
        </div>

        <p
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            marginTop: 30,
          }}
        >
          Jij bepaalt waar je wilt staan
        </p>
      </div>

      {/* Feature 2: Automatische optimalisatie */}
      <div
        style={{
          position: 'absolute',
          opacity: f2Opacity,
          transform: `scale(${Math.max(0.9, f2Scale)}) translateY(${floatY}px)`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: '#22c55e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 30,
          }}
        >
          Automatisch geoptimaliseerd
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                margin: 0,
                textDecoration: 'line-through',
              }}
            >
              Handmatig
            </p>
            <p
              style={{
                fontSize: 60,
                color: 'rgba(255, 255, 255, 0.3)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                fontWeight: 600,
                margin: 0,
                textDecoration: 'line-through',
              }}
            >
              €2.50
            </p>
          </div>

          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div style={{ textAlign: 'left' }}>
            <p
              style={{
                fontSize: 24,
                color: '#22c55e',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                margin: 0,
              }}
            >
              Position Sticker
            </p>
            <p
              style={{
                fontSize: 80,
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                fontWeight: 700,
                margin: 0,
              }}
            >
              €{bidOptimize.toFixed(2)}
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            marginTop: 40,
          }}
        >
          Altijd de laagst mogelijke prijs
        </p>
      </div>

      {/* Feature 3: Real-time response */}
      <div
        style={{
          position: 'absolute',
          opacity: f3Opacity,
          transform: `scale(${Math.max(0.9, f3Scale)}) translateY(${floatY}px)`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: '#22c55e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 30,
          }}
        >
          Razendsnelle reactie
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 180,
              fontWeight: 700,
              color: 'white',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              lineHeight: 1,
            }}
          >
            {Math.round(responseTime)}
          </span>
          <span
            style={{
              fontSize: 48,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            min
          </span>
        </div>

        <p
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            marginTop: 30,
          }}
        >
          Check interval. Direct reageren op concurrentie.
        </p>
      </div>

      {/* Feature 4: Het resultaat */}
      <div
        style={{
          position: 'absolute',
          opacity: f4Opacity,
          transform: `scale(${Math.max(0.9, f4Scale)}) translateY(${floatY}px)`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: '#22c55e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
        >
          Het resultaat
        </p>

        <div
          style={{
            display: 'flex',
            gap: 80,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                margin: 0,
              }}
            >
              #1
            </p>
            <p
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                marginTop: 10,
              }}
            >
              Jouw positie
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#22c55e',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                margin: 0,
              }}
            >
              24/7
            </p>
            <p
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                marginTop: 10,
              }}
            >
              Automatisch
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                margin: 0,
              }}
            >
              0
            </p>
            <p
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                marginTop: 10,
              }}
            >
              Gedoe
            </p>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          display: 'flex',
          gap: 12,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: currentFeature === i ? 32 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentFeature === i ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
