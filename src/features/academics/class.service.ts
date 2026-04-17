import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';

export interface ClassData {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  studentCount: number;
  schoolId: string;
  createdAt: any;
}

export const classService = {
  getClassesCollection(schoolId: string) {
    return collection(db, 'schools', schoolId, 'classes');
  },

  async createClass(schoolId: string, data: Omit<ClassData, 'id' | 'createdAt' | 'schoolId'>) {
    try {
      const colRef = this.getClassesCollection(schoolId);
      await addDoc(colRef, {
        ...data,
        schoolId,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/classes`);
    }
  },

  subscribeToClasses(schoolId: string, callback: (classes: ClassData[]) => void) {
    const colRef = this.getClassesCollection(schoolId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const classes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as ClassData[];
      callback(classes);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/classes`);
    });
  }
};
