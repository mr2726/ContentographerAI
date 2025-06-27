'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';

// A helper to convert Firestore Timestamps to serializable strings
const serializeFirestoreTimestamps = (value: any): any => {
    if (value === null || value === undefined) {
        return value;
    }
    if (value instanceof Timestamp) {
        return value.toDate().toISOString();
    }
    if (Array.isArray(value)) {
        return value.map(item => serializeFirestoreTimestamps(item));
    }
    if (typeof value === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in value) {
            newObj[key] = serializeFirestoreTimestamps(value[key]);
        }
        return newObj;
    }
    return value;
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

export async function getContentById(contentId: string, userId: string): Promise<any | null> {
    if (!contentId || !userId) {
        return null;
    }

    try {
        const contentRef = doc(db, 'content', contentId);
        const docSnap = await getDoc(contentRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.userId !== userId) {
                console.error("User does not have access to this content.");
                return null;
            }
            return serializeFirestoreTimestamps({ id: docSnap.id, ...data });
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching content by ID:", error);
        return null;
    }
}
