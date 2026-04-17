import { collection, getCountFromServer } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';

export interface DashboardStats {
  students: number;
  teachers: number;
  classes: number;
}

export const dashboardService = {
  async getDashboardStats(schoolId: string): Promise<DashboardStats> {
    try {
      const studentsRef = collection(db, 'schools', schoolId, 'students');
      const teachersRef = collection(db, 'schools', schoolId, 'teachers');
      const classesRef = collection(db, 'schools', schoolId, 'classes');

      const [studentsSnap, teachersSnap, classesSnap] = await Promise.all([
        getCountFromServer(studentsRef),
        getCountFromServer(teachersRef),
        getCountFromServer(classesRef)
      ]);

      return {
        students: studentsSnap.data().count,
        teachers: teachersSnap.data().count,
        classes: classesSnap.data().count
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/stats`);
      return { students: 0, teachers: 0, classes: 0 };
    }
  }
};
