import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { Incident } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface RecentIncidentsProps {
  incidents: Incident[];
}

const priorityColors = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-orange-600 bg-orange-50',
  critical: 'text-red-600 bg-red-50'
};

const statusColors = {
  open: 'text-red-600 bg-red-50',
  in_progress: 'text-blue-600 bg-blue-50',
  resolved: 'text-green-600 bg-green-50',
  closed: 'text-slate-600 bg-slate-50'
};

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Incidents</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentIncidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              incident.status === 'resolved' ? 'bg-green-50' : 'bg-orange-50'
            }`}>
              {incident.status === 'resolved' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {incident.title}
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  priorityColors[incident.priority]
                }`}>
                  {incident.priority}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[incident.status]
                }`}>
                  {incident.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="flex items-center mb-1">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(incident.createdAt, { addSuffix: true })}
              </div>
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {incident.reportedBy.name.split(' ')[0]}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}