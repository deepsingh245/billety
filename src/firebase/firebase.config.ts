// src/lib/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQGnCKQonOLh2dqCS50pm1B7BIgepOvl4",
  authDomain: "billety-f25d6.firebaseapp.com",
  projectId: "billety-f25d6",
  storageBucket: "billety-f25d6.firebasestorage.app",
  messagingSenderId: "898036288290",
  appId: "1:898036288290:web:c10056ab523101d97c737b",
  measurementId: "G-53TH7WP1GJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
