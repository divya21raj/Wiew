import React, { useCallback, useEffect } from 'react';

import { Button } from '@material-ui/core';

import { useAppState, useDbState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { MULTI } from '../../../state/media/mediaReducer';

//https://masakudamatsu.medium.com/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

export default function UploadFileButton(props: { className?: string }) {
  const { media, dispatchMedia } = useAppState();
  const { db, updateInDb } = useDbState();
  const { room } = useVideoContext();

  const hiddenFileInput = React.useRef(document.createElement("input"));
  
  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  const DbUpdate = () => {
    updateInDb(db, room.name, {...media})
    .then(() => {console.log("Successful")})
    .catch((error: any) => {console.log(error)});
  }

  useEffect(() => {
    console.log(media);
    DbUpdate();
  }, [media]);

  const handleChange = useCallback(
    (e: any) => {
      console.log(e.target.files);
      let files = e.target.files;
      let file = files[0];
      const urlString = URL.createObjectURL(file);
      dispatchMedia({ name: MULTI, value: {"url": urlString, "fileName": file.name}});
    },
    [dispatchMedia]
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
