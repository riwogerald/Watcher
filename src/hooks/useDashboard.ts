import { useState, useEffect } from 'react';
import { Dashboard } from '../types';

export function useDashboard() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboard({
        totalIncidents: 156,
        openIncidents: 23,
        resolvedToday: 8,
        avgResolutionTime: 4.2, // hours
        incidentsByCategory: {
          it: 45,
          hr: 28,
          security: 32,
          facilities: 35,
          other: 16
        },
        incidentsByPriority: {
          low: 42,
          medium: 68,
          high: 35,
          critical: 11
        },
        recentIncidents: [], // Will be populated by useIncidents
        trend: [
          { date: '2024-01-01', incidents: 12, resolved: 8 },
          { date: '2024-01-02', incidents: 15, resolved: 12 },
          { date: '2024-01-03', incidents: 8, resolved: 10 },
          { date: '2024-01-04', incidents: 18, resolved: 15 },
          { date: '2024-01-05', incidents: 22, resolved: 18 },
          { date: '2024-01-06', incidents: 14, resolved: 16 },
          { date: '2024-01-07', incidents: 19, resolved: 14 }
        ]
      });
      setLoading(false);
    }, 300);
  }, []);

  return { dashboard, loading };
}