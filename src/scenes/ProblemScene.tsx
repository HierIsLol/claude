import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene transitions
  const scene1Opacity = interpolate(frame, [0, 20, 50, 70], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  const scene2Opacity = interpolate(frame, [60, 80, 110, 130], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  const scene3Opacity = interpolate(frame, [120, 140, 170, 180], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  // Text animations
  const text1Y = interpolate(frame, [0, 30], [60, 0], { extrapolateRight: 'clamp' });
  const text2Y = interpolate(frame, [60, 90], [60, 0], { extrapolateRight: 'clamp' });
  const text3Y = interpolate(frame, [120, 150], [60, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Statement 1 */}
      <div
        style={{
          position: 'absolute',
          opacity: scene1Opacity,
          transform: `translateY(${text1Y}px)`,
          textAlign: 'center',
          padding: '0 100px',
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Je biedt te hoog.
        </h2>
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            marginTop: 20,
            fontWeight: 400,
          }}
        >
          Om zeker te zijn van je positie.
        </p>
      </div>

      {/* Statement 2 */}
      <div
        style={{
          position: 'absolute',
          opacity: scene2Opacity,
          transform: `translateY(${text2Y}px)`,
          textAlign: 'center',
          padding: '0 100px',
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Je past constant aan.
        </h2>
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            marginTop: 20,
            fontWeight: 400,
          }}
        >
          En verliest toch je plek.
        </p>
      </div>

      {/* Statement 3 - The question */}
      <div
        style={{
          position: 'absolute',
          opacity: scene3Opacity,
          transform: `translateY(${text3Y}px)`,
          textAlign: 'center',
          padding: '0 100px',
        }}
      >
        <h2
          style={{
            fontSize: 64,
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-1px',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Wat als dat niet meer hoeft?
        </h2>
      </div>
    </AbsoluteFill>
  );
};
