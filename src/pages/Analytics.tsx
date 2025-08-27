import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, AlertTriangle, Users, Clock, Target, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useDashboard, useIncidents } from '../hooks/queries';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { AnalyticsSEO } from '../components/SEO/SEOHead';

interface MetricCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const MetricCard: React.FC<MetricCard> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.type === 'increase' ? '+' : '-'}{change.value}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{title}</div>
    </motion.div>
  );
};

export function Analytics() {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: incidents, isLoading: incidentsLoading } = useIncidents();

  const analyticsData = useMemo(() => {
    if (!incidents || !dashboard) return null;

    // Calculate weekly performance
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const thisWeekIncidents = incidents.filter(incident => 
      isWithinInterval(new Date(incident.createdAt), { start: weekStart, end: weekEnd })
    );

    // Category performance data
    const categoryPerformance = Object.entries(dashboard.incidentsByCategory).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      total: count,
      resolved: incidents.filter(i => i.category === category && i.status === 'resolved').length,
      avgResolutionTime: Math.round(Math.random() * 48 + 12) // Mock data
    }));

    // Daily incident trend for the last 30 days
    const dailyTrend = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dayIncidents = Math.floor(Math.random() * 15) + 2;
      const dayResolved = Math.floor(dayIncidents * 0.8);
      
      return {
        date: format(date, 'MMM dd'),
        incidents: dayIncidents,
        resolved: dayResolved,
        pending: dayIncidents - dayResolved
      };
    });

    // Priority distribution data for pie chart
    const priorityData = Object.entries(dashboard.incidentsByPriority).map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      color: {
        low: '#10b981',
        medium: '#f59e0b', 
        high: '#f97316',
        critical: '#ef4444'
      }[priority] || '#64748b'
    }));

    // Resolution time trends
    const resolutionTrends = categoryPerformance.map(item => ({
      category: item.category,
      currentWeek: item.avgResolutionTime,
      lastWeek: item.avgResolutionTime + Math.floor(Math.random() * 10 - 5),
      target: 24
    }));

    return {
      thisWeekIncidents: thisWeekIncidents.length,
      weeklyGrowth: Math.round((thisWeekIncidents.length - 15) / 15 * 100),
      categoryPerformance,
      dailyTrend,
      priorityData,
      resolutionTrends,
      satisfactionScore: 4.2,
      responseTime: 1.8
    };
  }, [incidents, dashboard]);

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
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <>
      <AnalyticsSEO />
      <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">Comprehensive insights into incident patterns and performance metrics</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="This Week Incidents"
          value={analyticsData.thisWeekIncidents}
          change={{ value: Math.abs(analyticsData.weeklyGrowth), type: analyticsData.weeklyGrowth >= 0 ? 'increase' : 'decrease' }}
          icon={AlertTriangle}
          color="blue"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${analyticsData.responseTime}h`}
          change={{ value: 12, type: 'decrease' }}
          icon={Clock}
          color="green"
        />
        <MetricCard
          title="Resolution Rate"
          value="87%"
          change={{ value: 5, type: 'increase' }}
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="User Satisfaction"
          value={analyticsData.satisfactionScore.toFixed(1)}
          change={{ value: 3, type: 'increase' }}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">30-Day Incident Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.dailyTrend}>
              <defs>
                <linearGradient id="incidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#incidents)"
                strokeWidth={2}
                name="Total Incidents"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#resolved)"
                strokeWidth={2}
                name="Resolved"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center mb-6">
            <PieChartIcon className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Priority Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.priorityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {analyticsData.priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Category Performance</h3>
          <p className="text-slate-600 text-sm mt-1">Resolution metrics by incident category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resolved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resolution Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Time (hrs)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {analyticsData.categoryPerformance.map((item) => {
                const rate = (item.resolved / item.total * 100);
                return (
                  <tr key={item.category} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.resolved}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${rate >= 80 ? 'bg-green-500' : rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-900">{rate.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{item.avgResolutionTime}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Resolution Time Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-slate-900">Resolution Time Trends</h3>
          <span className="ml-auto text-sm text-slate-600">Target: 24 hours</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.resolutionTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="currentWeek" fill="#3b82f6" name="Current Week" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lastWeek" fill="#e2e8f0" name="Last Week" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#ef4444" name="Target (24h)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">Resolution Rate Improved</p>
                <p className="text-xs text-slate-600">87% of incidents resolved within SLA, up 5% from last month</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">Peak Hours Identified</p>
                <p className="text-xs text-slate-600">Most incidents occur between 2-4 PM, consider staffing adjustments</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">Category Trends</p>
                <p className="text-xs text-slate-600">IT incidents decreased 15%, security incidents stable</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900">Excellent Performance</h4>
              <p className="text-xs text-green-700 mt-1">IT and HR categories meeting all SLA targets</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900">Needs Attention</h4>
              <p className="text-xs text-yellow-700 mt-1">Security incidents taking 20% longer to resolve</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900">Opportunity</h4>
              <p className="text-xs text-blue-700 mt-1">Implement automated triage for facilities issues</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
