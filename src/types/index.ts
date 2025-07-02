export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin' | 'it' | 'hr' | 'security';
  department: string;
  avatar?: string;
  createdAt: Date;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: 'it' | 'hr' | 'security' | 'facilities' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reportedBy: User;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  tags: string[];
  attachments: string[];
  comments: Comment[];
  location?: string;
  estimatedResolution?: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  isInternal: boolean;
}

export interface Notification {
  id: string;
  type: 'incident_created' | 'incident_updated' | 'incident_assigned' | 'incident_resolved';
  title: string;
  message: string;
  incidentId?: string;
  createdAt: Date;
  read: boolean;
}

export interface Dashboard {
  totalIncidents: number;
  openIncidents: number;
  resolvedToday: number;
  avgResolutionTime: number;
  incidentsByCategory: Record<string, number>;
  incidentsByPriority: Record<string, number>;
  recentIncidents: Incident[];
  trend: Array<{ date: string; incidents: number; resolved: number }>;
}