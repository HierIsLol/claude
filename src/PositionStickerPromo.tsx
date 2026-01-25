import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { IntroScene } from './scenes/IntroScene';
import { ProblemScene } from './scenes/ProblemScene';
import { RevealScene } from './scenes/RevealScene';
import { FeatureScene } from './scenes/FeatureScene';
import { FinaleScene } from './scenes/FinaleScene';

export const PositionStickerPromo: React.FC = () => {
  const frame = useCurrentFrame();

  // Global background with subtle gradient animation
  const gradientPosition = interpolate(frame, [0, 1200], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at ${50 + Math.sin(gradientPosition * 0.01) * 10}% ${50 + Math.cos(gradientPosition * 0.01) * 10}%, #111111 0%, #000000 100%)`,
      }}
    >
      {/* Scene 1: Dramatic Intro (0-6 sec = 0-180 frames) */}
      <Sequence from={0} durationInFrames={180}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: The Problem - Bold Statement (6-12 sec = 180-360 frames) */}
      <Sequence from={180} durationInFrames={180}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: The Reveal - Introducing Position Sticker (12-20 sec = 360-600 frames) */}
      <Sequence from={360} durationInFrames={240}>
        <RevealScene />
      </Sequence>

      {/* Scene 4: Features Showcase (20-32 sec = 600-960 frames) */}
      <Sequence from={600} durationInFrames={360}>
        <FeatureScene />
      </Sequence>

      {/* Scene 5: Finale & CTA (32-40 sec = 960-1200 frames) */}
      <Sequence from={960} durationInFrames={240}>
        <FinaleScene />
      </Sequence>
    </AbsoluteFill>
  );
};
