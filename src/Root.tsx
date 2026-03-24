import React from 'react';
import {Composition} from 'remotion';
import {AdpalDashboard} from './AdpalDashboard';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AdpalDashboard"
        component={AdpalDashboard}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
