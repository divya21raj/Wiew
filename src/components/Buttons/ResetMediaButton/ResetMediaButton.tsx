import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useDbState, useMediaState } from '../../../state';
import { MULTI } from '../../../state/media/media';
import { initialLocalMedia } from '../../../state/media/mediaReducers';

export default function ResetMediaButton() {
  const { dispatchLocalMedia } = useMediaState();
  const { db, setInDb } = useDbState();
  const { room } = useVideoContext();

  const handleClick = (e: any) => {
    dispatchLocalMedia({ name: MULTI, value: { ...initialLocalMedia } });
    // setInDb(db, room.name, initialLocalMedia);
  };

  return (
    <IconButton color="secondary" aria-label="add an alarm" onClick={handleClick}>
      <DeleteIcon />
    </IconButton>
  );
}
