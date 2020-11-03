import React, { useEffect, useState } from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../state';
import { MULTI } from '../../state/media/media';
import { docToRemoteMedia } from '../../state/media/media';
import NoMediaDialog, { NoMediaText } from '../Dialogs/NoMediaDialog';

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
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(NoMediaText.NO_FILE);

  const { db, setInDb, getFromDb } = useDbState();
  const { localMedia, remoteMedia, user, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const { room } = useVideoContext();

  useEffect(() => {
    console.log("Room effect")
    if(!hasInit){  
      setHasInit(true);
      
      // Add a listener for remote media changes
      db.collection("rooms").doc(room.name)
      .onSnapshot(function(doc) {
          console.log("Current data: ", doc.data());
          dispatchLocalMedia({ name: MULTI, value: {"playing": doc.data()!.playing, "timestamp": doc.data()!.timestamp} });
      });

      getFromDb(db, room.name)
      .then((doc: any) => {
        if (doc.exists) {
          // someone already in room, match that data
          dispatchRemoteMedia({ name: MULTI, value: {...docToRemoteMedia(doc.data())}});
        } else {
            // No one in the room, init it
            setInDb(db, room.name, {...remoteMedia}).then(function() {
              console.log("inited empty room")
            })
            .catch((error: any) => {
              console.error("Error writing document: ", error);  
              setHasInit(false);
            });
        }
      })
      .catch((error: any) => { 
        console.error("Error writing document: ", error);
        setHasInit(false);
      });
    }

    if(!(localMedia.fileName && remoteMedia.fileName)) {
      // nothing loaded, prompt user to load something
      setDialogMessage(NoMediaText.NO_FILE);
      setShowDialog(true);
    } else if(localMedia.fileName !== remoteMedia.fileName) {
      // fileName mismatch, prompt to load new file
      setDialogMessage(NoMediaText.NO_MATCH);
      setShowDialog(true);
    } else setShowDialog(false);
  }, [remoteMedia]);
    
  return (
    <Container>
      <VideoPlayer/>
      <ParticipantList />
      { showDialog && <NoMediaDialog text={dialogMessage}/> }
    </Container>
  );
}
