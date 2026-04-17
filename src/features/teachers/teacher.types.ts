export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  subjectSpecialty: string;
  assignedClasses: string[];
  email: string;
  contactInfo: string;
  createdAt: any;
  updatedAt: any;
  photoURL?: string;
}

export interface TeacherFormData {
  name: string;
  subjectSpecialty: string;
  email: string;
  contactInfo: string;
  assignedClasses: string[];
}
