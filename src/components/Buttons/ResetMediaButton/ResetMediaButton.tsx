import React from 'react';

import { Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useAppState, useDbState } from '../../../state';
import { MULTI, SOURCEMAP } from '../../../state/media/media';
import { initialLocalMedia, initialRemoteMedia } from '../../../state/media/mediaReducers';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function ResetMediaButton() {
  const { dispatchLocalMedia, dispatchRemoteMedia } = useAppState();
  const { db, setInDb } = useDbState();
  const { room } = useVideoContext();

  const initialMedia = { url: '', source: SOURCEMAP.LOCAL, playing: false, timestamp: 0, fileName: '' };

  const handleClick = (e: any) => {
    dispatchLocalMedia({ name: MULTI, value: { ...initialMedia } });
    dispatchRemoteMedia({ name: MULTI, value: { ...initialMedia } });
    setInDb(db, room.name, initialMedia);
  };

  return (
    <IconButton color="secondary" aria-label="add an alarm" onClick={handleClick}>
      <DeleteIcon />
    </IconButton>
  );
}
