import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import screenful, { Screenfull } from 'screenfull';
import { useMediaState } from '../../state';
import { MULTI } from '../../state/media/media';
import Controls from './Controls';

const useStyles = makeStyles(theme => ({
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%',
  },

  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  controlsWrapper: {
    visibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
  },
  middleControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomWrapper: {
    display: 'flex',
    flexDirection: 'column',

    // background: "rgba(0,0,0,0.6)",
    // height: 60,
    padding: theme.spacing(2),
  },

  bottomControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // height:40,
  },

  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: '#777',

    fontSize: 50,
    transform: 'scale(0.9)',
    '&:hover': {
      color: '#fff',
      transform: 'scale(1)',
    },
  },

  bottomIcons: {
    color: '#999',
    '&:hover': {
      color: '#fff',
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

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
  const classes = useStyles();

  const { localMedia, dispatchLocalMedia } = useMediaState();

  const [showControls, setShowControls] = useState(false);
  // const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState('normal');
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,
    muted: true,
    playedSeconds: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const {
    playing = false,
    light,
    muted = false,
    loop,
    playbackRate,
    pip,
    playedSeconds: played,
    seeking,
    volume,
  } = state;

  useEffect(() => {
    console.log('Is Ready to playtoggle? ' + ready);
    if (ready) {
      console.log('Upload in playToggle');
      console.log(state.playedSeconds - playerRef.current.getCurrentTime());
      if (Math.abs(state.playedSeconds - playerRef.current.getCurrentTime()) < 1)
        dispatchLocalMedia({ name: MULTI, value: { playing: playing, timestamp: state.playedSeconds } });
    }
  }, [state.playing]);

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
    console.log('Is Ready to playtoggle? ' + ready);
    if (ready) {
      console.log('Upload in playToggle');
      dispatchLocalMedia({ name: MULTI, value: { playing: playing, timestamp: state.playedSeconds } });
    }
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState: any) => {
    if (count > 3) {
      controlsRef.current.style.visibility = 'hidden';
      count = 0;
    }
    if (controlsRef.current.style.visibility == 'visible') {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e: any, newValue: any) => {
    console.log({ newValue });
    setState({ ...state, playedSeconds: newValue });
  };

  const handleSeekMouseDown = (e: any) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e: any, newValue: any) => {
    console.log({ value: e.target });
    setState({ ...state, seeking: false });
    // console.log(sliderRef.current.value)
    playerRef.current.seekTo(newValue);
  };

  const handleOnReady = () => {
    console.log('onReady');
    setReady(true);
    if (state.seeking) {
      dispatchLocalMedia({ name: 'timestamp', value: playerRef.current.getCurrentTime() });
      console.log('Upload');
    }
  };

  const handleDuration = (duration: number) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e: any, newValue: any) => {
    setState({ ...state, seeking: false, volume: newValue / 100 });
  };
  const handleVolumeChange = (e: any, newValue: any) => {
    // console.log(newValue);
    setState({
      ...state,
      volume: newValue / 100,
      muted: newValue === 0 ? true : false,
    });
  };

  const handleOnBuffer = () => {
    console.log('onBuffer');
    setReady(false);
  };

  const toggleFullScreen = () => {
    (screenful as Screenfull).toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    console.log('mousemove');
    controlsRef.current.style.visibility = 'visible';
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = 'hidden';
    count = 0;
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(timeDisplayFormat == 'normal' ? 'remaining' : 'normal');
  };

  const handlePlaybackRate = (rate: number) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const currentTime = playerRef && playerRef.current ? playerRef.current.getCurrentTime() : '00:00';

  const duration = playerRef && playerRef.current ? playerRef.current.getDuration() : '00:00';
  const elapsedTime = timeDisplayFormat == 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;

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
          pip={pip}
          playing={playing}
          controls={showControls}
          light={light}
          loop={loop}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onReady={handleOnReady}
          onBuffer={handleOnBuffer}
          config={{
            file: {
              attributes: {
                crossorigin: 'anonymous',
              },
            },
          }}
        />

        <Controls
          ref={controlsRef}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          onDuration={handleDuration}
          onRewind={handleRewind}
          onPlayPause={handlePlayPause}
          onFastForward={handleFastForward}
          playing={playing}
          played={played}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onMute={hanldeMute}
          muted={muted}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekDown={handleVolumeSeekDown}
          onChangeDispayFormat={handleDisplayFormat}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRate}
          onToggleFullScreen={toggleFullScreen}
          volume={volume}
        />
      </div>
    </>
  );
}

export default CustomVideoPlayer;
