import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMissingFirebaseConfigKeys } from "./firebase-config";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp() {
  const missingKeys = getMissingFirebaseConfigKeys(firebaseConfig);
  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase 환경 변수가 누락되었습니다: ${missingKeys.join(", ")}`,
    );
  }

  firebaseApp ??= getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return firebaseApp;
}

export const getFirebaseDb = () => getFirestore(getFirebaseApp());
export const getFirebaseAuth = () => getAuth(getFirebaseApp());
