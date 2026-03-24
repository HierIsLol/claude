import React from "react";
import { Composition } from "remotion";
import { TextCameraAnimation } from "./TextCameraAnimation";

// 6 lines × 42 frames per line = 252 frames at 30fps = 8.4 seconds
const TOTAL_FRAMES = 6 * 42;

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
