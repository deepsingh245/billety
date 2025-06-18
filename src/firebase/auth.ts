// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase.config";

export const registerUser = async (email: string, password: string) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout error:", err);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
