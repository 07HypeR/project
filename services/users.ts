import { 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  GeoPoint,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getUserProfile(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  try {
    await updateDoc(doc(db, 'users', userId), data);
  } catch (error) {
    throw error;
  }
}

export async function findNearbyDonors({ bloodType, location, radius = 10 }) {
  try {
    // In a real implementation, you would use geoqueries
    // For now, we'll just get donors with matching blood type
    const q = query(
      collection(db, 'users'),
      where('isDonor', '==', true),
      where('isAvailable', '==', true),
      where('bloodType', '==', bloodType),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}