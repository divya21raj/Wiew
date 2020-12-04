import React, { useEffect, useState } from 'react';
import { useAppState, useDbState } from '..';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { docToMedia, MULTI, SOURCEMAP } from './media';
import { initialRemoteMedia } from './mediaReducers';

export default function MediaSyncHandler(props: React.PropsWithChildren<{}>) {
  const { db, updateInDb, setInDb, getFromDb } = useDbState();
  const { remoteMedia, dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const { room } = useVideoContext();

  const [firstRun, setFirstRun] = useState(true);

  const isMe = (username: String): boolean => {
    return room.localParticipant.identity.toString() === username;
  };

  const updateOnServer = (payload: any) => {
    if (!firstRun) {
      console.log('Sending an upadate');
      updateInDb(db, room.name, { ...payload, lastUpdatedBy: room.localParticipant.identity.toString() });
    } else setFirstRun(false);
  };

  // Update the playing status on the server
  useEffect(() => {
    updateOnServer({ playing: remoteMedia.playing });
  }, [remoteMedia.playing]);

  // Update the timestamp on the server
  useEffect(() => {
    updateOnServer({ timestamp: remoteMedia.timestamp });
  }, [remoteMedia.timestamp]);

  // Update new media loads on server
  useEffect(() => {
    if (remoteMedia.source !== SOURCEMAP.LOCAL) updateOnServer({ url: remoteMedia.url, source: remoteMedia.source });
    else updateOnServer({ url: '', fileName: remoteMedia.fileName, source: remoteMedia.source });
  }, [remoteMedia.url, remoteMedia.source, remoteMedia.fileName]);

  /**
   * Adds a listener to the room document
   */
  const subscribeForChanges = () => {
    return db
      .collection('rooms')
      .doc(room.name)
      .onSnapshot(
        function(doc) {
          if (doc.data()) {
            if (!isMe(doc.data()!.lastUpdatedBy)) {
              console.log('Got enriched snapshot, matching localMedia with this');
              console.log(doc.data());
              dispatchLocalMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
            } else console.log('Was me yo');

            // if (
            //   doc.data()!.source !== localMedia.source.toString() ||
            //   (doc.data()!.url && doc.data()!.url !== localMedia.url)
            // ) {
            //   // Source or url have changed
            //   console.log('Source or url have changed');
            //   dispatchLocalMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
            // }

            // TODO -> Check if we only need dispatchLocalMedia here.
            if (doc.data()!.source === SOURCEMAP.LOCAL && !doc.data()!.fileName) {
              // data reset, reset the remote media too
              console.log('data reset, reset the remote media too');
              dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
            }
          } else console.log('NO DATA');
        },
        function(error) {
          console.log(error.message);
        }
      );
  };

  /**
   * Init an empty room or join the pre-existing room on startup. Add the listener in both cases.
   * In cleanup, unsubscribe the listener.
   */
  useEffect(() => {
    var unsubscribeListener: any = null;

    getFromDb(db, room.name)
      .then((doc: any) => {
        if (doc.exists) {
          // Someone already in room, match that data. Matching happens while subscribing
          // Add a listener for remote media changes
          console.log('Someone already in room');
          unsubscribeListener = subscribeForChanges();
        } else {
          // No one in the room, init it
          setInDb(db, room.name, { ...initialRemoteMedia })
            .then(function() {
              console.log('inited empty room');
              // Add a listener for remote media changes
              unsubscribeListener = subscribeForChanges();
            })
            .catch((error: any) => {
              console.error('Error writing document: ', error);
            });
        }
      })
      .catch((error: any) => {
        console.error('Error writing document: ', error);
      });

    return function cleanup() {
      console.log('Cleanup listener');
      if (unsubscribeListener) unsubscribeListener();
    };
  }, []);

  return <>{props.children}</>;
}
