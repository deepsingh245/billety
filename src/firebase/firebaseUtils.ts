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
  writeBatch,
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
): Promise<string | undefined> {
  try {
    const ref = customId
      ? doc(db, collectionPath, customId)
      : doc(collection(db, collectionPath));
    await setDoc(ref, data);
    return ref.id;
  } catch (error) {
    console.error("Error creating document:", error);
    return undefined;
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
    const ref = collection(db, collectionPath);
    const q = filters?.length
      ? query(ref, ...filters.map(([field, op, value]) => where(field, op, value) as QueryConstraint))
      : ref;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  } catch (error: any) {
    console.error(`Error getting documents from ${collectionPath}:`, error.message, error.code, error.stack);
    throw error; // Propagate error for better debugging
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
    return () => { };
  }
}


/**
 * Efficiently deletes multiple documents in batches of 500.
 */
export async function deleteDocumentsBatch(
  collectionPath: string,
  docIds: string[]
): Promise<void> {
  const BATCH_SIZE = 500;
  try {
    for (let i = 0; i < docIds.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = docIds.slice(i, i + BATCH_SIZE);

      chunk.forEach((id) => {
        const ref = doc(db, collectionPath, id);
        batch.delete(ref);
      });

      await batch.commit();
    }
  } catch (error) {
    console.error("Error deleting documents batch:", error);
    throw error;
  }
}
