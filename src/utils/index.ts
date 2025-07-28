import { Incident, User } from '../types';

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format incident ID for display
 */
export function formatIncidentId(incident: Incident): string {
  const year = incident.createdAt.getFullYear();
  const id = incident.id.padStart(3, '0');
  return `#${year}-${id}`;
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User): string {
  return user.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calculate incident age in hours
 */
export function getIncidentAge(incident: Incident): number {
  const now = new Date();
  const created = new Date(incident.createdAt);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
}

/**
 * Check if incident is overdue (older than 24 hours for high/critical)
 */
export function isIncidentOverdue(incident: Incident): boolean {
  if (incident.status === 'resolved' || incident.status === 'closed') {
    return false;
  }
  
  const age = getIncidentAge(incident);
  const threshold = incident.priority === 'critical' ? 2 : 
                   incident.priority === 'high' ? 8 : 24;
  
  return age > threshold;
}

/**
 * Get priority weight for sorting
 */
export function getPriorityWeight(priority: string): number {
  const weights = { critical: 4, high: 3, medium: 2, low: 1 };
  return weights[priority as keyof typeof weights] || 0;
}

/**
 * Sort incidents by priority and age
 */
export function sortIncidentsByUrgency(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => {
    // First sort by priority
    const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by age (older first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format duration in human readable format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}
