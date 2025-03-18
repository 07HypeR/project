import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_pLUeUXMhtUtqEucpNNbZRRW4DHqOM30",
  authDomain: "blooddonation-53ba8.firebaseapp.com",
  projectId: "blooddonation-53ba8",
  storageBucket: "blooddonation-53ba8.firebasestorage.app",
  messagingSenderId: "810247631014",
  appId: "1:810247631014:web:67db472dfe295041214467"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export app instance
export default app;