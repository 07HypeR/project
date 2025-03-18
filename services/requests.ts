import { 
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function createBloodRequest({
  patientName,
  bloodType,
  units,
  urgency,
  hospitalName,
  location,
  contactNumber,
  additionalNotes
}) {
  try {
    const docRef = await addDoc(collection(db, 'requests'), {
      patientName,
      bloodType,
      units,
      urgency,
      hospitalName,
      location,
      contactNumber,
      additionalNotes,
      status: 'active',
      createdAt: serverTimestamp(),
      responses: []
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

export async function getBloodRequests({ status = 'active', bloodType = null }) {
  try {
    let q = query(
      collection(db, 'requests'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );

    if (bloodType) {
      q = query(q, where('bloodType', '==', bloodType));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}

export async function respondToRequest(requestId: string, userId: string, response: {
  status: 'accepted' | 'pending',
  message?: string
}) {
  try {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, {
      [`responses.${userId}`]: {
        ...response,
        timestamp: serverTimestamp()
      }
    });
  } catch (error) {
    throw error;
  }
}