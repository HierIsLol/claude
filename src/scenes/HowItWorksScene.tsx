import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const HowItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Timeline phases (390 frames = 13 seconds)
  // Phase 1 (0-100): You're at #1
  // Phase 2 (100-180): Competitor tries to take your spot
  // Phase 3 (180-280): Position Sticker reacts
  // Phase 4 (280-390): You stay at #1, competitor gone

  const phase = frame < 100 ? 1 : frame < 180 ? 2 : frame < 280 ? 3 : 4;

  // Your position
  const yourPosition = phase === 2 ? 2 : 1;

  // Status messages - simpler, concept-focused
  const statusData: Record<number, { title: string; subtitle: string; emoji: string; color: string }> = {
    1: {
      title: 'Jij staat op positie #1',
      subtitle: 'Position Sticker bewaakt je plek',
      emoji: '🎯',
      color: '#22c55e'
    },
    2: {
      title: 'Concurrent probeert je te verdringen',
      subtitle: 'Position Sticker detecteert dit direct',
      emoji: '⚠️',
      color: '#f97316'
    },
    3: {
      title: 'Automatisch bod aangepast',
      subtitle: 'Net genoeg om weer #1 te staan',
      emoji: '⚡',
      color: '#22c55e'
    },
    4: {
      title: 'Jij blijft op #1',
      subtitle: 'Bod wordt automatisch verlaagd tot minimum',
      emoji: '✅',
      color: '#22c55e'
    },
  };

  const currentStatus = statusData[phase];

  // Animation for status changes
  const statusScale = spring({
    frame: frame % 100,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Position indicator pulse
  const positionPulse = yourPosition === 1 ? 1 + Math.sin(frame * 0.12) * 0.03 : 1;

  // Alert effect for phase 2
  const alertOpacity = phase === 2 ? 0.5 + Math.sin(frame * 0.25) * 0.3 : 0;

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
          fontSize: 52,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 50,
        }}
      >
        Zo werkt het
      </h2>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'center',
        }}
      >
        {/* Left: Position visualization */}
        <div
          style={{
            width: 380,
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 28,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#6b7280',
              fontFamily: 'system-ui',
              marginBottom: 24,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Zoekresultaten
          </div>

          {/* Position #1 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 20,
              marginBottom: 12,
              borderRadius: 16,
              backgroundColor: yourPosition === 1 ? '#f0fdf4' : '#fef2f2',
              border: yourPosition === 1 ? '3px solid #22c55e' : '3px solid #f97316',
              transform: `scale(${yourPosition === 1 ? positionPulse : 1})`,
              boxShadow: yourPosition === 1 ? '0 4px 20px rgba(34, 197, 94, 0.2)' : 'none',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: '#fbbf24',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>#1</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1f2937',
                  fontFamily: 'system-ui',
                }}
              >
                {yourPosition === 1 ? '🏆 Jouw product' : '😈 Concurrent'}
              </div>
            </div>
          </div>

          {/* Position #2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 20,
              marginBottom: 12,
              borderRadius: 16,
              backgroundColor: yourPosition === 2 ? '#fef2f2' : '#f9fafb',
              border: yourPosition === 2 ? '3px solid #ef4444' : '2px solid #e5e7eb',
              opacity: phase >= 4 && yourPosition !== 2 ? 0.5 : 1,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: '#d1d5db',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>#2</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: yourPosition === 2 ? '#ef4444' : '#9ca3af',
                  fontFamily: 'system-ui',
                }}
              >
                {yourPosition === 2 ? '😰 Jouw product' : phase >= 4 ? '—' : 'Concurrent'}
              </div>
            </div>
          </div>

          {/* Position #3 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 20,
              borderRadius: 16,
              backgroundColor: '#f9fafb',
              border: '2px solid #e5e7eb',
              opacity: 0.4,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: '#e5e7eb',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>#3</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#d1d5db',
                  fontFamily: 'system-ui',
                }}
              >
                Ander product
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status panel */}
        <div
          style={{
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {/* Current status */}
          <div
            style={{
              backgroundColor: `${currentStatus.color}15`,
              borderRadius: 20,
              padding: 32,
              border: `2px solid ${currentStatus.color}40`,
              transform: `scale(${Math.min(1, statusScale)})`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <span style={{ fontSize: 56 }}>{currentStatus.emoji}</span>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: currentStatus.color,
                    fontFamily: 'system-ui',
                    marginBottom: 8,
                  }}
                >
                  {currentStatus.title}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'system-ui',
                  }}
                >
                  {currentStatus.subtitle}
                </div>
              </div>
            </div>
          </div>

          {/* How it works explanation */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 16,
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'white',
                  fontFamily: 'system-ui',
                }}
              >
                Position Sticker
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {[
                { icon: '🔍', text: 'Checkt elke 5 minuten je positie' },
                { icon: '⬇️', text: 'Verlaagt bod als het lager kan' },
                { icon: '⬆️', text: 'Verhoogt direct bij concurrentie' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: frame > 60 + i * 30 ? 1 : 0.3,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: 16,
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: 'system-ui',
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div
        style={{
          marginTop: 50,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {[1, 2, 3, 4].map((p) => (
          <div
            key={p}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: p === phase ? 40 : 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: p <= phase ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s',
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
