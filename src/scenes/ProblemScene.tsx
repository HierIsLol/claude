import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Title animation
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Problems list animation
  const problem1Opacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });
  const problem2Opacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' });
  const problem3Opacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: 'clamp' });

  // Frustrated seller animation
  const sellerY = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Question mark pulse
  const questionPulse = 1 + Math.sin(frame * 0.15) * 0.1;

  // Bottom text animation
  const bottomTextOpacity = interpolate(frame, [150, 170], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: sceneOpacity,
      }}
    >
      {/* Main title */}
      <h1
        style={{
          fontSize: 64,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 800,
          marginBottom: 60,
          textAlign: 'center',
          transform: `scale(${titleScale})`,
        }}
      >
        Sponsored Products op{' '}
        <span style={{ color: '#0066cc' }}>bol.com</span>?
      </h1>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          gap: 80,
          alignItems: 'center',
        }}
      >
        {/* Left: Frustrated seller visual */}
        <div
          style={{
            transform: `translateY(${(1 - sellerY) * 30}px)`,
            opacity: sellerY,
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
              border: '3px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 100 }}>😫</span>
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 48,
                transform: `scale(${questionPulse})`,
              }}
            >
              ❓
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                fontSize: 36,
              }}
            >
              💸
            </div>
          </div>
        </div>

        {/* Right: Problems list */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Problem 1 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: problem1Opacity,
              transform: `translateX(${(1 - problem1Opacity) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 28 }}>🎯</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'system-ui',
                }}
              >
                Te hoog bieden om zeker te zijn?
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'system-ui',
                }}
              >
                Je betaalt veel meer dan nodig
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: problem2Opacity,
              transform: `translateX(${(1 - problem2Opacity) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 28 }}>⏰</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'system-ui',
                }}
              >
                Constant handmatig aanpassen?
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'system-ui',
                }}
              >
                Kost veel te veel tijd
              </div>
            </div>
          </div>

          {/* Problem 3 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: problem3Opacity,
              transform: `translateX(${(1 - problem3Opacity) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 28 }}>📉</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'system-ui',
                }}
              >
                Positie kwijt aan concurrenten?
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'system-ui',
                }}
              >
                Je mist sales terwijl je slaapt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom question */}
      <div
        style={{
          marginTop: 60,
          opacity: bottomTextOpacity,
        }}
      >
        <span
          style={{
            fontSize: 36,
            color: '#ef4444',
            fontFamily: 'system-ui',
            fontWeight: 700,
          }}
        >
          Er moet toch een slimmere manier zijn?
        </span>
      </div>
    </AbsoluteFill>
  );
};
