import React from "react";
import { Composition } from "remotion";
import { PositionStickerVideo } from "./PositionStickerVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PositionSticker"
        component={PositionStickerVideo}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
