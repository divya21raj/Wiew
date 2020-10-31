import { useCallback, useEffect, useState } from 'react';
import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID
};

export function useFirebaseDb() {
  const [db, setDb] = useState<firebase.firestore.Firestore | null>(null);

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    setDb(db);
  }, []);

  return { db };
}
