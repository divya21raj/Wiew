import React, { useEffect, useState } from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../state';
import { MULTI } from '../../state/media/media';
import { docToRemoteMedia } from '../../state/media/media';

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
  const [hasInit, setHasInit] = useState(false);
  const { db, setInDb, getFromDb } = useDbState();
  const { remoteMedia, user, dispatchRemoteMedia } = useAppState();
  const { room } = useVideoContext();

  useEffect(() => {
    console.log("Room effect")
    if(!hasInit){  
      getFromDb(db, room.name)
      .then((doc: any) => {
        if (doc.exists) {
          setHasInit(true)
          // someone already in room, match that data
          console.log("Existing Document data:", doc.data());
          dispatchRemoteMedia({ name: MULTI, value: {...docToRemoteMedia(doc.data())}});
          console.log(remoteMedia);
        } else {
            // No one in the room, init it
            console.log("No such document!");
            setInDb(db, room.name, {...remoteMedia}).then(function() {
              console.log("Document successfully written!");
              setHasInit(true)
            })
            .catch((error: any) => console.error("Error writing document: ", error));  
        }
      })
      .catch((error: any) => console.error("Error writing document: ", error));
    }
  })
    
  return (
    <Container>
      <VideoPlayer/>
      <ParticipantList />
    </Container>
  );
}
