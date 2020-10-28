import React, { useState } from "react"; 
import ReactPlayer from "react-player";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        playerWrapper: {
            height: '100%',
            width: 'auto'
        },
        reactPlayer: {
            paddingTop: '56.25%', 
            position: 'relative',
        }
    }
));

export default function VideoPlayer() {
    
    const [videoFileURL, setVideoFileURL] = useState("");

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

    // const input = document.querySelector('[type=file]')
    // const url = URL.createObjectURL(input.files[0])

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
            <ReactPlayer light playing url={videoFileURL} />   
        </div>
    )
}