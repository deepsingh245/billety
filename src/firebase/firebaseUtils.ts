import {
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  onSnapshot,
  where,
  DocumentData,
  CollectionReference,
  QueryConstraint,
  DocumentReference,
  UpdateData,
} from "firebase/firestore";
import { db } from "./firebase.config";

// Type for where filter operators (manual because Firebase doesn't export it directly)
type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "not-in"
  | "array-contains-any";

// Helper to get typed collection reference
const getCollectionRef = <T = DocumentData>(path: string): CollectionReference<T> => {
  return collection(db, path) as CollectionReference<T>;
};

// Create a document (auto-ID or custom ID)
export async function createDocument<T>(
  collectionPath: string,
  data: T,
  customId?: string
): Promise<void> {
  try {
    const ref = customId
      ? doc(db, collectionPath, customId)
      : doc(collection(db, collectionPath)); // Corrected
    await setDoc(ref, data);
    console.log(`Document created in ${collectionPath} ${customId ? `with ID ${customId}` : ""}`);
  } catch (error) {
    console.error("Error creating document:", error);
  }
}

// Update a document
export async function updateDocument<T>(
  collectionPath: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  try {
    const ref = doc(db, collectionPath, docId);
    await updateDoc(ref as DocumentReference<DocumentData, T>, data as UpdateData<T>);
    console.log(`Document ${docId} updated in ${collectionPath}`);
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

// Delete a document
export async function deleteDocument(
  collectionPath: string,
  docId: string
): Promise<void> {
  try {
    const ref = doc(db, collectionPath, docId);
    await deleteDoc(ref);
    console.log(`Document ${docId} deleted from ${collectionPath}`);
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

// Fetch a single document
export async function getDocument<T>(
  collectionPath: string,
  docId: string
): Promise<T | null> {
  try {
    const ref = doc(db, collectionPath, docId);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) return snapshot.data() as T;
    console.warn(`Document ${docId} not found in ${collectionPath}`);
    return null;
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// Fetch all documents in a collection (with optional filters)
export async function getAllDocuments<T>(
  collectionPath: string,
  filters?: [string, WhereFilterOp, any][]
): Promise<T[]> {
  try {
    let ref = getCollectionRef<T>(collectionPath);

    let q = filters && filters.length
      ? query(ref, ...filters.map(([f, op, v]) => where(f, op, v) as QueryConstraint))
      : ref;

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as T);
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
}

// Real-time listener
export function listenToCollection<T>(
  collectionPath: string,
  onUpdate: (data: T[]) => void,
  filters?: [string, WhereFilterOp, any][]
): () => void {
  try {
    let ref = getCollectionRef<T>(collectionPath);

    let q = filters && filters.length
      ? query(ref, ...filters.map(([f, op, v]) => where(f, op, v) as QueryConstraint))
      : ref;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as T);
      onUpdate(data);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up listener:", error);
    return () => {};
  }
}
