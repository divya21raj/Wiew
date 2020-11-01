import React, { useEffect } from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

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

  useEffect(() => {
    console.log("Room effect")
  })
    
  return (
    <Container>
      <VideoPlayer/>
      <ParticipantList />
    </Container>
  );
}
