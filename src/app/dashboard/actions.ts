'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

// A helper to convert Firestore Timestamps to serializable strings
const serializeFirestoreTimestamps = (data: any): any => {
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            // Recurse into nested objects
            serializeFirestoreTimestamps(data[key]);
        } else if (Array.isArray(data[key])) {
            // Recurse into arrays
            data[key].forEach((item: any) => serializeFirestoreTimestamps(item));
        }
    }
    return data;
}

export async function getUserContent(userId: string): Promise<any[]> {
  if (!userId) {
    return [];
  }

  try {
    const contentRef = collection(db, 'content');
    const q = query(contentRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const contentList = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore returns complex objects, we need to make sure they are serializable
      const serializedData = serializeFirestoreTimestamps({ id: doc.id, ...data });
      return serializedData;
    });
    
    return contentList;
  } catch (error) {
    console.error("Error fetching user content: ", error);
    return [];
  }
}
