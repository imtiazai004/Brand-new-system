import { useState, useEffect } from 'react';
import { Student } from './student.types';
import { studentService } from './student.service';

export function useStudents(schoolId: string | undefined) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setStudents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = studentService.subscribeToStudents(schoolId, (data) => {
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId]);

  return { students, loading, error };
}

export function useStudent(schoolId: string | undefined, studentId: string | undefined) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !studentId) {
      setStudent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    studentService.getStudent(schoolId, studentId)
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [schoolId, studentId]);

  return { student, loading, error };
}
