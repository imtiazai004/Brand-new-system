import { useState, useEffect } from 'react';
import { Teacher } from './teacher.types';
import { teacherService } from './teacher.service';

export function useTeachers(schoolId: string | undefined) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setTeachers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = teacherService.subscribeToTeachers(schoolId, (data) => {
      setTeachers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId]);

  return { teachers, loading, error };
}
