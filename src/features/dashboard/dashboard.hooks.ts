import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats } from './dashboard.service';
import { schoolService, School } from '../onboarding/onboarding.service';

export function useDashboardStats(schoolId: string | undefined) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setStats(null);
      setSchool(null);
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const [statsData, schoolData] = await Promise.all([
          dashboardService.getDashboardStats(schoolId!),
          schoolService.getSchool(schoolId!)
        ]);
        setStats(statsData);
        setSchool(schoolData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [schoolId]);

  return { stats, school, loading, error };
}
