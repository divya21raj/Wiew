import { IconButton, TextField } from '@material-ui/core';
import EjectIcon from '@material-ui/icons/Eject';
import React, { useEffect, useState } from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../../state';
import { MULTI, SOURCEMAP } from '../../../state/media/media';

export default function YouTubeController() {
  const { remoteMedia, localMedia, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const [value, setValue] = useState(remoteMedia.url);
  const { db, updateInDb } = useDbState();
  const { room } = useVideoContext();

  useEffect(() => {
    setValue(remoteMedia.url);
  }, [remoteMedia.url]);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    dispatchLocalMedia({ name: MULTI, value: { playing: false, url: value, source: SOURCEMAP.YT } });
    dispatchRemoteMedia({ name: MULTI, value: { playing: false, url: value, source: SOURCEMAP.YT } });
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
