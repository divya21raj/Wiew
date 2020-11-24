import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import screenful, { Screenfull } from 'screenfull';
import { useAppState } from '../../state';
import Controls from './Controls';
import { usePlayerStyles } from './styles/videoPlayerStyles';

const format = (seconds: number) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date
    .getUTCSeconds()
    .toString()
    .padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function CustomVideoPlayer() {
  const classes = usePlayerStyles();

  const { localMedia } = useAppState();

  const [showControls, setShowControls] = useState(false);
  // const [count, setCount] = useState(0);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState('normal');
  const [state, setState] = useState({
    pip: false,
    playing: false,
    controls: false,
    light: false,
    muted: false,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  const handleProgress = (changeState: any) => {
    if (count > 3) {
      controlsRef.current.style.visibility = 'hidden';
      count = 0;
    }
    if (controlsRef.current.style.visibility === 'visible') {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleDuration = (duration: number) => {
    setState({ ...state, duration });
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = 'visible';
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = 'hidden';
    count = 0;
  };

  const currentTime = playerRef && playerRef.current ? playerRef.current.getCurrentTime() : '00:00';

  const duration = playerRef && playerRef.current ? playerRef.current.getDuration() : '00:00';
  const elapsedTime = timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  return (
    <>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={hanldeMouseLeave}
        ref={playerContainerRef}
        className={classes.playerWrapper}
      >
        <ReactPlayer
          ref={playerRef}
          className={classes.reactPlayer}
          width="100%"
          height="100%"
          url={localMedia.url}
          pip={state.pip}
          playing={state.playing}
          controls={showControls}
          light={state.light}
          loop={state.loop}
          playbackRate={state.playbackRate}
          volume={state.volume}
          muted={state.muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous',
              },
            },
          }}
        />

        <Controls
          ref={controlsRef}
          onSeek={(e: any, newValue: any) => setState({ ...state, played: newValue / 100 })}
          onSeekMouseDown={() => setState({ ...state, seeking: true })}
          onSeekMouseUp={(e: any, newValue: any) => {
            setState({ ...state, seeking: false });
            playerRef.current.seekTo(newValue / 100, 'fraction');
          }}
          onRewind={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)}
          onFastForward={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)}
          onPlayPause={() => setState({ ...state, playing: !state.playing })}
          playing={state.playing}
          played={state.played}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onMute={() => setState({ ...state, muted: !state.muted })}
          muted={state.muted}
          onVolumeChange={(e: any, newValue: any) =>
            setState({
              ...state,
              volume: newValue / 100,
              muted: newValue === 0 ? true : false,
            })
          }
          onVolumeSeekDown={(e: any, newValue: any) => setState({ ...state, seeking: false, volume: newValue / 100 })}
          onChangeDispayFormat={() => setTimeDisplayFormat(timeDisplayFormat === 'normal' ? 'remaining' : 'normal')}
          playbackRate={state.playbackRate}
          onPlaybackRateChange={(rate: number) => setState({ ...state, playbackRate: rate })}
          onToggleFullScreen={() => (screenful as Screenfull).toggle(playerContainerRef.current)}
          volume={state.volume}
        />
      </div>
    </>
  );
}

export default CustomVideoPlayer;
