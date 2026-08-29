import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AnimF1Wide, AnimF2Wide, AnimF3Wide, AnimF4Wide, AnimF5Wide} from '../App';

const SCENE_DURATIONS_MS = [2000, 4000, 2000, 3000, 4000] as const;

type SceneInfo = {index: number; localMs: number};

const getSceneAt = (globalMs: number): SceneInfo => {
  let elapsed = 0;
  for (let index = 0; index < SCENE_DURATIONS_MS.length; index++) {
    const duration = SCENE_DURATIONS_MS[index];
    if (globalMs < elapsed + duration) {
      return {index, localMs: globalMs - elapsed};
    }
    elapsed += duration;
  }
  return {
    index: SCENE_DURATIONS_MS.length - 1,
    localMs: SCENE_DURATIONS_MS[SCENE_DURATIONS_MS.length - 1],
  };
};

type AudioCue = {atMs: number; file: string};

const AUDIO_CUES: AudioCue[] = [
  {atMs: 0, file: 'whoosh.wav'},
  {atMs: 400, file: 'pop-1.wav'},
  {atMs: 458, file: 'pop-2.wav'},
  {atMs: 516, file: 'pop-3.wav'},
  {atMs: 574, file: 'pop-4.wav'},
  {atMs: 632, file: 'pop-5.wav'},
  {atMs: 690, file: 'pop-6.wav'},
  {atMs: 900, file: 'impact.wav'},
  {atMs: 2000, file: 'word-reveal.wav'},
  {atMs: 2700, file: 'letter-tap-1.wav'},
  {atMs: 3130, file: 'letter-tap-2.wav'},
  {atMs: 3560, file: 'letter-tap-3.wav'},
  {atMs: 3990, file: 'letter-tap-4.wav'},
  {atMs: 4420, file: 'letter-tap-5.wav'},
  {atMs: 4850, file: 'letter-tap-6.wav'},
  {atMs: 5280, file: 'letter-tap-7.wav'},
  {atMs: 5700, file: 'letter-tap-8.wav'},
  {atMs: 6050, file: 'success.wav'},
  {atMs: 6340, file: 'reward-coin.wav'},
  {atMs: 6760, file: 'pangrama.wav'},
  {atMs: 8050, file: 'challenge.wav'},
  {atMs: 8900, file: 'letter-tap-9.wav'},
  {atMs: 9500, file: 'letter-tap-10.wav'},
  {atMs: 10100, file: 'letter-tap-11.wav'},
  {atMs: 12400, file: 'cta.wav'},
];

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const WideVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const globalMs = (frame / fps) * 1000;
  const {index, localMs} = getSceneAt(globalMs);

  const scenes = [AnimF1Wide, AnimF2Wide, AnimF3Wide, AnimF4Wide, AnimF5Wide];
  const ActiveScene = scenes[index];

  return (
    <AbsoluteFill style={{backgroundColor: '#0E1826', overflow: 'hidden'}}>
      <ActiveScene t={localMs} />
      {AUDIO_CUES.map((cue, i) => (
        <Sequence key={`${cue.file}-${i}`} from={msToFrame(cue.atMs, fps)}>
          <Html5Audio src={staticFile(`audio/${cue.file}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
