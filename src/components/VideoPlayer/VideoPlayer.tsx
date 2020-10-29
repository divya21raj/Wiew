import React, { useState } from "react"; 
import ReactPlayer from "react-player";
import { Player } from 'video-react';
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
    
    const { media } = useAppState();
    
    const classes = useStyles();

    return (
        // Render a YouTube video player
        <div className={classes.playerWrapper} >
            <ReactPlayer 
                className={classes.reactPlayer}
                light
                width='100%'
                height='100%'
                playing 
                url={media.url}>
            </ReactPlayer>
        </div>
    )
}