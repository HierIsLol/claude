import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const ResultScene: React.FC = () => {
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

  // Benefits cards animation
  const benefit1Y = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 80 } });
  const benefit2Y = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 80 } });
  const benefit3Y = spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 80 } });
  const benefit4Y = spring({ frame: frame - 90, fps, config: { damping: 12, stiffness: 80 } });

  // Central badge animation
  const badgeScale = spring({
    frame: frame - 140,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  // Glow effect
  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [30, 50]);

  // Bottom text animation
  const bottomTextOpacity = interpolate(frame, [200, 230], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const benefits = [
    {
      emoji: '🎯',
      title: 'Altijd je gewenste positie',
      subtitle: 'Geen verrassingen, geen gemiste verkopen',
    },
    {
      emoji: '💰',
      title: 'Nooit te veel betalen',
      subtitle: 'Automatisch de laagste prijs voor jouw plek',
    },
    {
      emoji: '⏰',
      title: 'Bespaar uren per week',
      subtitle: 'Geen handmatig aanpassen meer nodig',
    },
    {
      emoji: '😴',
      title: 'Werkt terwijl jij slaapt',
      subtitle: '24/7 actief, ook in het weekend',
    },
  ];

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
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 60%)',
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Title */}
      <h2
        style={{
          fontSize: 56,
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          marginBottom: 60,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
        }}
      >
        Wat je krijgt met{' '}
        <span style={{ color: '#22c55e' }}>Position Sticker</span>
      </h2>

      {/* Benefits grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 28,
          marginBottom: 50,
        }}
      >
        {benefits.map((benefit, index) => {
          const animationValue = [benefit1Y, benefit2Y, benefit3Y, benefit4Y][index];
          return (
            <div
              key={index}
              style={{
                width: 420,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 20,
                padding: 28,
                border: '1px solid rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                transform: `translateY(${(1 - Math.max(0, animationValue)) * 40}px)`,
                opacity: Math.max(0, animationValue),
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 32 }}>{benefit.emoji}</span>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    color: 'white',
                    fontFamily: 'system-ui',
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'system-ui',
                    lineHeight: 1.5,
                  }}
                >
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Central success badge */}
      <div
        style={{
          transform: `scale(${Math.max(0, badgeScale)})`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '20px 40px',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: 60,
          boxShadow: `0 10px 40px rgba(34, 197, 94, 0.4), 0 0 ${glowIntensity}px rgba(34, 197, 94, 0.3)`,
        }}
      >
        <span style={{ fontSize: 36 }}>✨</span>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'system-ui',
          }}
        >
          Meer sales, minder kosten, nul gedoe
        </span>
        <span style={{ fontSize: 36 }}>✨</span>
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
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'system-ui',
          }}
        >
          Meer dan 500 verkopers gingen je voor
        </span>
      </div>
    </AbsoluteFill>
  );
};
