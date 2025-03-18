import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  bloodType: string;
  phoneNumber: string;
}

interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, fullName, bloodType, phoneNumber }: SignUpData) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile
    await updateProfile(user, {
      displayName: fullName
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      fullName,
      bloodType,
      phoneNumber,
      createdAt: new Date().toISOString(),
      isDonor: true,
      isAvailable: true,
      donationCount: 0,
      lastDonation: null,
    });

    return user;
  } catch (error) {
    throw error;
  }
}

export async function signIn({ email, password }: SignInData) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
}