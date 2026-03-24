import React from "react";
import { Composition } from "remotion";
import { TextCameraAnimation, TOTAL_FRAMES } from "./TextCameraAnimation";

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
