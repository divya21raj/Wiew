import { Grid, IconButton, TextField } from '@material-ui/core';
import EjectIcon from '@material-ui/icons/Eject';
import React, { useState } from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../../state';
import { MULTI, SOURCEMAP } from '../../../state/media/media';

export default function YouTubeController() {
  const { remoteMedia, localMedia, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const [value, setValue] = useState(remoteMedia.url);
  const { db, updateInDb } = useDbState();
  const { room } = useVideoContext();

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    dispatchLocalMedia({ name: MULTI, value: { url: value, source: SOURCEMAP.YT } });
    updateInDb(db, room.name, { url: value, source: SOURCEMAP.YT })
      .then(() => {
        dispatchRemoteMedia({ name: MULTI, value: { url: value, source: SOURCEMAP.YT } });
        console.log('Successful upload of local to remote');
      })
      .catch((error: any) => {
        console.log(error);
      });
    event.preventDefault();
  };

  return (
    <>
      <form noValidate autoComplete="off">
        <TextField id="yt-url" label="Video URL" variant="outlined" value={value} onChange={handleChange} />
      </form>
      <IconButton onClick={handleSubmit}>
        <EjectIcon />
      </IconButton>
    </>
  );
}
