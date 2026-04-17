import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Teacher, TeacherFormData } from './teacher.types';

export const teacherService = {
  getTeachersCollection(schoolId: string) {
    if (!schoolId) {
      throw new Error('School ID is required for this operation');
    }
    return collection(db, 'schools', schoolId, 'teachers');
  },

  async createTeacher(schoolId: string, data: TeacherFormData) {
    try {
      const colRef = this.getTeachersCollection(schoolId);
      const docRef = await addDoc(colRef, {
        ...data,
        schoolId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/teachers`);
    }
  },

  async updateTeacher(schoolId: string, teacherId: string, data: Partial<TeacherFormData>) {
    try {
      if (!schoolId || !teacherId) {
        throw new Error('School ID and Teacher ID are required for update');
      }
      const docRef = doc(db, 'schools', schoolId, 'teachers', teacherId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `schools/${schoolId}/teachers/${teacherId}`);
    }
  },

  async deleteTeacher(schoolId: string, teacherId: string) {
    try {
      if (!schoolId || !teacherId) {
        throw new Error('School ID and Teacher ID are required for deletion');
      }
      const docRef = doc(db, 'schools', schoolId, 'teachers', teacherId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/teachers/${teacherId}`);
    }
  },

  subscribeToTeachers(schoolId: string, callback: (teachers: Teacher[]) => void) {
    const colRef = this.getTeachersCollection(schoolId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const teachers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as Teacher[];
      callback(teachers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/teachers`);
    });
  }
};
