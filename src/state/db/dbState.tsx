import React, { createContext, useContext } from 'react';
import { getFromDb, setInDb, updateInDb, useFirebaseDb } from './useDb';

interface DbContextContextType {
  db: firebase.firestore.Firestore;
  setInDb: any;
  updateInDb: any;
  getFromDb: any;
  listenInDb: any;
}

export const DbStateContext = createContext<DbContextContextType>(null!);

export function DbStateProvider(props: React.PropsWithChildren<{}>) {
  let dbContextValue = {
    ...useFirebaseDb(),
    setInDb: setInDb,
    updateInDb: updateInDb,
    getFromDb: getFromDb,
  } as DbContextContextType;

  return <DbStateContext.Provider value={{ ...dbContextValue }}>{props.children}</DbStateContext.Provider>;
}

export function useDbState() {
  const context = useContext(DbStateContext);
  if (!context) {
    throw new Error('useDbState must be used within the DbStateProvider');
  }
  return context;
}
