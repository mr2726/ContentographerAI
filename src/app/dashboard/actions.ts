'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';

export async function getUserContent(userId: string): Promise<any[]> {
  if (!userId) {
    return [];
  }

  try {
    const contentRef = collection(db, 'content');
    const q = query(contentRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const contentList = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Manually serialize the document to ensure complex types like Timestamps are converted.
      const serializedData = {
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt || null,
      };
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
            // Manually serialize the document
            return {
              ...data,
              id: docSnap.id,
              createdAt: data.createdAt instanceof Timestamp 
                  ? data.createdAt.toDate().toISOString() 
                  : data.createdAt || null,
            };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching content by ID:", error);
        return null;
    }
}
