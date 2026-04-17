import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Student } from '../students/student.types';
import { ExamResult, FeeRecord, MeetingRequest, Announcement } from './guardian.types';

export const guardianService = {
  subscribeToChildData(schoolId: string, studentId: string, callback: (student: Student | null) => void) {
    const q = query(
      collection(db, 'schools', schoolId, 'students'),
      where('studentId', '==', studentId)
    );
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() } as Student);
      } else {
        callback(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `schools/${schoolId}/students`);
    });
  },

  subscribeToExamResults(schoolId: string, studentId: string, callback: (results: ExamResult[]) => void) {
    const q = query(
      collection(db, 'schools', schoolId, 'examResults'),
      where('studentId', '==', studentId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamResult));
      callback(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/examResults`);
    });
  },

  subscribeToFees(schoolId: string, studentId: string, callback: (fees: FeeRecord[]) => void) {
    const q = query(
      collection(db, 'schools', schoolId, 'fees'),
      where('studentId', '==', studentId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const fees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeeRecord));
      callback(fees);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/fees`);
    });
  },

  async requestMeeting(schoolId: string, data: Omit<MeetingRequest, 'id' | 'status'>) {
    try {
      await addDoc(collection(db, 'schools', schoolId, 'meetings'), {
        ...data,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/meetings`);
    }
  },

  subscribeToAnnouncements(schoolId: string, callback: (announcements: Announcement[]) => void) {
    // Announcements could be in a global school collection
    const q = collection(db, 'schools', schoolId, 'announcements');
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/announcements`);
    });
  }
};
