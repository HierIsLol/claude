import { Composition } from 'remotion';
import { PositionStickerPromo } from './PositionStickerPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PositionStickerPromo"
        component={PositionStickerPromo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
