import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'management' | 'admin' | 'guardian';
  schoolId: string | null;
  studentId?: string; // Linked child ID for guardians
}

export const authService = {
  async register({ email, password, displayName, role, schoolId = null }: Omit<UserProfile, 'uid'> & { password: string }) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    const profile: UserProfile = {
      uid: user.uid,
      email,
      displayName,
      role,
      schoolId: schoolId || null
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return profile;
  },

  async login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const profile = await this.getUserProfile(user.uid);
    if (!profile) throw new Error('User profile not found');
    return profile;
  },

  async logout() {
    await signOut(auth);
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async updateUserProfile(uid: string, data: Partial<UserProfile>) {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    return onSnapshot(doc(db, 'users', uid), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserProfile);
      } else {
        callback(null);
      }
    });
  }
};
