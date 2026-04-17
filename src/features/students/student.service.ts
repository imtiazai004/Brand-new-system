import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Student, StudentFormData } from './student.types';

export const studentService = {
  getStudentsCollection(schoolId: string) {
    if (!schoolId) {
      throw new Error('School ID is required for this operation');
    }
    return collection(db, 'schools', schoolId, 'students');
  },

  async createStudent(schoolId: string, data: StudentFormData) {
    try {
      const colRef = this.getStudentsCollection(schoolId);
      const docRef = await addDoc(colRef, {
        ...data,
        schoolId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/students`);
    }
  },

  async updateStudent(schoolId: string, studentId: string, data: Partial<StudentFormData>) {
    try {
      if (!schoolId || !studentId) {
        throw new Error('School ID and Student ID are required for update');
      }
      const docRef = doc(db, 'schools', schoolId, 'students', studentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `schools/${schoolId}/students/${studentId}`);
    }
  },

  async deleteStudent(schoolId: string, studentId: string) {
    try {
      if (!schoolId || !studentId) {
        throw new Error('School ID and Student ID are required for deletion');
      }
      const docRef = doc(db, 'schools', schoolId, 'students', studentId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/students/${studentId}`);
    }
  },

  subscribeToStudents(schoolId: string, callback: (students: Student[]) => void) {
    const colRef = this.getStudentsCollection(schoolId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as Student[];
      callback(students);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/students`);
    });
  },

  async getStudent(schoolId: string, studentId: string): Promise<Student | null> {
    try {
      if (!schoolId || !studentId) {
        throw new Error('School ID and Student ID are required');
      }
      const docRef = doc(db, 'schools', schoolId, 'students', studentId);
      const docSnap = await getDocFromServer(docRef); // Use server to ensure fresh data
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Student;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `schools/${schoolId}/students/${studentId}`);
      return null;
    }
  }
};
