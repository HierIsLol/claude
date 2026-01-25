import { AbsoluteFill, Sequence } from 'remotion';
import { ProblemScene } from './scenes/ProblemScene';
import { SmartApproachScene } from './scenes/SmartApproachScene';
import { HowItWorksScene } from './scenes/HowItWorksScene';
import { ResultScene } from './scenes/ResultScene';
import { CTAScene } from './scenes/CTAScene';

export const PositionStickerPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* Scene 1: Het Probleem (0-7 sec = 0-210 frames) */}
      <Sequence from={0} durationInFrames={210}>
        <ProblemScene />
      </Sequence>

      {/* Scene 2: De Slimme Aanpak (7-12 sec = 210-360 frames) */}
      <Sequence from={210} durationInFrames={150}>
        <SmartApproachScene />
      </Sequence>

      {/* Scene 3: Hoe Het Werkt (12-25 sec = 360-750 frames) */}
      <Sequence from={360} durationInFrames={390}>
        <HowItWorksScene />
      </Sequence>

      {/* Scene 4: Het Resultaat (25-35 sec = 750-1050 frames) */}
      <Sequence from={750} durationInFrames={300}>
        <ResultScene />
      </Sequence>

      {/* Scene 5: CTA (35-40 sec = 1050-1200 frames) */}
      <Sequence from={1050} durationInFrames={150}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
