export const APP_CONFIG = {
  name: 'Watcher',
  description: 'Incident Reporting System',
  version: '1.0.0',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  INCIDENTS: '/incidents',
  REPORT: '/report',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  ADMIN: '/admin',
} as const;

export const INCIDENT_CATEGORIES = [
  { value: 'it', label: 'Information Technology', icon: '💻' },
  { value: 'hr', label: 'Human Resources', icon: '👥' },
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'facilities', label: 'Facilities', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '📋' }
] as const;

export const INCIDENT_PRIORITIES = [
  { value: 'low', label: 'Low', description: 'Minor issues that can wait' },
  { value: 'medium', label: 'Medium', description: 'Standard priority issues' },
  { value: 'high', label: 'High', description: 'Important issues requiring attention' },
  { value: 'critical', label: 'Critical', description: 'Urgent issues requiring immediate attention' }
] as const;

export const INCIDENT_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
] as const;

export const PRIORITY_COLORS = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  critical: 'text-red-600 bg-red-50 border-red-200'
} as const;

export const STATUS_COLORS = {
  open: 'text-red-600 bg-red-50 border-red-200',
  in_progress: 'text-blue-600 bg-blue-50 border-blue-200',
  resolved: 'text-green-600 bg-green-50 border-green-200',
  closed: 'text-slate-600 bg-slate-50 border-slate-200'
} as const;

export const CATEGORY_COLORS = {
  it: 'text-blue-600 bg-blue-50',
  hr: 'text-purple-600 bg-purple-50',
  security: 'text-red-600 bg-red-50',
  facilities: 'text-green-600 bg-green-50',
  other: 'text-slate-600 bg-slate-50'
} as const;

export const DEMO_USERS = [
  { role: 'Admin', email: 'admin@company.com', password: 'password' },
  { role: 'Employee', email: 'employee@company.com', password: 'password' },
  { role: 'IT Support', email: 'it@company.com', password: 'password' }
] as const;

export const STORAGE_KEYS = {
  USER: 'watcher_user',
  THEME: 'watcher_theme',
} as const;
