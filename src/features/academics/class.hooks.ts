import { useState, useEffect } from 'react';
import { classService, ClassData } from './class.service';

export function useClasses(schoolId: string | undefined) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setClasses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = classService.subscribeToClasses(schoolId, (data) => {
      setClasses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId]);

  return { classes, loading };
}
