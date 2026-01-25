import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const SmartApproachScene: React.FC = () => {
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

  // Interface card animation
  const cardY = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Slider animation (position selection)
  const sliderProgress = interpolate(frame, [50, 90], [0.8, 0.1], {
    extrapolateRight: 'clamp',
  });

  // Max bid animation
  const maxBidOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Bottom text animation
  const bottomTextOpacity = interpolate(frame, [110, 130], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glow effect
  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [20, 40]);

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
          fontSize: 64,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 800,
          marginBottom: 50,
          textAlign: 'center',
          transform: `scale(${titleScale})`,
        }}
      >
        Niet met{' '}
        <span
          style={{
            color: '#22c55e',
            textShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.6)`,
          }}
        >
          Position Sticker
        </span>
      </h2>

      {/* Interface mockup */}
      <div
        style={{
          width: 700,
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 40,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3), 0 0 ${glowIntensity}px rgba(34, 197, 94, 0.2)`,
          transform: `translateY(${(1 - cardY) * 50}px)`,
          opacity: cardY,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1f2937',
              fontFamily: 'system-ui',
            }}
          >
            Position Sticker
          </span>
        </div>

        {/* Position selector */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: '#6b7280',
                fontFamily: 'system-ui',
              }}
            >
              Gewenste positie
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              #{Math.round(1 + sliderProgress * 9)}
            </span>
          </div>

          {/* Slider track */}
          <div
            style={{
              height: 12,
              backgroundColor: '#e5e7eb',
              borderRadius: 6,
              position: 'relative',
            }}
          >
            {/* Filled part */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${(1 - sliderProgress) * 100}%`,
                backgroundColor: '#22c55e',
                borderRadius: 6,
              }}
            />
            {/* Thumb */}
            <div
              style={{
                position: 'absolute',
                left: `${(1 - sliderProgress) * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 28,
                height: 28,
                backgroundColor: 'white',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                border: '4px solid #22c55e',
              }}
            />
          </div>

          {/* Position labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>
              #1
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>
              #10
            </span>
          </div>
        </div>

        {/* Max bid input */}
        <div
          style={{
            opacity: maxBidOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: '#6b7280',
                fontFamily: 'system-ui',
              }}
            >
              Maximum bod
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#1f2937',
                  fontFamily: 'system-ui',
                }}
              >
                €1.50
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: '#9ca3af',
                  fontFamily: 'system-ui',
                }}
              >
                max CPC
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: 14,
              color: '#22c55e',
              fontFamily: 'system-ui',
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#22c55e" strokeWidth="2" fill="none" />
            </svg>
            Je betaalt nooit meer dan dit bedrag
          </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          marginTop: 50,
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
          Domineer zonder overbieden{' '}
          <span style={{ fontSize: 40 }}>⚡</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
