import { AbsoluteFill, Sequence } from 'remotion';
import { IntroScene } from './scenes/IntroScene';
import { ProblemScene } from './scenes/ProblemScene';
import { SolutionScene } from './scenes/SolutionScene';
import { LiveTrackerScene } from './scenes/LiveTrackerScene';
import { StatsScene } from './scenes/StatsScene';
import { OutroScene } from './scenes/OutroScene';

export const PositionStickerPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* Intro - Position Sticker branding (0-90 frames = 3 sec) */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>

      {/* Problem - Fluctuating positions (90-180 frames = 3 sec) */}
      <Sequence from={90} durationInFrames={90}>
        <ProblemScene />
      </Sequence>

      {/* Solution - Choose keyword & max bid (180-300 frames = 4 sec) */}
      <Sequence from={180} durationInFrames={120}>
        <SolutionScene />
      </Sequence>

      {/* Live Tracker visualization (300-420 frames = 4 sec) */}
      <Sequence from={300} durationInFrames={120}>
        <LiveTrackerScene />
      </Sequence>

      {/* Stats & Results (420-510 frames = 3 sec) */}
      <Sequence from={420} durationInFrames={90}>
        <StatsScene />
      </Sequence>

      {/* Outro with CTA (510-600 frames = 3 sec) */}
      <Sequence from={510} durationInFrames={90}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
