export const getUserCollectionPath = (userId: string, collectionName: string) => {
    return `users/${userId}/${collectionName}`;
};
