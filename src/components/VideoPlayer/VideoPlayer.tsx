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

  const { localMedia, dispatchRemoteMedia } = useAppState();

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
  const [iWasUpdatedByRemote, setIWasUpdatedByRemote] = useState(false);

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  // Listen for media resets
  useEffect(() => {
    setState(initialState);
  }, [localMedia.url]);

  // For play toggle updates from the server
  useEffect(() => {
    setState({ ...state, playing: localMedia.playing });
  }, [localMedia.playing]);

  // For timestamp updates from the server
  useEffect(() => {
    try {
      playerRef.current.seekTo(localMedia.timestamp);
      setIWasUpdatedByRemote(true);
    } catch (error) {
      console.warn('Player not inited yet?');
    }
  }, [localMedia.timestamp]);

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
    if (timeDiff > 2) {
      console.log('I was updated by remote = ' + iWasUpdatedByRemote);
      if (!iWasUpdatedByRemote) {
        console.log(timeDiff);
        dispatchRemoteMedia({ name: 'timestamp', value: changeState.playedSeconds });
      }
    }
    setIWasUpdatedByRemote(false);
    setState({ ...state, playedSeconds: changeState.playedSeconds });
  };

  const handlePlayToggle = (playing: Boolean) => {
    console.log('Play toggle');
    printState();
    dispatchRemoteMedia({ name: 'playing', value: playing });
    // dispatchRemoteMedia({
    //   name: MULTI,
    //   value: { playing: playing, timestamp: state.playedSeconds },
    // });
  };

  const handlePlay = () => {
    console.log('onPlay');
    setState({ ...state, bufferring: false, playing: true });
    handlePlayToggle(true);
  };

  const handlePause = () => {
    setState({ ...state, playing: false });
    if (Math.abs(state.playedSeconds - playerRef.current.getCurrentTime()) < 1) {
      console.log('onPause with diff of ' + (state.playedSeconds - playerRef.current.getCurrentTime()));
      //Was actually paused and not seeked
      handlePlayToggle(false);
    }
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
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onEnded={() => console.log('onEnded')}
          onError={e => console.log('onError', e)}
          onBuffer={() => setState({ ...state, bufferring: true })}
          onSeek={(e: any) => setState({ ...state, seeking: true })}
          onDuration={(duration: number) => setState({ ...state, duration })}
          onReady={() => setState({ ...state, bufferring: false, seeking: false })}
          onStart={() => setState({ ...state, bufferring: false, playing: true })}
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
            playing={state.playing}
            played={state.playedSeconds}
            muted={state.muted}
            duration={state.duration}
            playbackRate={state.playbackRate}
            volume={state.volume}
            onMute={() => setState({ ...state, muted: !state.muted })}
            onPlayPause={() => setState({ ...state, playing: !state.playing })}
            onSeekMouseDown={() => setState({ ...state, controlSeeking: true })}
            onSeekMouseUp={(e: any, newValue: any) => {
              setState({ ...state, controlSeeking: false });
              playerRef.current.seekTo(newValue);
            }}
            onRewind={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)}
            onFastForward={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)}
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
            onPlaybackRateChange={(rate: number) => setState({ ...state, playbackRate: rate })}
            onToggleFullScreen={() => (screenful as Screenfull).toggle(playerContainerRef.current)}
          />
        )}
      </div>
    </>
  );
}

export default VideoPlayer;
