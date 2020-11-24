import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FullScreen from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeMute from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import React, { forwardRef, RefObject } from 'react';
import { useControlStyles, usePrettoSliderStyles } from './styles/controlStyles';

const PrettoSlider = withStyles(usePrettoSliderStyles)(Slider);

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

interface ControlsProps {
  onSeek: (e: any, newValue: any) => void;
  onSeekMouseDown: (e: any) => void;
  onSeekMouseUp: (e: any, newValue: any) => void;
  onRewind: () => void;
  onPlayPause: () => void;
  onFastForward: () => void;
  onVolumeSeekDown: (e: any, newValue: any) => void;
  onChangeDispayFormat: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullScreen: () => void;
  onMute: () => void;
  onVolumeChange: (e: any, newValue: any) => void;
  playing: boolean;
  played: number;
  elapsedTime: string;
  totalDuration: string;
  muted: boolean;
  playbackRate: number;
  volume: number;
}

const Controls = forwardRef<HTMLDivElement, ControlsProps>((controlProps, ref) => {
  const classes = useControlStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div ref={ref} className={classes.controlsWrapper}>
      <Grid container direction="column" justify="space-between" style={{ flexGrow: 1 }}>
        <Grid container direction="row" alignItems="center" justify="space-between" style={{ padding: 16 }}>
          <Grid item>
            <Typography variant="h5" style={{ color: '#fff' }}>
              Video Title
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" justify="center">
          <IconButton onClick={controlProps.onRewind} className={classes.controlIcons} aria-label="rewind">
            <FastRewindIcon className={classes.controlIcons} fontSize="inherit" />
          </IconButton>
          <IconButton onClick={controlProps.onPlayPause} className={classes.controlIcons} aria-label="play">
            {controlProps.playing ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
          </IconButton>
          <IconButton onClick={controlProps.onFastForward} className={classes.controlIcons} aria-label="forward">
            <FastForwardIcon fontSize="inherit" />
          </IconButton>
        </Grid>
        {/* bottom controls */}
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: 16 }}>
          <Grid item xs={12}>
            <PrettoSlider
              min={0}
              max={100}
              ValueLabelComponent={props => <ValueLabelComponent {...props} value={controlProps.elapsedTime} />}
              aria-label="custom thumb label"
              value={controlProps.played * 100}
              onChange={controlProps.onSeek}
              onMouseDown={controlProps.onSeekMouseDown}
              onChangeCommitted={controlProps.onSeekMouseUp}
              // onDuration={controlProps.onDuration}
            />
          </Grid>

          <Grid item>
            <Grid container alignItems="center">
              <IconButton onClick={controlProps.onPlayPause} className={classes.bottomIcons}>
                {controlProps.playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>

              <IconButton
                // onClick={() => setState({ ...state, muted: !state.muted })}
                onClick={controlProps.onMute}
                // classes.volumeButton here instead of bottomIcons
                className={`${classes.bottomIcons} ${classes.bottomIcons}`}
              >
                {controlProps.muted ? (
                  <VolumeMute fontSize="large" />
                ) : controlProps.volume > 0.5 ? (
                  <VolumeUp fontSize="large" />
                ) : (
                  <VolumeDown fontSize="large" />
                )}
              </IconButton>

              <Slider
                min={0}
                max={100}
                value={controlProps.muted ? 0 : controlProps.volume * 100}
                onChange={controlProps.onVolumeChange}
                aria-labelledby="input-slider"
                className={classes.volumeSlider}
                onMouseDown={controlProps.onSeekMouseDown}
                onChangeCommitted={controlProps.onVolumeSeekDown}
              />
              <Button
                variant="text"
                onClick={
                  controlProps.onChangeDispayFormat
                  //     () =>
                  //   setTimeDisplayFormat(
                  //     timeDisplayFormat == "normal" ? "remaining" : "normal"
                  //   )
                }
              >
                <Typography variant="body1" style={{ color: '#fff', marginLeft: 16 }}>
                  {controlProps.elapsedTime}/{controlProps.totalDuration}
                </Typography>
              </Button>
            </Grid>
          </Grid>

          <Grid item>
            <Button onClick={handleClick} aria-describedby={id} className={classes.bottomIcons} variant="text">
              <Typography>{controlProps.playbackRate}X</Typography>
            </Button>

            <Popover
              container={(ref as RefObject<HTMLDivElement>)!.current}
              open={open}
              id={id}
              onClose={handleClose}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Grid container direction="column-reverse">
                {[0.5, 1, 1.5, 2].map(rate => (
                  <Button
                    key={rate}
                    //   onClick={() => setState({ ...state, playbackRate: rate })}
                    onClick={() => controlProps.onPlaybackRateChange(rate)}
                    variant="text"
                  >
                    <Typography color={rate === controlProps.playbackRate ? 'secondary' : 'inherit'}>
                      {rate}X
                    </Typography>
                  </Button>
                ))}
              </Grid>
            </Popover>
            <IconButton onClick={controlProps.onToggleFullScreen} className={classes.bottomIcons}>
              <FullScreen fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});

export default Controls;
