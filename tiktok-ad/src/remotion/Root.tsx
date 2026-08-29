import React from 'react';
import {Composition} from 'remotion';
import {TikTokVideo} from './TikTokVideo';
import {WideVideo} from './WideVideo';
import {SquareVideo} from './SquareVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PalabraDiKorsouTikTok"
        component={TikTokVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PalabraDiKorsouWide"
        component={WideVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PalabraDiKorsouSquare"
        component={SquareVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
