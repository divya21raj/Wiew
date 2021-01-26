import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { docToMedia, instanceOfMedia } from '../media/media';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

const collection = 'rooms';

export function useFirebaseDb() {
  const [db, setDb] = useState<firebase.firestore.Firestore | null>(null);

  useEffect(() => {
    console.log(process.env);
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    setDb(db);
  }, []);

  return { db };
}

/**
 * Method to set a document in the DB.
 * @param db instance of the db
 * @param collection collection name
 * @param docId id of the doc to set
 * @param doc body of the doc. Has to the full object, as overwrite will happen
 */
export function setInDb(db: firebase.firestore.Firestore, docId: string, doc: any) {
  if (instanceOfMedia(doc)) doc = docToMedia(doc);
  return db
    .collection(collection)
    .doc(docId)
    .set(doc);
}

/**
 * Method to update a document in the DB.
 * @param db instance of the db
 * @param collection collection name
 * @param docId id of the doc to set
 * @param doc body of the doc. Can be just a subset of the full object
 */
export function updateInDb(db: firebase.firestore.Firestore, docId: string, doc: any) {
  if (instanceOfMedia(doc)) doc = docToMedia(doc);
  return db
    .collection(collection)
    .doc(docId)
    .set(doc, { merge: true });
}

export function getFromDb(db: firebase.firestore.Firestore, docId: string) {
  return db
    .collection(collection)
    .doc(docId)
    .get();
}
