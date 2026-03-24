import { Composition } from "remotion";
import { AdpalPromo } from "./AdpalPromo";

export const Root = () => (
  <Composition
    id="AdpalPromo"
    component={AdpalPromo}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{}}
  />
);
