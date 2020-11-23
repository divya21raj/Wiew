import { Button, Grid, IconButton, Popover, Typography } from '@material-ui/core';
import React from 'react';
import { useMediaState } from '../../../state';
import { SOURCEMAP } from '../../../state/media/mediaReducers';

//https://masakudamatsu.medium.com/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

export default function MediaController(props: { className?: string }) {
  const { localMedia, dispatchLocalMedia } = useMediaState();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleClick} aria-describedby={id}>
        {<localMedia.source.icon />}
      </IconButton>
      <Popover
        // container={(ref as RefObject<HTMLDivElement>)!.current}
        open={open}
        id={id}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Grid container direction="column-reverse">
          {Object.entries(SOURCEMAP).map(([key, value]) => (
            <Button
              key={key}
              startIcon={<value.icon />}
              onClick={() => {
                dispatchLocalMedia({ name: 'source', value: value });
                setAnchorEl(null);
              }}
              variant="text"
            >
              <Typography color={value === localMedia.source ? 'secondary' : 'inherit'}>{value.toString()}</Typography>
            </Button>
          ))}
        </Grid>
      </Popover>
      {<localMedia.source.controller />}
    </>
  );

  // return (
  //   <>
  //     <UploadFileButton />
  //     <ResetMediaButton />
  //     <Grid style={{ flex: 1, padding: '10px' }}>
  //       <Typography variant="body1">{fileName === '' ? 'No file loaded' : fileName}</Typography>
  //     </Grid>
  //   </>
  // );

  // return (
  //   <>
  //     <Button variant="contained" color="primary" onClick={handleClick}>
  //       Choose Media
  //     </Button>
  //     <input
  //       type="file"
  //       name="video"
  //       multiple={false}
  //       ref={hiddenFileInput}
  //       onChange={handleChange}
  //       style={{ display: 'none' }}
  //     />
  //   </>
  // );
}
