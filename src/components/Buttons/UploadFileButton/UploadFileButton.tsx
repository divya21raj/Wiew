import React, { useCallback } from 'react';

import { Button } from '@material-ui/core';

import { useAppState } from '../../../state';

//https://masakudamatsu.medium.com/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

export default function UploadFileButton(props: { className?: string }) {
  const { media, dispatchMedia } = useAppState();

  const hiddenFileInput = React.useRef(document.createElement("input"));
  
  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  const handleChange = useCallback(
    (e: any) => {
      console.log(e.target.files);
      let files = e.target.files;
      let file = files[0];
      const urlString = URL.createObjectURL(file);
      dispatchMedia({ name: "url", value: urlString});
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
