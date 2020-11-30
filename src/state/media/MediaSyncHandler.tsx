import React, { useEffect } from 'react';
import { useAppState, useDbState } from '..';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { docToMedia, MULTI } from './media';
import { initialRemoteMedia } from './mediaReducers';

export default function MediaSyncHandler(props: React.PropsWithChildren<{}>) {
  const { db, setInDb, getFromDb } = useDbState();
  const { dispatchRemoteMedia, dispatchLocalMedia } = useAppState();
  const { room } = useVideoContext();

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
            console.log('Got enriched snapshot, matching localMedia with this');
            console.log(doc.data());
            dispatchLocalMedia({
              name: MULTI,
              value: { playing: doc.data()!.playing, timestamp: doc.data()!.timestamp },
            });

            if (doc.data()!.source && doc.data()!.url) {
              // Source or url have changed
              dispatchLocalMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
            }

            if (!doc.data()!.url)
              // data reset, reset the remote media too
              dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
          } else console.log('NO DATA');
        },
        function(error) {
          console.log(error.message);
        }
      );
  };

  /**
   * Init an empty room or join the preexisting room on startup. Add the listener in both cases.
   * In cleanup, unsubscribe the listener.
   */
  useEffect(() => {
    var unsubscribeListener: any = null;

    getFromDb(db, room.name)
      .then((doc: any) => {
        if (doc.exists) {
          // someone already in room, match that data
          dispatchRemoteMedia({ name: MULTI, value: { ...docToMedia(doc.data()) } });
          console.log('Already have this here - ');
          console.log(doc.data());

          // Add a listener for remote media changes
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
      unsubscribeListener();
    };
  }, []);

  useEffect(() => {}, []);

  return <>{props.children}</>;
}
