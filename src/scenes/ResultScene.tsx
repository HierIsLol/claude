import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Title animation
  const titleY = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Chart animation
  const chartProgress = interpolate(frame, [30, 150], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Stats counter animations
  const avgBidAnim = interpolate(frame, [60, 120], [0, 0.87], { extrapolateRight: 'clamp' });
  const manualBidAnim = interpolate(frame, [80, 140], [0, 2.50], { extrapolateRight: 'clamp' });
  const savingsAnim = interpolate(frame, [120, 180], [0, 65], { extrapolateRight: 'clamp' });

  // Savings badge pop animation
  const savingsBadgeScale = spring({
    frame: frame - 150,
    fps,
    config: { damping: 8, stiffness: 120 },
  });

  // Generate position line path (stays at #1)
  const generatePositionPath = (progress: number) => {
    const points: [number, number][] = [];
    const width = 600;

    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width;
      // Stable at position 1 with tiny variations
      const baseY = 30;
      const wave = Math.sin(i * 0.15) * 3 + Math.sin(i * 0.08) * 2;
      const y = baseY + wave;

      if (i / 100 <= progress) {
        points.push([x, y]);
      }
    }

    if (points.length < 2) return '';

    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }
    return path;
  };

  // Generate bid line path (low and efficient)
  const generateBidPath = (progress: number) => {
    const points: [number, number][] = [];
    const width = 600;

    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width;
      // Low bids around €0.85-€0.90
      const baseY = 140;
      const wave = Math.sin(i * 0.1) * 10 + Math.cos(i * 0.15) * 8;
      const y = baseY + wave;

      if (i / 100 <= progress) {
        points.push([x, y]);
      }
    }

    if (points.length < 2) return '';

    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }
    return path;
  };

  // Bottom tagline animation
  const taglineOpacity = interpolate(frame, [200, 230], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a0a 50%, #0a0a0a 100%)',
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
          fontSize: 52,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 50,
          transform: `translateY(${(1 - titleY) * -30}px)`,
        }}
      >
        Het <span style={{ color: '#22c55e' }}>resultaat</span>
      </h2>

      <div
        style={{
          display: 'flex',
          gap: 50,
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Chart */}
        <div
          style={{
            width: 700,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#1f2937',
                fontFamily: 'system-ui',
              }}
            >
              Positie & Kosten - 7 dagen
            </span>
            <span
              style={{
                backgroundColor: '#f0fdf4',
                color: '#22c55e',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'system-ui',
              }}
            >
              Stabiel op #1
            </span>
          </div>

          {/* Chart area */}
          <div
            style={{
              position: 'relative',
              height: 200,
              borderLeft: '2px solid #e5e7eb',
              borderBottom: '2px solid #e5e7eb',
              marginLeft: 40,
            }}
          >
            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: -35, top: 20, fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>
              #1
            </div>
            <div style={{ position: 'absolute', left: -35, top: 80, fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>
              #3
            </div>
            <div style={{ position: 'absolute', left: -35, top: 140, fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>
              €1
            </div>
            <div style={{ position: 'absolute', left: -35, top: 180, fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui' }}>
              €0
            </div>

            {/* Grid lines */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: i * 50,
                  height: 1,
                  backgroundColor: '#f3f4f6',
                }}
              />
            ))}

            {/* Position Line (Green - stable at #1) */}
            <svg
              style={{
                position: 'absolute',
                left: 10,
                top: 0,
                width: 600,
                height: 200,
              }}
            >
              <path
                d={generatePositionPath(chartProgress)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* Bid Line (Blue - low and efficient) */}
            <svg
              style={{
                position: 'absolute',
                left: 10,
                top: 0,
                width: 600,
                height: 200,
              }}
            >
              <path
                d={generateBidPath(chartProgress)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 40,
              marginTop: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 4, backgroundColor: '#22c55e', borderRadius: 2 }} />
              <span style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui' }}>Positie</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 4, backgroundColor: '#3b82f6', borderRadius: 2 }} />
              <span style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui' }}>Bod (CPC)</span>
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Average bid with Position Sticker */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 20,
              padding: 28,
              border: '2px solid rgba(34, 197, 94, 0.3)',
              minWidth: 280,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'system-ui',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Gemiddeld bod
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              €{avgBidAnim.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'system-ui',
                marginTop: 4,
              }}
            >
              met Position Sticker
            </div>
          </div>

          {/* Manual bid comparison */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 20,
              padding: 28,
              border: '2px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'system-ui',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Handmatig bieden
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#ef4444',
                fontFamily: 'system-ui',
                textDecoration: 'line-through',
                textDecorationColor: 'rgba(239, 68, 68, 0.5)',
              }}
            >
              €{manualBidAnim.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'system-ui',
                marginTop: 4,
              }}
            >
              om "zeker" te zijn
            </div>
          </div>

          {/* Savings badge */}
          <div
            style={{
              backgroundColor: '#22c55e',
              borderRadius: 20,
              padding: 24,
              textAlign: 'center',
              transform: `scale(${Math.max(0, savingsBadgeScale)})`,
              boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'system-ui',
                marginBottom: 4,
              }}
            >
              Je bespaart
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: 'white',
                fontFamily: 'system-ui',
              }}
            >
              -{Math.round(savingsAnim)}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          marginTop: 50,
          opacity: taglineOpacity,
        }}
      >
        <span
          style={{
            fontSize: 32,
            color: 'white',
            fontFamily: 'system-ui',
            fontWeight: 600,
          }}
        >
          Jouw plek. De laagst mogelijke bieding.{' '}
          <span style={{ color: '#22c55e' }}>Altijd.</span>{' '}
          <span style={{ fontSize: 36 }}>🎯</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
