import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { useDbState } from '..';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Media, MULTI } from './media';
import { initialLocalMedia, localMediaReducer, MediaAction } from './mediaReducers';

export interface MediaStateContextType {
  localMedia: Media;
  dispatchLocalMedia: React.Dispatch<MediaAction>;
}

export const MediaStateContext = createContext<MediaStateContextType>(null!);

export function MediaStateProvider(props: React.PropsWithChildren<{}>) {
  const [localMedia, dispatchLocalMedia] = useReducer(localMediaReducer, initialLocalMedia);
  const { db, setInDb, getFromDb, updateInDb } = useDbState();
  const { room } = useVideoContext();

  const [iUpdatedRemote, setIUpdatedRemote] = useState(false);

  // Add a listener for remote media changes
  db.collection('rooms')
    .doc(room.name)
    .onSnapshot(
      function(doc) {
        if (doc.data() && !iUpdatedRemote) {
          dispatchLocalMedia({
            name: MULTI,
            value: {
              playing: doc.data()!.playing,
              timestamp: doc.data()!.timestamp,
            },
          });
          setIUpdatedRemote(false);
        }
      },
      function(error) {
        console.log(error.message);
        setIUpdatedRemote(false);
      }
    );

  // Update DB on playing changed
  useEffect(() => {
    updateInDb(db, room.name, {
      playing: localMedia.playing,
      timestamp: localMedia.timestamp,
    });
    setIUpdatedRemote(true);
  }, [localMedia.playing]);

  // Update DB on url changed (Ex when what's playing changes, or the source changes altogeter)
  useEffect(() => {
    updateInDb(db, room.name, {
      url: localMedia.url,
      source: localMedia.source,
    });
    setIUpdatedRemote(true);
  }, [localMedia.url]);

  let contextValue = {
    localMedia,
    dispatchLocalMedia,
  } as MediaStateContextType;

  return <MediaStateContext.Provider value={{ ...contextValue }}>{props.children}</MediaStateContext.Provider>;
}

export function useMediaState() {
  const context = useContext(MediaStateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
