import React, { useState } from "react"; 
import ReactPlayer from "react-player";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppState } from "../../state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        playerWrapper: {
            position: "relative",
            paddingTop: "56.25%" 
        },
        reactPlayer: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        }  
    }
));

export default function VideoPlayer() {
    
    const { media, dispatchMedia } = useAppState();
    
    const classes = useStyles();

    const handlePlay = () => {
        console.log('onPlay')
        dispatchMedia({ name: "isPaused", value: false });
        // this.setState({ playing: true })
    }

    const handlePause = () => {
        console.log('onPause')
        // this.setState({ playing: false })
    }

    const handleSeekChange = (e: any) => {
        // this.setState({ played: parseFloat(e.target.value) })
        console.log('onSeek', e);
    }

    const handleProgress = (state: any) => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        // if (!this.state.seeking) {
        // this.setState(state)
        // }
    }

    const handleEnded = () => {
        console.log('onEnded')
        // this.setState({ playing: this.state.loop })
    }

    const handleDuration = (duration: any) => {
        console.log('onDuration', duration)
        // this.setState({ duration })
    }

    return (
        <div className={classes.playerWrapper} >
            <ReactPlayer 
                className={classes.reactPlayer}
                light
                controls
                width='100%'
                height='100%'
                playing={media.playing} 
                url={media.url}
                onReady={() => console.log('onReady')}
                onStart={() => console.log('onStart')}
                onPlay={handlePlay}
                onPause={handlePause}
                onBuffer={() => console.log('onBuffer')}
                onSeek={handleSeekChange}
                onEnded={handleEnded}
                onError={e => console.log('onError', e)}
                onProgress={handleProgress}
                onDuration={handleDuration}>
            </ReactPlayer>
        </div>
    )
}