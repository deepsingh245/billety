// src/lib/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export const uploadImage = async (
  file: File,
  folder: string,
  customFileName?: string
): Promise<string> => {
  try {
    const fileName = customFileName || `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};
