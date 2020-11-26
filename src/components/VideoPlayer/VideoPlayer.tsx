import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import screenful, { Screenfull } from 'screenfull';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../state';
import { MULTI } from '../../state/media/media';
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

function VideoPlayer() {
  const classes = usePlayerStyles();

  const { localMedia, remoteMedia, dispatchLocalMedia, dispatchRemoteMedia } = useAppState();

  const [showControls, setShowControls] = useState(false);
  const [iUpdatedRemote, setIUpdatedRemote] = useState(false);
  const { db, updateInDb } = useDbState();
  const { room } = useVideoContext();
  // const [count, setCount] = useState(0);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState('normal');
  const [state, setState] = useState({
    pip: false,
    playing: false,
    controls: false,
    muted: false,
    playedSeconds: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    controlSeeking: false,
    seeking: false,
    ready: false,
  });

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    updateInDb(db, room.name, { playing: remoteMedia.playing });
  }, [remoteMedia.playing]);

  useEffect(() => {
    updateInDb(db, room.name, { timestamp: remoteMedia.timestamp });
    setIUpdatedRemote(true);
  }, [remoteMedia.timestamp]);

  useEffect(() => {
    console.log('Seeking due to update ' + iUpdatedRemote);
    if (true) {
      playerRef.current.seekTo(localMedia.timestamp);
    }
    setIUpdatedRemote(false);
  }, [localMedia.timestamp]);

  useEffect(() => {
    setState({ ...state, playing: localMedia.playing });
  }, [localMedia.playing]);

  const handleProgress = (changeState: any) => {
    if (count > 3) {
      controlsRef.current.style.visibility = 'hidden';
      count = 0;
    }
    if (controlsRef.current.style.visibility === 'visible') {
      count += 1;
    }
    if (!state.controlSeeking) {
      setState({ ...state, playedSeconds: changeState.playedSeconds });
    }
  };

  const handlePlayToggle = (playing: boolean, timestamp: number) => {
    console.log('Is Ready to playtoggle? ' + state.ready);
    if (true) {
      console.log('Upload in playToggle');
      dispatchLocalMedia({ name: MULTI, value: { playing: playing, timestamp: timestamp } });
      dispatchRemoteMedia({ name: MULTI, value: { playing: playing, timestamp: timestamp } });
    }
  };

  const handlePlay = () => {
    console.log('onPlay');
    handlePlayToggle(true, playerRef.current.getCurrentTime());
  };

  const handlePause = () => {
    console.log('onPause');
    console.log(state.playedSeconds - playerRef.current.getCurrentTime());
    if (Math.abs(state.playedSeconds - playerRef.current.getCurrentTime()) < 1)
      //Was actually paused and not seeked
      handlePlayToggle(false, playerRef.current.getCurrentTime());
  };

  const handleSeekChange = (e: any) => {
    console.log('onSeekManually', e);
    setState({ ...state, seeking: true });
  };

  const handleOnReady = () => {
    console.log('onReady');
    setState({ ...state, ready: true });
    if (state.seeking) {
      dispatchRemoteMedia({ name: 'timestamp', value: playerRef.current.getCurrentTime() });
      console.log('Upload');
    }
  };

  // const handleProgress = (state: any) => {
  //   setPlayedSeconds(state.playedSeconds);
  // };

  const handleEnded = () => {
    console.log('onEnded');
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
          loop={state.loop}
          playbackRate={state.playbackRate}
          volume={state.volume}
          muted={state.muted}
          onReady={handleOnReady}
          onStart={() => console.log('onStart')}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={() => {
            console.log('onBuffer');
            setState({ ...state, ready: false });
          }}
          onSeek={handleSeekChange}
          onEnded={handleEnded}
          onError={e => console.log('onError', e)}
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
          // onSeek={(e: any, newValue: any) => setState({ ...state, playedSeconds: newValue })}
          onSeek={(e: any, newValue: any) => {}}
          onSeekMouseDown={() => setState({ ...state, controlSeeking: true })}
          onSeekMouseUp={(e: any, newValue: any) => {
            setState({ ...state, controlSeeking: false });
            playerRef.current.seekTo(newValue);
          }}
          onRewind={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)}
          onFastForward={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)}
          onPlayPause={() => setState({ ...state, playing: !state.playing })}
          playing={state.playing}
          played={state.playedSeconds}
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
          onVolumeSeekDown={(e: any, newValue: any) =>
            setState({ ...state, controlSeeking: false, volume: newValue / 100 })
          }
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

export default VideoPlayer;
