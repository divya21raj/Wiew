import { styled } from '@material-ui/core/styles';
import React, { useState } from 'react';
import NoMediaDialog, { NoMediaText } from '../Dialogs/NoMediaDialog';
import ParticipantList from '../ParticipantList/ParticipantList';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
  gridTemplateRows: '100%',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: `100%`,
    gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
  },
}));

export default function Room() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(NoMediaText.NO_FILE);

  return (
    <Container>
      <VideoPlayer />
      <ParticipantList />
      {showDialog && <NoMediaDialog text={dialogMessage} />}
    </Container>
  );
}
