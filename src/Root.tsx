import React from "react";
import { Composition } from "remotion";
import { TextCameraAnimation } from "./TextCameraAnimation";

// 6 lines × 60 frames per line = 360 frames at 30fps = 12 seconds
const TOTAL_FRAMES = 6 * 60;

export function RemotionRoot() {
  return (
    <Composition
      id="TextCameraAnimation"
      component={TextCameraAnimation}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
