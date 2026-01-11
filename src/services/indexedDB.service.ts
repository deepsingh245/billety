const DB_NAME = 'billety-db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

export const indexedDBService = {
    // Initialize the database
    initDB: (): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event);
                reject('Error opening database');
            };

            request.onsuccess = (event) => {
                resolve((event.target as IDBOpenDBRequest).result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    },

    // Save image (with compression if needed)
    saveImage: async (id: string, file: File): Promise<string> => {
        try {
            const db = await indexedDBService.initDB();

            // Compress if larger than 500KB
            let blobToSave: Blob = file;
            if (file.size > 500 * 1024) {
                blobToSave = await compressImage(file);
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);

                const imageData = {
                    id,
                    blob: blobToSave,
                    timestamp: Date.now(),
                    type: file.type
                };

                const request = store.put(imageData);

                request.onsuccess = () => {
                    resolve('Image saved successfully');
                };

                request.onerror = () => {
                    reject('Error saving image');
                };
            });
        } catch (error) {
            console.error('Error in saveImage:', error);
            throw error;
        }
    },

    // Get image by ID
    getImage: async (id: string): Promise<string | null> => {
        try {
            const db = await indexedDBService.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(id);

                request.onsuccess = () => {
                    const result = request.result;
                    if (result && result.blob) {
                        const url = URL.createObjectURL(result.blob);
                        resolve(url);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    reject('Error retrieving image');
                };
            });
        } catch (error) {
            console.error('Error in getImage:', error);
            return null;
        }
    },

    // Delete image by ID
    deleteImage: async (id: string): Promise<void> => {
        try {
            const db = await indexedDBService.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(id);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    reject('Error deleting image');
                };
            });
        } catch (error) {
            console.error('Error in deleteImage:', error);
            throw error;
        }
    }
};

// Helper function to compress image
const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Resize to max width of 800px
                const scaleSize = MAX_WIDTH / img.width;

                // Only resize if width > MAX_WIDTH
                if (scaleSize < 1) {
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Compress to JPEG with 0.7 quality
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject('Compression failed');
                        }
                    },
                    'image/jpeg',
                    0.7
                );
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
};
