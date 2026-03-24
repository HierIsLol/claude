import { Composition } from "remotion";
import { PositionStickerVideo } from "./PositionStickerVideo";

export const Root = () => {
  return (
    <Composition
      id="PositionSticker"
      component={PositionStickerVideo}
      durationInFrames={420}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
