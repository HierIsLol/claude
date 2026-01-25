import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const CTAScene: React.FC = () => {
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

  // Product mock animation
  const productY = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Tagline animation
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // CTA button animation
  const ctaScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 8, stiffness: 120 },
  });

  // URL animation
  const urlOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glow pulse
  const glowIntensity = interpolate(Math.sin(frame * 0.12), [-1, 1], [30, 60]);

  // Position badge pulse
  const badgePulse = 1 + Math.sin(frame * 0.2) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a1a0a 0%, #0f2f1a 30%, #1a3a2a 70%, #0a1a0a 100%)',
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
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 80,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left: Product mock at #1 */}
        <div
          style={{
            transform: `translateY(${(1 - productY) * 50}px)`,
            opacity: productY,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              width: 320,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3), 0 0 ${glowIntensity}px rgba(34, 197, 94, 0.2)`,
            }}
          >
            {/* Position badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
                transform: `scale(${badgePulse})`,
              }}
            >
              <div
                style={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'system-ui',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🥇</span> Positie #1
              </div>
            </div>

            {/* Product image placeholder */}
            <div
              style={{
                width: '100%',
                height: 180,
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 64 }}>📦</span>
            </div>

            {/* Product info */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#1f2937',
                fontFamily: 'system-ui',
                marginBottom: 8,
              }}
            >
              Jouw product
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontFamily: 'system-ui',
                }}
              >
                bol.com
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: '#22c55e',
                  fontWeight: 600,
                  fontFamily: 'system-ui',
                }}
              >
                CPC: €0.85
              </span>
            </div>
          </div>
        </div>

        {/* Right: Logo & CTA */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
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
            <div>
              <h1
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: 'white',
                  margin: 0,
                  fontFamily: 'system-ui',
                  letterSpacing: '-1px',
                }}
              >
                Position
              </h1>
              <h1
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: '#22c55e',
                  margin: 0,
                  fontFamily: 'system-ui',
                  letterSpacing: '-1px',
                  marginTop: -8,
                }}
              >
                Sticker
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'system-ui',
              textAlign: 'center',
              opacity: taglineOpacity,
              maxWidth: 400,
            }}
          >
            Bezet jouw plek op bol.com
          </p>

          {/* CTA Button */}
          <div
            style={{
              transform: `scale(${Math.max(0, ctaScale)})`,
            }}
          >
            <div
              style={{
                padding: '20px 48px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: 16,
                boxShadow: `0 8px 32px rgba(34, 197, 94, 0.4), 0 0 ${glowIntensity * 0.5}px rgba(34, 197, 94, 0.3)`,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'system-ui',
                }}
              >
                Claim je positie →
              </span>
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              opacity: urlOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: 30,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  color: 'white',
                  fontFamily: 'system-ui',
                  fontWeight: 600,
                }}
              >
                ad-pal.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: 24,
          alignItems: 'center',
        }}
      >
        {['Automatisch bieden', 'Real-time monitoring', '24/7 actief'].map((text, i) => (
          <div
            key={text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: interpolate(frame, [90 + i * 10, 100 + i * 10], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 16,
                fontFamily: 'system-ui',
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
