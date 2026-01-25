import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Stats counter animations
  const stat1 = interpolate(frame, [15, 50], [0, 75], { extrapolateRight: 'clamp' });
  const stat2 = interpolate(frame, [25, 60], [0, 21], { extrapolateRight: 'clamp' });
  const stat3 = interpolate(frame, [35, 70], [0, 4], { extrapolateRight: 'clamp' });

  // Bar chart animation
  const barProgress = interpolate(frame, [20, 70], [0, 1], { extrapolateRight: 'clamp' });

  // Success badge animation
  const badgeScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const days = ['18-01', '19-01', '20-01', '21-01', '22-01', '23-01', '24-01'];
  const barData = [
    { achieved: 72, sponsored: 18, organic: 6, none: 4 },
    { achieved: 75, sponsored: 17, organic: 5, none: 3 },
    { achieved: 78, sponsored: 15, organic: 4, none: 3 },
    { achieved: 74, sponsored: 19, organic: 4, none: 3 },
    { achieved: 76, sponsored: 18, organic: 4, none: 2 },
    { achieved: 77, sponsored: 17, organic: 4, none: 2 },
    { achieved: 75, sponsored: 21, organic: 4, none: 0 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a1a 50%, #0a0a0a 100%)',
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
          marginBottom: 50,
        }}
      >
        Bewezen <span style={{ color: '#22c55e' }}>resultaten</span>
      </h2>

      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Stats Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Stat 1: Doel bereikt */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 16,
              padding: '24px 40px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              {Math.round(stat1)}%
            </div>
            <div
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'system-ui',
                marginTop: 8,
              }}
            >
              Doel bereikt
            </div>
          </div>

          {/* Stat 2: Gesponsord */}
          <div
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 16,
              padding: '24px 40px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#3b82f6',
                fontFamily: 'system-ui',
              }}
            >
              {Math.round(stat2)}%
            </div>
            <div
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'system-ui',
                marginTop: 8,
              }}
            >
              Gesponsord
            </div>
          </div>

          {/* Stat 3: Organisch */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 16,
              padding: '24px 40px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#10b981',
                fontFamily: 'system-ui',
              }}
            >
              {Math.round(stat3)}%
            </div>
            <div
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'system-ui',
                marginTop: 8,
              }}
            >
              Organisch
            </div>
          </div>
        </div>

        {/* Right: Bar Chart */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: 20,
              color: '#374151',
              fontFamily: 'system-ui',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Doeltreffendheid
          </h3>
          <p
            style={{
              fontSize: 14,
              color: '#9ca3af',
              fontFamily: 'system-ui',
              marginBottom: 24,
            }}
          >
            Gebaseerd op 2448 metingen
          </p>

          {/* Progress bar at top */}
          <div
            style={{
              height: 24,
              backgroundColor: '#f3f4f6',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 32,
              display: 'flex',
            }}
          >
            <div
              style={{
                width: `${75 * barProgress}%`,
                backgroundColor: '#22c55e',
                transition: 'width 0.3s',
              }}
            />
            <div
              style={{
                width: `${21 * barProgress}%`,
                backgroundColor: '#3b82f6',
              }}
            />
            <div
              style={{
                width: `${4 * barProgress}%`,
                backgroundColor: '#10b981',
              }}
            />
          </div>

          {/* Bar chart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 200,
              gap: 16,
            }}
          >
            {days.map((day, i) => {
              const data = barData[i];
              const totalHeight = 180;
              return (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: totalHeight * barProgress,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ flex: data.none, backgroundColor: '#f3f4f6' }} />
                    <div style={{ flex: data.organic, backgroundColor: '#10b981' }} />
                    <div style={{ flex: data.sponsored, backgroundColor: '#3b82f6' }} />
                    <div style={{ flex: data.achieved, backgroundColor: '#22c55e' }} />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#9ca3af',
                      fontFamily: 'system-ui',
                    }}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 24,
            }}
          >
            {[
              { color: '#22c55e', label: 'Doel bereikt 75%' },
              { color: '#3b82f6', label: 'Gesponsord 21%' },
              { color: '#10b981', label: 'Organisch 4%' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: item.color,
                  }}
                />
                <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'system-ui' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success badge */}
      <div
        style={{
          marginTop: 40,
          transform: `scale(${Math.max(0, badgeScale)})`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 32px',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderRadius: 50,
          border: '2px solid rgba(34, 197, 94, 0.4)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#22c55e">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#22c55e" strokeWidth="2" fill="none" />
        </svg>
        <span
          style={{
            color: '#22c55e',
            fontSize: 24,
            fontWeight: 700,
            fontFamily: 'system-ui',
          }}
        >
          96% Doeltreffendheid
        </span>
      </div>
    </AbsoluteFill>
  );
};
