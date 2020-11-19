import { User } from 'firebase';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { TwilioError } from 'twilio-video';
import { RoomType } from '../types';
import { Media } from './media/media';
import {
  initialLocalMedia,
  initialRemoteMedia,
  localMediaReducer,
  MediaAction,
  remoteMediaReducer,
} from './media/mediaReducers';
import { initialSettings, Settings, SettingsAction, settingsReducer } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';
import { getFromDb, setInDb, updateInDb, useFirebaseDb } from './useDb/useDb';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';

export interface AppStateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  getToken(name: string, room: string, passcode?: string): Promise<string>;
  user?: User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  remoteMedia: Media;
  dispatchRemoteMedia: React.Dispatch<MediaAction>;
  localMedia: Media;
  dispatchLocalMedia: React.Dispatch<MediaAction>;
  roomType?: RoomType;
}

export interface DbContextContextType {
  db: firebase.firestore.Firestore;
  setInDb: any;
  updateInDb: any;
  getFromDb: any;
  listenInDb: any;
}

export const StateContext = createContext<AppStateContextType>(null!);
export const DbStateContext = createContext<DbContextContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks fron being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);
  const [remoteMedia, dispatchRemoteMedia] = useReducer(remoteMediaReducer, initialRemoteMedia);
  const [localMedia, dispatchLocalMedia] = useReducer(localMediaReducer, initialLocalMedia);

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    remoteMedia,
    dispatchRemoteMedia,
    localMedia,
    dispatchLocalMedia,
  } as AppStateContextType;

  if (process.env.REACT_APP_SET_AUTH === 'firebase') {
    contextValue = {
      ...contextValue,
      ...useFirebaseAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    contextValue = {
      ...contextValue,
      ...usePasscodeAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else {
    contextValue = {
      ...contextValue,
      getToken: async (identity, roomName) => {
        const headers = new window.Headers();
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
        const params = new window.URLSearchParams({ identity, roomName });

        return fetch(`${endpoint}?${params}`, { headers }).then(res => res.text());
      },
    };
  }

  const getToken: AppStateContextType['getToken'] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  return <StateContext.Provider value={{ ...contextValue, getToken }}>{props.children}</StateContext.Provider>;
}

export function DbStateProvider(props: React.PropsWithChildren<{}>) {
  let dbContextValue = {
    ...useFirebaseDb(),
    setInDb: setInDb,
    updateInDb: updateInDb,
    getFromDb: getFromDb,
  } as DbContextContextType;

  return <DbStateContext.Provider value={{ ...dbContextValue }}>{props.children}</DbStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}

export function useDbState() {
  const context = useContext(DbStateContext);
  if (!context) {
    throw new Error('useDbState must be used within the DbStateProvider');
  }
  return context;
}
