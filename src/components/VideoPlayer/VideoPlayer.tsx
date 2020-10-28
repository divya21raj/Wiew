import React, { useState } from "react"; 
import ReactPlayer from "react-player";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
    
    const [videoFileURL, setVideoFileURL] = useState("https://www.youtube.com/watch?v=ysz5S6PUM-U");

    const handleVideoUpload = (e: any) => {
        console.log(e.target.files);
        let files = e.target.files;
        if (files.length === 1) {
            let file = files[0];
            // this.setState({
            //     videoFileURL: URL.createObjectURL(file),
            //     videoFileObject: file
            // });
            setVideoFileURL(URL.createObjectURL(file));
        }
    };

    const classes = useStyles();

    return (
        // Render a YouTube video player
        <div className={classes.playerWrapper} >
            <form id="videoFile">
                <input
                    type="file"
                    name="video"
                    multiple={false}
                    onChange={e => {
                    handleVideoUpload(e);
                    }}
                />
            </form>
            <ReactPlayer 
                className={classes.reactPlayer}
                light
                width='100%'
                height='100%'
                playing url={videoFileURL} />   
        </div>
    )
}