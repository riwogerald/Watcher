import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { useAuth } from '../../utils/authUtils';
import { useToast } from '../../utils/toastUtils';
import { formatDistanceToNow } from 'date-fns';
import { Incident } from '../../types';

interface StatusUpdate {
  id: string;
  incidentId: string;
  incidentTitle: string;
  oldStatus: string;
  newStatus: string;
  updatedBy: string;
  timestamp: Date;
}

const statusConfig = {
  open: { 
    color: 'text-red-600 bg-red-50 border-red-200', 
    icon: AlertTriangle,
    label: 'Open'
  },
  in_progress: { 
    color: 'text-blue-600 bg-blue-50 border-blue-200', 
    icon: Clock,
    label: 'In Progress'
  },
  resolved: { 
    color: 'text-green-600 bg-green-50 border-green-200', 
    icon: CheckCircle,
    label: 'Resolved'
  },
  closed: { 
    color: 'text-slate-600 bg-slate-50 border-slate-200', 
    icon: CheckCircle,
    label: 'Closed'
  }
};

export function LiveStatusTracker() {
  const { incidents, updateIncident } = useIncidents();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [recentUpdates, setRecentUpdates] = useState<StatusUpdate[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (incidents && incidents.length > 0 && Math.random() < 0.3) {
        const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];
        const statuses = ['open', 'in_progress', 'resolved', 'closed'];
        const currentStatusIndex = statuses.indexOf(randomIncident.status);
        const nextStatus = statuses[Math.min(currentStatusIndex + 1, statuses.length - 1)];
        
        if (nextStatus !== randomIncident.status) {
          const update: StatusUpdate = {
            id: Date.now().toString(),
            incidentId: randomIncident.id,
            incidentTitle: randomIncident.title,
            oldStatus: randomIncident.status,
            newStatus: nextStatus,
            updatedBy: user?.name || 'System',
            timestamp: new Date()
          };
          
          setRecentUpdates(prev => [update, ...prev.slice(0, 9)]);
          
          // Update the incident
          updateIncident(randomIncident.id, { 
            status: nextStatus as any,
            updatedAt: new Date()
          });
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [incidents, user, updateIncident]);

  const handleQuickStatusChange = async (incident: Incident, newStatus: string) => {
    try {
      await updateIncident(incident.id, { 
        status: newStatus as any,
        updatedAt: new Date()
      });
      
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Incident "${incident.title}" marked as ${newStatus.replace('_', ' ')}`
      });

      // Add to recent updates
      const update: StatusUpdate = {
        id: Date.now().toString(),
        incidentId: incident.id,
        incidentTitle: incident.title,
        oldStatus: incident.status,
        newStatus,
        updatedBy: user?.name || 'You',
        timestamp: new Date()
      };
      
      setRecentUpdates(prev => [update, ...prev.slice(0, 9)]);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update incident status'
      });
    }
  };

  const activeIncidents = incidents?.filter(i => i.status !== 'closed' && i.status !== 'resolved') || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Live Status Tracker</h3>
              <p className="text-sm text-slate-600">Real-time incident updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-600">Live</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions for Active Incidents */}
      <div className="p-6 border-b border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Quick Status Updates ({activeIncidents.length} active)
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activeIncidents.slice(0, 5).map((incident) => {
            const StatusIcon = statusConfig[incident.status].icon;
            return (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <StatusIcon className="w-4 h-4 text-slate-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {incident.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      #{incident.id.slice(0, 8)} • {formatDistanceToNow(incident.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {incident.status === 'open' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickStatusChange(incident, 'in_progress')}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Start
                    </motion.button>
                  )}
                  {incident.status === 'in_progress' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickStatusChange(incident, 'resolved')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                      Resolve
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Updates */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-200"
          >
            <div className="p-6">
              <h4 className="text-sm font-medium text-slate-700 mb-4">Recent Status Changes</h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentUpdates.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No recent updates</p>
                  </div>
                ) : (
                  recentUpdates.map((update, index) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">
                          <span className="font-medium">{update.updatedBy}</span> changed{' '}
                          <span className="font-medium truncate">{update.incidentTitle}</span>
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            statusConfig[update.oldStatus as keyof typeof statusConfig]?.color || 'text-slate-600 bg-slate-50 border-slate-200'
                          }`}>
                            {statusConfig[update.oldStatus as keyof typeof statusConfig]?.label || update.oldStatus}
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            statusConfig[update.newStatus as keyof typeof statusConfig]?.color || 'text-slate-600 bg-slate-50 border-slate-200'
                          }`}>
                            {statusConfig[update.newStatus as keyof typeof statusConfig]?.label || update.newStatus}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}