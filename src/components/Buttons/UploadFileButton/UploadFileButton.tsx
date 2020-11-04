import React, { useCallback, useEffect } from 'react';

import { Button } from '@material-ui/core';

import { useAppState, useDbState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { MULTI } from '../../../state/media/media';

//https://masakudamatsu.medium.com/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

export default function UploadFileButton(props: { className?: string }) {
  const { remoteMedia, localMedia, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const { db, updateInDb } = useDbState();
  const { room } = useVideoContext();

  const hiddenFileInput = React.useRef(document.createElement("input"));
  
  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if(localMedia.url){
      console.log(localMedia);
      console.log(remoteMedia);
      if(!remoteMedia.fileName || localMedia.fileName === remoteMedia.fileName) {
        updateInDb(db, room.name, {...localMedia})
        .then(() => {
          dispatchRemoteMedia({name: MULTI, value: {...localMedia}})
          console.log("Successful upload of local to remote")
        })
        .catch((error: any) => {console.log(error)});
      }
      else if(remoteMedia.fileName) {
        console.error("Files don't match!")
      }
    }
  }, [localMedia.url]);

  const handleChange = useCallback(
    (e: any) => {
      console.log(e.target.files);
      let files = e.target.files;
      let file = files[0];
      let urlString = URL.createObjectURL(file);

      if(remoteMedia.fileName && remoteMedia.fileName !== file.name) {
        console.error("Files don't match!")
        urlString = "";
      }
      dispatchLocalMedia({ name: MULTI, value: {"url": urlString, "fileName": file.name}});
    },
    [dispatchLocalMedia]
  );
    
  return (
    <>
      <Button 
        variant="contained"
        color="primary"
        onClick={handleClick} 
      >
        Choose Media
      </Button>
      <input
        type="file"
        name="video"
        multiple={false}
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display:'none'}}
      />
   </>
  );
}
