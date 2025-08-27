import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useDashboard, useIncidents } from '../hooks/queries';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { IncidentChart } from '../components/Dashboard/IncidentChart';
import { RecentIncidents } from '../components/Dashboard/RecentIncidents';
import { DashboardSEO } from '../components/SEO/SEOHead';

export const Dashboard = React.memo(() => {
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { data: incidents, isLoading: incidentsLoading, error: incidentsError } = useIncidents();

  // Memoize expensive computations
  const statsCards = useMemo(() => {
    if (!dashboard) return [];
    
    return [
      {
        title: "Total Incidents",
        value: dashboard.totalIncidents,
        change: { value: 12, type: 'increase' as const },
        icon: AlertTriangle,
        color: "blue" as const
      },
      {
        title: "Open Incidents",
        value: dashboard.openIncidents,
        change: { value: 8, type: 'decrease' as const },
        icon: Clock,
        color: "orange" as const
      },
      {
        title: "Resolved Today",
        value: dashboard.resolvedToday,
        change: { value: 15, type: 'increase' as const },
        icon: CheckCircle,
        color: "green" as const
      },
      {
        title: "Avg Resolution Time",
        value: `${dashboard.avgResolutionTime}h`,
        change: { value: 5, type: 'decrease' as const },
        icon: TrendingUp,
        color: "red" as const
      }
    ];
  }, [dashboard]);

  if (dashboardLoading || incidentsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-slate-200 rounded-xl"></div>
            <div className="h-80 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <>
      <DashboardSEO />
      <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Monitor and track incidents across your organization</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            change={card.change}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* Charts and Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentChart data={dashboard.trend} />
        <RecentIncidents incidents={incidents} />
      </div>

      {/* Category and Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Incidents by Category</h3>
          <div className="space-y-3">
            {Object.entries(dashboard.incidentsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 capitalize">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / dashboard.totalIncidents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Incidents by Priority</h3>
          <div className="space-y-3">
            {Object.entries(dashboard.incidentsByPriority).map(([priority, count]) => {
              const colors = {
                low: 'bg-green-500',
                medium: 'bg-yellow-500',
                high: 'bg-orange-500',
                critical: 'bg-red-500'
              };
              return (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">{priority}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${colors[priority as keyof typeof colors]} h-2 rounded-full`}
                        style={{ width: `${(count / dashboard.totalIncidents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
});
