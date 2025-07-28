import { useState, useEffect, useCallback, useMemo } from 'react';
import { Incident } from '../types';

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Server Downtime - Building A',
    description: 'Main server in Building A data center is experiencing intermittent connectivity issues affecting user access to internal applications.',
    category: 'it',
    priority: 'critical',
    status: 'in_progress',
    reportedBy: {
      id: '2',
      name: 'John Rodriguez',
      email: 'john.rodriguez@company.com',
      role: 'employee',
      department: 'Marketing',
      createdAt: new Date()
    },
    assignedTo: {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily.johnson@company.com',
      role: 'it',
      department: 'Information Technology',
      createdAt: new Date()
    },
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 1800000), // 30 min ago
    tags: ['server', 'network', 'urgent'],
    attachments: [],
    comments: [
      {
        id: '1',
        content: 'Initial investigation shows network switch issues. Working on resolution.',
        author: {
          id: '3',
          name: 'Emily Johnson',
          email: 'emily.johnson@company.com',
          role: 'it',
          department: 'Information Technology',
          createdAt: new Date()
        },
        createdAt: new Date(Date.now() - 1800000),
        isInternal: false
      }
    ],
    location: 'Building A - Server Room',
    estimatedResolution: new Date(Date.now() + 1800000) // 30 min from now
  },
  {
    id: '2',
    title: 'Workplace Harassment Complaint',
    description: 'Employee reporting inappropriate behavior from supervisor. Requires immediate HR attention and investigation.',
    category: 'hr',
    priority: 'high',
    status: 'open',
    reportedBy: {
      id: '4',
      name: 'Anonymous Employee',
      email: 'anonymous@company.com',
      role: 'employee',
      department: 'Sales',
      createdAt: new Date()
    },
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000),
    tags: ['confidential', 'hr', 'investigation'],
    attachments: ['complaint-form.pdf'],
    comments: [],
    location: 'Building B - 3rd Floor'
  },
  {
    id: '3',
    title: 'Security Badge Access Issue',
    description: 'Multiple employees unable to access secure areas with their ID badges. Badge reader system appears to be malfunctioning.',
    category: 'security',
    priority: 'medium',
    status: 'resolved',
    reportedBy: {
      id: '5',
      name: 'Mike Thompson',
      email: 'mike.thompson@company.com',
      role: 'employee',
      department: 'Operations',
      createdAt: new Date()
    },
    assignedTo: {
      id: '6',
      name: 'Alex Rivera',
      email: 'alex.rivera@company.com',
      role: 'security',
      department: 'Security',
      createdAt: new Date()
    },
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000),
    resolvedAt: new Date(Date.now() - 3600000),
    tags: ['badge', 'access', 'security'],
    attachments: [],
    comments: [
      {
        id: '2',
        content: 'Badge reader system has been reset and is now functioning normally.',
        author: {
          id: '6',
          name: 'Alex Rivera',
          email: 'alex.rivera@company.com',
          role: 'security',
          department: 'Security',
          createdAt: new Date()
        },
        createdAt: new Date(Date.now() - 3600000),
        isInternal: false
      }
    ],
    location: 'Building C - Main Entrance'
  },
  {
    id: '4',
    title: 'HVAC System Malfunction',
    description: 'Air conditioning system in conference room not working. Room temperature rising above comfortable levels for meetings.',
    category: 'facilities',
    priority: 'low',
    status: 'open',
    reportedBy: {
      id: '7',
      name: 'Lisa Park',
      email: 'lisa.park@company.com',
      role: 'employee',
      department: 'Human Resources',
      createdAt: new Date()
    },
    createdAt: new Date(Date.now() - 1800000), // 30 min ago
    updatedAt: new Date(Date.now() - 1800000),
    tags: ['hvac', 'comfort', 'facilities'],
    attachments: [],
    comments: [],
    location: 'Building A - Conference Room 201'
  }
];

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadIncidents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (isMounted) {
          setIncidents(mockIncidents);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load incidents');
          setLoading(false);
        }
      }
    };

    loadIncidents();

    return () => {
      isMounted = false;
    };
  }, []);

  const createIncident = useCallback(async (incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    try {
      const newIncident: Incident = {
        ...incidentData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: []
      };
      
      setIncidents(prev => [newIncident, ...prev]);
      return newIncident;
    } catch (err) {
      setError('Failed to create incident');
      throw err;
    }
  }, []);

  const updateIncident = useCallback(async (id: string, updates: Partial<Incident>) => {
    try {
      setIncidents(prev => prev.map(incident => 
        incident.id === id 
          ? { ...incident, ...updates, updatedAt: new Date() }
          : incident
      ));
    } catch (err) {
      setError('Failed to update incident');
      throw err;
    }
  }, []);

  const getIncidentById = useCallback((id: string) => {
    return incidents.find(incident => incident.id === id);
  }, [incidents]);

  // Memoized statistics
  const statistics = useMemo(() => ({
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    inProgress: incidents.filter(i => i.status === 'in_progress').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    critical: incidents.filter(i => i.priority === 'critical').length,
    high: incidents.filter(i => i.priority === 'high').length,
  }), [incidents]);

  return {
    incidents,
    loading,
    error,
    statistics,
    createIncident,
    updateIncident,
    getIncidentById
  };
}