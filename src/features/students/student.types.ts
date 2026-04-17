export interface Student {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  parentEmail: string;
  studentId: string; // Custom enrollment ID
  status: 'Active' | 'Alumni' | 'Inactive';
  classId: string;
  enrollmentDate: string;
  createdAt: any;
  updatedAt: any;
  photoURL?: string;
  contactNumber?: string;
  dob?: string;
  address?: string;
}

export interface StudentFormData {
  name: string;
  grade: string;
  parentEmail: string;
  studentId: string;
  classId: string;
  status: 'Active' | 'Alumni' | 'Inactive';
  dob?: string;
  address?: string;
  contactNumber?: string;
}
