import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'incident_created',
      title: 'New Incident Reported',
      message: 'Server downtime reported in Building A',
      incidentId: '1',
      createdAt: new Date(Date.now() - 30000),
      read: false
    },
    {
      id: '2',
      type: 'incident_assigned',
      title: 'Incident Assigned',
      message: 'You have been assigned to incident #2024-001',
      incidentId: '2',
      createdAt: new Date(Date.now() - 120000),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const types = ['incident_created', 'incident_updated', 'incident_resolved'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        addNotification({
          type,
          title: type === 'incident_created' ? 'New Incident' : 
                type === 'incident_updated' ? 'Incident Updated' : 'Incident Resolved',
          message: `Incident #${Math.floor(Math.random() * 1000)} has been ${type.split('_')[1]}`,
          incidentId: Math.floor(Math.random() * 100).toString()
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}