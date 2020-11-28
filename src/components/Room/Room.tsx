import { styled } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState, useDbState } from '../../state';
import { docToMedia, MULTI, SOURCEMAP } from '../../state/media/media';
import { initialRemoteMedia } from '../../state/media/mediaReducers';
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
  const [hasInit, setHasInit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(NoMediaText.NO_FILE);

  const { db, setInDb, getFromDb } = useDbState();
  const { localMedia, remoteMedia, user, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const { room } = useVideoContext();

  // useEffect(() => {
  //   if (!hasInit) {
  //     setHasInit(true);

  //     getFromDb(db, room.name)
  //       .then((doc: any) => {
  //         if (doc.exists) {
  //           // someone already in room, match that data
  //           dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
  //           console.log('Already have this here - ');
  //           console.log(doc.data());
  //         } else {
  //           // No one in the room, init it
  //           setInDb(db, room.name, { ...initialRemoteMedia })
  //             .then(function() {
  //               console.log('inited empty room');
  //             })
  //             .catch((error: any) => {
  //               console.error('Error writing document: ', error);
  //               setHasInit(false);
  //             });
  //         }
  //       })
  //       .catch((error: any) => {
  //         console.error('Error writing document: ', error);
  //         setHasInit(false);
  //       });

  //     // Add a listener for remote media changes
  //     db.collection('rooms')
  //       .doc(room.name)
  //       .onSnapshot(
  //         function(doc) {
  //           if (doc.data()) {
  //             console.log('Got enriched snapshot of this- Matching localMedia with this');
  //             console.log(doc.data());
  //             dispatchLocalMedia({
  //               name: MULTI,
  //               value: { playing: doc.data()!.playing, timestamp: doc.data()!.timestamp },
  //             });

  //             if (doc.data()!.source && doc.data()!.url) {
  //               // Source or url have changed
  //               dispatchLocalMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
  //             }

  //             if (!doc.data()!.url)
  //               // data reset, reset the remote media too
  //               dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
  //           } else console.log('NO DATA');
  //         },
  //         function(error) {
  //           console.log(error.message);
  //         }
  //       );
  //   }

  //   if (localMedia.source === SOURCEMAP.LOCAL) {
  //     if (!(localMedia.fileName && remoteMedia.fileName)) {
  //       // nothing loaded, prompt user to load something
  //       setDialogMessage(NoMediaText.NO_FILE);
  //       setShowDialog(true);
  //     } else if (localMedia.fileName !== remoteMedia.fileName) {
  //       // fileName mismatch, prompt to load new file
  //       setDialogMessage(NoMediaText.NO_MATCH);
  //       setShowDialog(true);
  //     } else setShowDialog(false);
  //   }
  // }, [remoteMedia, localMedia.fileName]);

  useEffect(() => {
    console.log('init here?');
  }, []);

  return (
    <Container>
      <VideoPlayer />
      <ParticipantList />
      {showDialog && <NoMediaDialog text={dialogMessage} />}
    </Container>
  );
}
