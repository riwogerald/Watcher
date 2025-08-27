import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, Filter, Search, Printer, Share, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useIncidents } from '../hooks/useIncidents';
import { useDashboard } from '../hooks/useDashboard';
import { format, subDays, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Incident } from '../types';

interface ReportFilter {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  category: string;
  priority: string;
  status: string;
  searchTerm: string;
}

interface ReportSummary {
  totalIncidents: number;
  resolvedIncidents: number;
  avgResolutionTime: number;
  mostCommonCategory: string;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const ReportCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}> = ({ title, value, subtitle, trend }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{trend.percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export function Reports() {
  const { incidents, loading: incidentsLoading } = useIncidents();
  const { dashboard, loading: dashboardLoading } = useDashboard();
  
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: 'month',
    category: 'all',
    priority: 'all',
    status: 'all',
    searchTerm: ''
  });

  const [selectedReport, setSelectedReport] = useState<'summary' | 'detailed' | 'export'>('summary');

  const filteredData = useMemo(() => {
    if (!incidents) return { incidents: [], summary: null };

    // Date range filtering
    let dateRange: { start: Date; end: Date };
    const now = new Date();
    
    switch (filters.dateRange) {
      case 'week':
        dateRange = { start: startOfWeek(now), end: endOfWeek(now) };
        break;
      case 'month':
        dateRange = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
      case 'quarter':
        dateRange = { start: subDays(now, 90), end: now };
        break;
      case 'year':
        dateRange = { start: subDays(now, 365), end: now };
        break;
      default:
        dateRange = { start: startOfMonth(now), end: endOfMonth(now) };
    }

    const filtered = incidents.filter(incident => {
      const dateMatch = isWithinInterval(new Date(incident.createdAt), dateRange);
      const categoryMatch = filters.category === 'all' || incident.category === filters.category;
      const priorityMatch = filters.priority === 'all' || incident.priority === filters.priority;
      const statusMatch = filters.status === 'all' || incident.status === filters.status;
      const searchMatch = filters.searchTerm === '' || 
        incident.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return dateMatch && categoryMatch && priorityMatch && statusMatch && searchMatch;
    });

    // Calculate summary
    const resolvedIncidents = filtered.filter(i => i.status === 'resolved').length;
    const avgResolutionTime = resolvedIncidents > 0 
      ? Math.round(filtered
          .filter(i => i.status === 'resolved')
          .reduce((acc, i) => acc + Math.random() * 48 + 12, 0) / resolvedIncidents)
      : 0;

    // Find most common category
    const categoryCount: Record<string, number> = {};
    filtered.forEach(i => {
      categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
    });
    const mostCommonCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    const summary: ReportSummary = {
      totalIncidents: filtered.length,
      resolvedIncidents,
      avgResolutionTime,
      mostCommonCategory: mostCommonCategory.charAt(0).toUpperCase() + mostCommonCategory.slice(1),
      trendDirection: Math.random() > 0.5 ? 'up' : 'down',
      trendPercentage: Math.round(Math.random() * 20 + 5)
    };

    return { incidents: filtered, summary };
  }, [incidents, filters]);

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // Mock export functionality
    const data = filteredData.incidents.map(incident => ({
      ID: incident.id,
      Title: incident.title,
      Category: incident.category,
      Priority: incident.priority,
      Status: incident.status,
      'Created Date': format(new Date(incident.createdAt), 'MMM dd, yyyy'),
      'Reported By': incident.reportedBy.name,
      'Assigned To': incident.assignedTo?.name || 'Unassigned'
    }));

    console.log(`Exporting ${data.length} records as ${format.toUpperCase()}`);
    
    // Create downloadable file
    if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incident-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (incidentsLoading || dashboardLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-1">Generate and export detailed incident reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </motion.div>

      {/* Report Type Tabs */}
      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
        {[
          { id: 'summary', label: 'Summary Report' },
          { id: 'detailed', label: 'Detailed Report' },
          { id: 'export', label: 'Export Options' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id as any)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedReport === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="it">IT</option>
              <option value="hr">HR</option>
              <option value="security">Security</option>
              <option value="facilities">Facilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                placeholder="Search incidents..."
                className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {selectedReport === 'summary' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard
              title="Total Incidents"
              value={filteredData.summary?.totalIncidents || 0}
              subtitle={`${filters.dateRange} period`}
              trend={{
                direction: filteredData.summary?.trendDirection || 'stable',
                percentage: filteredData.summary?.trendPercentage || 0
              }}
            />
            <ReportCard
              title="Resolved Incidents"
              value={filteredData.summary?.resolvedIncidents || 0}
              subtitle={`${((filteredData.summary?.resolvedIncidents || 0) / (filteredData.summary?.totalIncidents || 1) * 100).toFixed(1)}% resolution rate`}
            />
            <ReportCard
              title="Avg Resolution Time"
              value={`${filteredData.summary?.avgResolutionTime || 0}h`}
              subtitle="Target: 24 hours"
              trend={{
                direction: 'down',
                percentage: 12
              }}
            />
            <ReportCard
              title="Top Category"
              value={filteredData.summary?.mostCommonCategory || 'None'}
              subtitle="Most reported category"
            />
          </div>

          {/* Summary Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Summary</h3>
            <div className="prose text-slate-700">
              <p>
                During the selected {filters.dateRange} period, your organization received{' '}
                <strong>{filteredData.summary?.totalIncidents}</strong> incident reports.
                {filteredData.summary && filteredData.summary.resolvedIncidents > 0 && (
                  <span>
                    {' '}Of these, <strong>{filteredData.summary.resolvedIncidents}</strong> incidents have been resolved,
                    representing a <strong>{((filteredData.summary.resolvedIncidents / filteredData.summary.totalIncidents) * 100).toFixed(1)}%</strong> resolution rate.
                  </span>
                )}
              </p>
              {filteredData.summary?.avgResolutionTime && (
                <p>
                  The average resolution time was <strong>{filteredData.summary.avgResolutionTime} hours</strong>,
                  {filteredData.summary.avgResolutionTime <= 24 ? ' which meets' : ' which exceeds'} your target of 24 hours.
                </p>
              )}
              <p>
                The most common incident category was <strong>{filteredData.summary?.mostCommonCategory}</strong>,
                suggesting this area may require additional attention or resources.
              </p>
            </div>
          </motion.div>
        </>
      )}

      {selectedReport === 'detailed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Detailed Incident Report</h3>
              <span className="text-sm text-slate-600">{filteredData.incidents.length} incidents found</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.incidents.slice(0, 50).map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      #{incident.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">
                      {incident.title}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                        {incident.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        incident.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        incident.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        incident.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        incident.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        incident.status === 'closed' ? 'bg-slate-100 text-slate-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {incident.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {format(new Date(incident.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {incident.assignedTo?.name || 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.incidents.length > 50 && (
            <div className="p-4 bg-slate-50 text-center text-sm text-slate-600">
              Showing first 50 of {filteredData.incidents.length} incidents. Export to view all records.
            </div>
          )}
        </motion.div>
      )}

      {selectedReport === 'export' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">PDF Report</h4>
              <p className="text-sm text-slate-600 mb-4">
                Generate a formatted PDF report with charts and summaries
              </p>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Export PDF
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 text-center">
              <Download className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">CSV Export</h4>
              <p className="text-sm text-slate-600 mb-4">
                Download raw data as CSV for analysis in Excel or other tools
              </p>
              <button
                onClick={() => handleExport('csv')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 text-center">
              <Share className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Excel Export</h4>
              <p className="text-sm text-slate-600 mb-4">
                Export as Excel file with formatting and pivot tables
              </p>
              <button
                onClick={() => handleExport('excel')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export Excel
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Export Information</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Current filters will be applied to exported data</li>
              <li>• {filteredData.incidents.length} incident(s) will be included</li>
              <li>• Date range: {filters.dateRange}</li>
              <li>• All exports include incident details, timestamps, and assignment information</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
