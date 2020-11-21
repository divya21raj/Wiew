import { Grid, IconButton, TextField } from '@material-ui/core';
import EjectIcon from '@material-ui/icons/Eject';
import React, { useState } from 'react';
import { useMediaState } from '../../../state';
import { MULTI, SOURCEMAP } from '../../../state/media/media';

export default function YouTubeController() {
  const [value, setValue] = useState('');
  const { dispatchLocalMedia } = useMediaState();

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    dispatchLocalMedia({ name: MULTI, value: { url: value, source: SOURCEMAP.YT } });
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
