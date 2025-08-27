/**
 * User entity representing a system user with role-based permissions
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full name of the user */
  name: string;
  /** Email address used for authentication and notifications */
  email: string;
  /** Role determining access level and permissions */
  role: 'employee' | 'admin' | 'it' | 'hr' | 'security';
  /** Department or organizational unit */
  department: string;
  /** Optional avatar image URL */
  avatar?: string;
  /** Timestamp when user account was created */
  createdAt: Date;
}

/**
 * Incident entity representing a reported issue or event
 */
export interface Incident {
  /** Unique identifier for the incident */
  id: string;
  /** Brief title summarizing the incident */
  title: string;
  /** Detailed description of the incident */
  description: string;
  /** Category classification for routing and handling */
  category: 'it' | 'hr' | 'security' | 'facilities' | 'other';
  /** Priority level affecting resolution urgency */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Current status in the incident lifecycle */
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  /** User who reported the incident */
  reportedBy: User;
  /** User assigned to handle the incident (optional) */
  assignedTo?: User;
  /** Timestamp when incident was created */
  createdAt: Date;
  /** Timestamp when incident was last modified */
  updatedAt: Date;
  /** Timestamp when incident was resolved (if applicable) */
  resolvedAt?: Date;
  /** Tags for categorization and searchability */
  tags: string[];
  /** File attachments supporting the incident */
  attachments: string[];
  /** Comments and updates on the incident */
  comments: Comment[];
  /** Physical location where incident occurred (optional) */
  location?: string;
  /** Estimated time for resolution (optional) */
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