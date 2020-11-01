import React, { useEffect, useRef, useState } from "react"; 
import ReactPlayer from "react-player";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppState, useDbState } from "../../state";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { MULTI } from "../../state/media/media";

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
    
    const { localMedia, remoteMedia, dispatchLocalMedia, dispatchRemoteMedia } = useAppState();
    const { db, updateInDb } = useDbState();
    const { room } = useVideoContext();
    
    const classes = useStyles();

    const player = useRef<any>(null);

    useEffect(() => {
        updateInDb(db, room.name, {"playing": remoteMedia.playing})
    }, [remoteMedia.playing])

    useEffect(() => {
        updateInDb(db, room.name, {"timestamp": remoteMedia.timestamp})
    }, [remoteMedia.timestamp])

    const handlePlayToggle = (playing: boolean) => {
        dispatchLocalMedia({ name: MULTI, value: {"playing": playing, "timestamp": player.current.getCurrentTime()} });
        dispatchRemoteMedia({ name: MULTI, value: {"playing": playing, "timestamp": player.current.getCurrentTime() + 1} });
    }

    const handlePlay = () => {
        console.log('onPlay')
        handlePlayToggle(true);
    }

    const handlePause = () => {
        console.log('onPause')
        handlePlayToggle(false);
    }

    const handleSeekChange = (e: any) => {
        // this.setState({ played: parseFloat(e.target.value) })
        console.log('onSeek', e);
        dispatchLocalMedia({name: "timestamp", value: e});
        dispatchRemoteMedia({name: "timestamp", value: e + 1});
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
                ref={player}
                light
                controls
                width='100%'
                height='100%'
                playing={localMedia.playing} 
                url={localMedia.url}
                onReady={() => console.log('onReady')}
                onStart={() => console.log('onStart')}
                onPlay={handlePlay}
                onPause={handlePause}
                onBuffer={() => console.log('onBuffer')}
                onSeek={handleSeekChange}
                onEnded={handleEnded}
                onError={e => console.log('onError', e)}
                // onProgress={handleProgress}
                onDuration={handleDuration}>
            </ReactPlayer>
        </div>
    )
}