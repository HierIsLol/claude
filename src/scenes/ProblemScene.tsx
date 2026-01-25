import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Position indicator bouncing chaotically
  const positions = [4, 2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 2, 4, 1, 3];
  const positionIndex = Math.floor(frame / 6) % positions.length;
  const currentPosition = positions[positionIndex];

  // Frustration indicator
  const shakeX = Math.sin(frame * 0.8) * 3;
  const shakeY = Math.cos(frame * 1.2) * 2;

  // Title animation
  const titleY = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a0a0a 0%, #2a1a1a 50%, #1a0a0a 100%)',
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
          fontSize: 48,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 60,
          transform: `translateY(${(1 - titleY) * -30}px)`,
        }}
      >
        Moe van fluctuerende posities?
      </h2>

      {/* Search Results Mock */}
      <div
        style={{
          width: 800,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Search bar */}
        <div
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#9ca3af" strokeWidth="2" fill="none" />
          </svg>
          <span style={{ color: '#374151', fontSize: 18, fontFamily: 'system-ui' }}>
            eiwitpoeder
          </span>
        </div>

        {/* Results */}
        {[1, 2, 3, 4, 5].map((pos) => {
          const isHighlighted = pos === currentPosition;
          return (
            <div
              key={pos}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: isHighlighted ? '#fef2f2' : '#f9fafb',
                border: isHighlighted ? '2px solid #ef4444' : '2px solid transparent',
                transition: 'all 0.1s',
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: isHighlighted ? '#ef4444' : '#d1d5db',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  marginRight: 16,
                  fontFamily: 'system-ui',
                }}
              >
                #{pos}
              </span>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#e5e7eb',
                  marginRight: 12,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 12,
                    backgroundColor: isHighlighted ? '#fca5a5' : '#e5e7eb',
                    borderRadius: 4,
                    width: '60%',
                    marginBottom: 6,
                  }}
                />
                <div
                  style={{
                    height: 8,
                    backgroundColor: '#f3f4f6',
                    borderRadius: 4,
                    width: '40%',
                  }}
                />
              </div>
              {isHighlighted && (
                <span
                  style={{
                    color: '#ef4444',
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: 'system-ui',
                  }}
                >
                  Jouw product
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Red warning badge */}
      <div
        style={{
          marginTop: 40,
          padding: '12px 24px',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.4)',
        }}
      >
        <span
          style={{
            color: '#ef4444',
            fontSize: 20,
            fontFamily: 'system-ui',
            fontWeight: 600,
          }}
        >
          Positie #{currentPosition} - Constant wisselend!
        </span>
      </div>
    </AbsoluteFill>
  );
};
