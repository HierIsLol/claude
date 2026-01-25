import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const LiveTrackerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Chart animation progress
  const chartProgress = interpolate(frame, [20, 100], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Generate smooth line path for position
  const generatePath = (progress: number) => {
    const points: [number, number][] = [];
    const width = 700;
    const height = 200;

    // Position stays mostly at #1 with occasional small fluctuations
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width;
      // Mostly flat at position 1, small waves
      const baseY = 30; // Position #1 is at top
      const wave = Math.sin(i * 0.1) * 5 + Math.sin(i * 0.05) * 3;
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

  // Generate price line (green, showing cost efficiency)
  const generatePricePath = (progress: number) => {
    const points: [number, number][] = [];
    const width = 700;

    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * width;
      // Price fluctuates but stays optimized
      const baseY = 120;
      const wave = Math.sin(i * 0.08) * 20 + Math.cos(i * 0.12) * 15;
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

  // Pulse effect
  const pulse = Math.sin(frame * 0.2) * 0.5 + 0.5;

  // Panel slide in
  const panelX = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 80 },
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
      {/* Title */}
      <h2
        style={{
          fontSize: 48,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 40,
        }}
      >
        <span style={{ color: '#22c55e' }}>Live Tracker</span> - Real-time monitoring
      </h2>

      {/* Chart Container */}
      <div
        style={{
          width: 900,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          transform: `translateX(${(1 - panelX) * -100}px)`,
          opacity: panelX,
        }}
      >
        {/* Chart Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: `0 0 ${8 + pulse * 8}px rgba(34, 197, 94, ${0.5 + pulse * 0.3})`,
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'system-ui',
              }}
            >
              Live tracker
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: '#9ca3af',
              fontFamily: 'system-ui',
            }}
          >
            Laatste 6 uur
          </span>
        </div>

        {/* Chart */}
        <div
          style={{
            position: 'relative',
            height: 220,
            borderLeft: '2px solid #e5e7eb',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          {/* Y-axis labels */}
          <div
            style={{
              position: 'absolute',
              left: -40,
              top: 20,
              fontSize: 12,
              color: '#9ca3af',
              fontFamily: 'system-ui',
            }}
          >
            #1
          </div>
          <div
            style={{
              position: 'absolute',
              left: -40,
              top: 100,
              fontSize: 12,
              color: '#9ca3af',
              fontFamily: 'system-ui',
            }}
          >
            #3
          </div>
          <div
            style={{
              position: 'absolute',
              left: -40,
              top: 180,
              fontSize: 12,
              color: '#9ca3af',
              fontFamily: 'system-ui',
            }}
          >
            #5
          </div>

          {/* Grid lines */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: i * 44,
                height: 1,
                backgroundColor: '#f3f4f6',
              }}
            />
          ))}

          {/* Position Line (Green) */}
          <svg
            style={{
              position: 'absolute',
              left: 20,
              top: 0,
              width: 700,
              height: 200,
            }}
          >
            <path
              d={generatePath(chartProgress)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Price Line (Orange) */}
          <svg
            style={{
              position: 'absolute',
              left: 20,
              top: 0,
              width: 700,
              height: 200,
            }}
          >
            <path
              d={generatePricePath(chartProgress)}
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Current position indicator */}
          {chartProgress > 0.9 && (
            <div
              style={{
                position: 'absolute',
                right: 60,
                top: 20,
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'system-ui',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
              }}
            >
              Positie #1
            </div>
          )}
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
            <div
              style={{
                width: 24,
                height: 3,
                backgroundColor: '#22c55e',
                borderRadius: 2,
              }}
            />
            <span style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui' }}>
              Positie
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 3,
                backgroundColor: '#f97316',
                borderRadius: 2,
              }}
            />
            <span style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui' }}>
              CPC Kosten
            </span>
          </div>
        </div>
      </div>

      {/* Bottom badge */}
      <div
        style={{
          marginTop: 40,
          padding: '16px 32px',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          borderRadius: 12,
          border: '1px solid rgba(34, 197, 94, 0.3)',
          opacity: interpolate(frame, [90, 105], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <span
          style={{
            color: '#22c55e',
            fontSize: 22,
            fontFamily: 'system-ui',
            fontWeight: 600,
          }}
        >
          24/7 automatisch bijgestuurd voor optimale positie
        </span>
      </div>
    </AbsoluteFill>
  );
};
