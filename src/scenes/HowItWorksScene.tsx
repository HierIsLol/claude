import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const HowItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Timeline phases (390 frames total = 13 seconds)
  // Phase 1 (0-80): You're at #1 with €0.85
  // Phase 2 (80-160): Competitor bids €0.90, you drop to #2
  // Phase 3 (160-240): Position Sticker reacts €0.91, back to #1
  // Phase 4 (240-310): Competitor gives up
  // Phase 5 (310-390): Position Sticker tests lower, €0.85 works

  const phase = frame < 80 ? 1 : frame < 160 ? 2 : frame < 240 ? 3 : frame < 310 ? 4 : 5;

  // Current values based on phase
  const yourBid = phase === 1 ? 0.85 : phase === 2 ? 0.85 : phase === 3 ? 0.91 : phase === 4 ? 0.91 : 0.85;
  const yourPosition = phase === 2 ? 2 : 1;
  const competitorBid = phase === 1 ? 0.80 : phase === 2 ? 0.90 : phase === 3 ? 0.90 : phase === 4 ? null : null;
  const competitorPosition = phase === 2 ? 1 : phase === 3 ? 2 : phase === 4 ? null : null;

  // Status messages
  const statusMessages: Record<number, { text: string; emoji: string; color: string }> = {
    1: { text: 'Jij staat op #1', emoji: '✓', color: '#22c55e' },
    2: { text: 'Concurrent komt', emoji: '👀', color: '#f97316' },
    3: { text: 'Direct reageren', emoji: '⚡', color: '#22c55e' },
    4: { text: 'Concurrent geeft op', emoji: '🏳️', color: '#22c55e' },
    5: { text: 'Verlagen tot minimum', emoji: '↓', color: '#22c55e' },
  };

  const currentStatus = statusMessages[phase];

  // Animation for bid changes
  const bidChangeScale = spring({
    frame: frame % 80,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Pulse effect for your position when at #1
  const positionPulse = yourPosition === 1 ? 1 + Math.sin(frame * 0.15) * 0.05 : 1;

  // Alert flash for phase 2
  const alertFlash = phase === 2 ? Math.sin(frame * 0.3) * 0.5 + 0.5 : 0;

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
          marginBottom: 20,
        }}
      >
        Hoe het werkt
      </h2>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'system-ui',
          marginBottom: 40,
        }}
      >
        Elke 5 minuten: verlagen tot het niet meer kan, reageren zodra iemand jou verdringt
      </p>

      {/* Main visualization */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          alignItems: 'flex-start',
        }}
      >
        {/* Position ranking visual */}
        <div
          style={{
            width: 400,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: '#6b7280',
              fontFamily: 'system-ui',
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            Zoekresultaten: "eiwitpoeder"
          </div>

          {/* Position #1 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              marginBottom: 8,
              borderRadius: 12,
              backgroundColor: yourPosition === 1 ? '#f0fdf4' : competitorPosition === 1 ? '#fef2f2' : '#f9fafb',
              border: yourPosition === 1 ? '2px solid #22c55e' : competitorPosition === 1 ? '2px solid #f97316' : '2px solid transparent',
              transform: yourPosition === 1 ? `scale(${positionPulse})` : 'scale(1)',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#fbbf24',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>🥇</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1f2937',
                  fontFamily: 'system-ui',
                }}
              >
                {yourPosition === 1 ? 'Jouw product' : 'Concurrent'}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontFamily: 'system-ui',
                }}
              >
                Positie #1
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: yourPosition === 1 ? '#22c55e' : '#f97316',
                fontFamily: 'system-ui',
              }}
            >
              €{yourPosition === 1 ? yourBid.toFixed(2) : competitorBid?.toFixed(2)}
            </div>
          </div>

          {/* Position #2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              marginBottom: 8,
              borderRadius: 12,
              backgroundColor: yourPosition === 2 ? '#fef2f2' : competitorPosition === 2 ? '#f9fafb' : '#f9fafb',
              border: yourPosition === 2 ? `2px solid rgba(239, 68, 68, ${0.5 + alertFlash * 0.5})` : '2px solid transparent',
              opacity: (yourPosition === 2 || competitorPosition === 2 || phase < 4) ? 1 : 0.5,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#d1d5db',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>🥈</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1f2937',
                  fontFamily: 'system-ui',
                }}
              >
                {yourPosition === 2 ? 'Jouw product' : phase >= 4 ? '—' : 'Concurrent'}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontFamily: 'system-ui',
                }}
              >
                Positie #2
              </div>
            </div>
            {(yourPosition === 2 || competitorPosition === 2) && (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: yourPosition === 2 ? '#ef4444' : '#6b7280',
                  fontFamily: 'system-ui',
                }}
              >
                €{yourPosition === 2 ? yourBid.toFixed(2) : competitorBid?.toFixed(2)}
              </div>
            )}
          </div>

          {/* Position #3 placeholder */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              borderRadius: 12,
              backgroundColor: '#f9fafb',
              opacity: 0.5,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>🥉</span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#9ca3af',
                  fontFamily: 'system-ui',
                }}
              >
                Ander product
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#d1d5db',
                  fontFamily: 'system-ui',
                }}
              >
                Positie #3
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Status & Actions */}
        <div
          style={{
            width: 450,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Current status badge */}
          <div
            style={{
              backgroundColor: `${currentStatus.color}20`,
              borderRadius: 16,
              padding: 24,
              border: `2px solid ${currentStatus.color}50`,
              transform: `scale(${bidChangeScale})`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{ fontSize: 48 }}>{currentStatus.emoji}</span>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: currentStatus.color,
                    fontFamily: 'system-ui',
                  }}
                >
                  {currentStatus.text}
                </div>
              </div>
            </div>
          </div>

          {/* Your bid panel */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 16,
              padding: 24,
              border: '2px solid rgba(34, 197, 94, 0.3)',
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
              Jouw huidige bod
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}
            >
              €{yourBid.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'system-ui',
                marginTop: 8,
              }}
            >
              Max: €1.50
            </div>
          </div>

          {/* Position Sticker action */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
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
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'white',
                  fontFamily: 'system-ui',
                }}
              >
                Position Sticker
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'system-ui',
                }}
              >
                {phase === 1 && 'Monitort je positie...'}
                {phase === 2 && 'Concurrent gedetecteerd!'}
                {phase === 3 && 'Bod aangepast naar €0.91'}
                {phase === 4 && 'Concurrent weg, testen verlaging...'}
                {phase === 5 && 'Verlaagd naar €0.85 ✓'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline indicator */}
      <div
        style={{
          marginTop: 50,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {[1, 2, 3, 4, 5].map((p) => (
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
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: p <= phase ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                transition: 'background-color 0.3s',
              }}
            />
            {p < 5 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  backgroundColor: p < phase ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
