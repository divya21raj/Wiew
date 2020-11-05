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

    const [seeking, setSeeking] = useState(false);
    const [ready, setReady] = useState(false);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    
    const classes = useStyles();

    const player = useRef<any>(null);

    useEffect(() => {
        updateInDb(db, room.name, {"playing": remoteMedia.playing})
    }, [remoteMedia.playing])

    useEffect(() => {
        updateInDb(db, room.name, {"timestamp": remoteMedia.timestamp})
    }, [remoteMedia.timestamp])

    useEffect(() => {        
        console.log("Seeking due to update");
        player.current.seekTo(localMedia.timestamp);
    }, [localMedia.timestamp])

    const handlePlayToggle = (playing: boolean, timestamp: number) => {
        console.log("Is Ready to playtoggle? " + ready);
        if(ready) {
            console.log("Upload in playToggle");
            dispatchLocalMedia({ name: MULTI, value: {"playing": playing, "timestamp": timestamp} });
            dispatchRemoteMedia({ name: MULTI, value: {"playing": playing, "timestamp": timestamp} });
        }
    }

    const handlePlay = () => {
        console.log('onPlay')
        handlePlayToggle(true, player.current.getCurrentTime());
    }

    const handlePause = () => {
        console.log('onPause')
        console.log(playedSeconds-player.current.getCurrentTime())
        if(Math.abs(playedSeconds-player.current.getCurrentTime()) < 1)
            handlePlayToggle(false, player.current.getCurrentTime());
    }

    const handleSeekChange = (e: any) => {
        console.log('onSeekManually', e);
        setSeeking(true);
    }

    const handleOnReady = () => {
        console.log('onReady')
        setReady(true);
        if(seeking) {
            dispatchRemoteMedia({name: "timestamp", value: player.current.getCurrentTime()});
            console.log("Upload");
        }
    }

    const handleProgress = (state: any) => {
        setPlayedSeconds(state.playedSeconds);
    }

    const handleEnded = () => {
        console.log('onEnded')
    }

    const handleDuration = (duration: any) => {
        console.log('onDuration', duration)
    }

    return (
        <div className={classes.playerWrapper} >
            <ReactPlayer 
                className={classes.reactPlayer}
                ref={player}
                controls
                width='100%'
                height='100%'
                playing={localMedia.playing} 
                url={localMedia.url}
                onReady={handleOnReady}
                onStart={() => console.log('onStart')}
                onPlay={handlePlay}
                onPause={handlePause}
                onBuffer={() => {
                    console.log('onBuffer')
                    setReady(false);
                }}
                onSeek={handleSeekChange}
                onEnded={handleEnded}
                onError={e => console.log('onError', e)}
                onProgress={handleProgress}
                onDuration={handleDuration}>
            </ReactPlayer>
        </div>
    );
}