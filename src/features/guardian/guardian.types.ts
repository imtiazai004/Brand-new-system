import { Student } from '../students/student.types';

export interface ExamResult {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  grade: string;
  term: string;
  teacherComment?: string;
  schoolId: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  dueDate: string;
  paidDate?: string;
  description: string;
  schoolId: string;
}

export interface MeetingRequest {
  id: string;
  guardianId: string;
  teacherId: string;
  purpose: string;
  preferredTime: string;
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
  schoolId: string;
  teacherName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  schoolId: string;
}
