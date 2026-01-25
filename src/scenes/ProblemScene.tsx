import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Split screen panels slide in
  const leftPanelX = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const rightPanelX = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Bid amount typing animation
  const bidAmount = interpolate(frame, [30, 60], [0, 2.50], {
    extrapolateRight: 'clamp',
  });

  // Red X animation
  const showRedX = frame > 120;
  const redXScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Title animation
  const titleOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Bottom text animation
  const bottomTextOpacity = interpolate(frame, [150, 170], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Shake effect on left panel when X appears
  const shakeX = showRedX ? Math.sin(frame * 0.8) * 4 : 0;

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
      {/* Main question */}
      <h2
        style={{
          fontSize: 52,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 50,
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        Wil jij positie 1? Dan moet je toch{' '}
        <span style={{ color: '#ef4444' }}>SKY-HIGH</span> bieden?
      </h2>

      {/* Split screen container */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {/* Left panel - Your manual bid */}
        <div
          style={{
            width: 450,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 24,
            padding: 32,
            border: '2px solid rgba(239, 68, 68, 0.3)',
            transform: `translateX(${(1 - leftPanelX) * -100}px) translateX(${shakeX}px)`,
            opacity: leftPanelX,
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'system-ui',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Jouw bod (handmatig)
          </div>

          {/* Seller avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 28 }}>😰</span>
            </div>
            <span
              style={{
                color: 'white',
                fontSize: 24,
                fontFamily: 'system-ui',
                fontWeight: 600,
              }}
            >
              Jij
            </span>
          </div>

          {/* Bid input */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 16,
              padding: '24px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'system-ui',
                marginBottom: 8,
              }}
            >
              Je bod voor positie #1
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: '#ef4444',
                fontFamily: 'system-ui',
              }}
            >
              €{bidAmount.toFixed(2)}
            </div>
          </div>

          {/* Position badge */}
          <div
            style={{
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'system-ui',
              }}
            >
              "Moet wel zo hoog om zeker te zijn..."
            </span>
          </div>

          {/* Big Red X overlay */}
          {showRedX && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `scale(${Math.max(0, redXScale)})`,
              }}
            >
              <svg width="300" height="300" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="rgba(239, 68, 68, 0.9)" />
                <path
                  d="M30 30 L70 70 M70 30 L30 70"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* VS divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24,
              fontWeight: 800,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'system-ui',
            }}
          >
            VS
          </div>
        </div>

        {/* Right panel - Competitor at #1 */}
        <div
          style={{
            width: 450,
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 24,
            padding: 32,
            border: '2px solid rgba(34, 197, 94, 0.3)',
            transform: `translateX(${(1 - rightPanelX) * 100}px)`,
            opacity: rightPanelX,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'system-ui',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Concurrent op #1
          </div>

          {/* Competitor avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 28 }}>😎</span>
            </div>
            <span
              style={{
                color: 'white',
                fontSize: 24,
                fontFamily: 'system-ui',
                fontWeight: 600,
              }}
            >
              Concurrent
            </span>
          </div>

          {/* Competitor bid */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 16,
              padding: '24px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'system-ui',
                marginBottom: 8,
              }}
            >
              Staat op positie #1 met
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              €0.85
            </div>
          </div>

          {/* Position badge */}
          <div
            style={{
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: '#f0fdf4',
                color: '#22c55e',
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'system-ui',
              }}
            >
              Positie #1 ✓
            </span>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          marginTop: 50,
          textAlign: 'center',
          opacity: bottomTextOpacity,
        }}
      >
        <span
          style={{
            fontSize: 36,
            color: 'white',
            fontFamily: 'system-ui',
            fontWeight: 600,
          }}
        >
          €2.50 om zeker positie 1 te zijn?{' '}
          <span style={{ fontSize: 40 }}>💸</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
