import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import screenful, { Screenfull } from 'screenfull';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../state';
import { MULTI, SOURCEMAP } from '../../state/media/media';
import Controls from './Controls';
import { usePlayerStyles } from './styles/videoPlayerStyles';

let count = 0;

function VideoPlayer() {
  const classes = usePlayerStyles();

  const { localMedia, remoteMedia, dispatchLocalMedia, dispatchRemoteMedia } = useAppState();

  const [iUpdatedRemote, setIUpdatedRemote] = useState(false);
  const { db, updateInDb } = useDbState();
  const { room } = useVideoContext();
  const showCustomControls: Boolean = localMedia.source === SOURCEMAP.LOCAL;
  // const [count, setCount] = useState(0);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState('normal');
  const initialState = {
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
    bufferring: false,
  };
  const [state, setState] = useState(initialState);

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    console.log('Media reset');
    setState(initialState);
  }, [localMedia.url]);

  useEffect(() => {
    updateInDb(db, room.name, { playing: remoteMedia.playing });
  }, [remoteMedia.playing]);

  useEffect(() => {
    updateInDb(db, room.name, { timestamp: remoteMedia.timestamp });
  }, [remoteMedia.timestamp]);

  const printState = () => {
    console.log({
      playing: state.playing,
      playedSeconds: state.playedSeconds,
      controlSeeking: state.controlSeeking,
      seeking: state.seeking,
      ready: state.ready,
      bufferring: state.bufferring,
    });
  };

  const handleProgress = (changeState: any) => {
    if (showCustomControls) {
      if (count > 3) {
        controlsRef.current.style.visibility = 'hidden';
        count = 0;
      }
      if (controlsRef.current.style.visibility === 'visible') {
        count += 1;
      }
    }
    const timeDiff = Math.abs(state.playedSeconds - changeState.playedSeconds);
    if (timeDiff > 1.6) {
      console.log(timeDiff);
      dispatchRemoteMedia({ name: 'timestamp', value: changeState.playedSeconds });
    }
    setState({ ...state, playedSeconds: changeState.playedSeconds });
  };

  const handlePlayToggle = (playing: Boolean) => {
    console.log('Play toggle');
    printState();
    dispatchRemoteMedia({ name: 'playing', value: playing });
  };

  const handlePlay = () => {
    console.log('onPlay');
    setState({ ...state, bufferring: false, playing: true });
    handlePlayToggle(true);
    printState();
  };

  const handlePause = () => {
    setState({ ...state, playing: false });
    if (Math.abs(state.playedSeconds - playerRef.current.getCurrentTime()) < 1) {
      console.log('onPause with diff of ' + (state.playedSeconds - playerRef.current.getCurrentTime()));
      //Was actually paused and not seeked
      handlePlayToggle(false);
    }
    printState();
  };

  const handleSeekChange = (e: any) => {
    setState({ ...state, seeking: true });
  };

  const handleOnStart = () => {
    setState({ ...state, bufferring: false, playing: true });
  };

  const handleOnReady = () => {
    setState({ ...state, bufferring: false, seeking: false });
  };

  const handleBuffer = () => {
    setState({ ...state, bufferring: true });
  };

  const handleEnded = () => {
    console.log('onEnded');
  };

  const handleDuration = (duration: number) => {
    console.log('duration=' + duration);
    setState({ ...state, duration });
    printState();
  };

  const handleMouseMove = () => {
    if (showCustomControls) {
      controlsRef.current.style.visibility = 'visible';
      count = 0;
    }
  };

  const hanldeMouseLeave = () => {
    if (showCustomControls) {
      controlsRef.current.style.visibility = 'hidden';
      count = 0;
    }
  };

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
          controls={!showCustomControls}
          loop={state.loop}
          playbackRate={state.playbackRate}
          volume={state.volume}
          muted={state.muted}
          onReady={handleOnReady}
          onStart={handleOnStart}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={handleBuffer}
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

        {showCustomControls && (
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
            duration={state.duration}
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
        )}
      </div>
    </>
  );
}

export default VideoPlayer;
