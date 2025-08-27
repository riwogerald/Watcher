import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Incident, Dashboard, User } from '../types';

// Query keys for better cache management
export const QUERY_KEYS = {
  incidents: 'incidents',
  dashboard: 'dashboard',
  user: 'user',
  incidentById: (id: string) => ['incident', id],
} as const;

// Mock API functions (replace with real API calls)
const mockApi = {
  async getIncidents(): Promise<Incident[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data (in real app, this would be an API call)
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
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 1800000),
        tags: ['server', 'network', 'urgent'],
        attachments: [],
        comments: [],
        location: 'Building A - Server Room',
        estimatedResolution: new Date(Date.now() + 1800000)
      }
    ];
    
    return mockIncidents;
  },

  async getDashboard(): Promise<Dashboard> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalIncidents: 156,
      openIncidents: 23,
      resolvedToday: 8,
      avgResolutionTime: 4.2,
      incidentsByCategory: {
        it: 45,
        hr: 28,
        security: 32,
        facilities: 35,
        other: 16
      },
      incidentsByPriority: {
        low: 42,
        medium: 68,
        high: 35,
        critical: 11
      },
      recentIncidents: [],
      trend: [
        { date: '2024-01-01', incidents: 12, resolved: 8 },
        { date: '2024-01-02', incidents: 15, resolved: 12 },
        { date: '2024-01-03', incidents: 8, resolved: 10 },
        { date: '2024-01-04', incidents: 18, resolved: 15 },
        { date: '2024-01-05', incidents: 22, resolved: 18 },
        { date: '2024-01-06', incidents: 14, resolved: 16 },
        { date: '2024-01-07', incidents: 19, resolved: 14 }
      ]
    };
  },

  async createIncident(incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Incident> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate potential error
    if (Math.random() < 0.1) {
      throw new Error('Failed to create incident. Please try again.');
    }
    
    const newIncident: Incident = {
      ...incidentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    
    return newIncident;
  },

  async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock updated incident
    const updatedIncident: Incident = {
      id,
      title: 'Updated Incident',
      description: 'Updated description',
      category: 'it',
      priority: 'medium',
      status: 'in_progress',
      reportedBy: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'employee',
        department: 'IT',
        createdAt: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      attachments: [],
      comments: [],
      ...updates
    };
    
    return updatedIncident;
  },

  async getIncidentById(id: string): Promise<Incident | undefined> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // This would normally fetch from API
    const incidents = await this.getIncidents();
    return incidents.find(incident => incident.id === id);
  }
};

// Custom hooks using React Query

/**
 * Hook to fetch and manage incidents data with React Query
 * @returns Query result containing incidents data, loading state, and error state
 */
export function useIncidents() {
  return useQuery({
    queryKey: [QUERY_KEYS.incidents],
    queryFn: mockApi.getIncidents,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch dashboard analytics and metrics
 * @returns Query result containing dashboard data with shorter cache time for real-time feel
 */
export function useDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.dashboard],
    queryFn: mockApi.getDashboard,
    staleTime: 1 * 60 * 1000, // 1 minute for dashboard data
  });
}

export function useIncidentById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.incidentById(id),
    queryFn: () => mockApi.getIncidentById(id),
    enabled: !!id, // Only run query if id exists
  });
}

/**
 * Mutation hook for creating new incidents with optimistic cache updates
 * @returns Mutation object with mutate function and status
 */
export function useCreateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockApi.createIncident,
    onSuccess: (newIncident) => {
      // Add the new incident to the cache
      queryClient.setQueryData([QUERY_KEYS.incidents], (oldData: Incident[] = []) => {
        return [newIncident, ...oldData];
      });
      
      // Invalidate dashboard to refresh stats
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard] });
    },
    onError: (error) => {
      console.error('Failed to create incident:', error);
    }
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Incident> }) => 
      mockApi.updateIncident(id, updates),
    onSuccess: (updatedIncident) => {
      // Update the incident in the incidents list cache
      queryClient.setQueryData([QUERY_KEYS.incidents], (oldData: Incident[] = []) => {
        return oldData.map(incident => 
          incident.id === updatedIncident.id ? updatedIncident : incident
        );
      });
      
      // Update the individual incident cache
      queryClient.setQueryData(
        QUERY_KEYS.incidentById(updatedIncident.id), 
        updatedIncident
      );
      
      // Invalidate dashboard to refresh stats
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard] });
    },
    onError: (error) => {
      console.error('Failed to update incident:', error);
    }
  });
}

// Hook for prefetching data (useful for performance)
export function usePrefetchIncident() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.incidentById(id),
      queryFn: () => mockApi.getIncidentById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

// Optimistic updates example
export function useOptimisticUpdateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Incident> }) => 
      mockApi.updateIncident(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.incidents] });
      
      // Snapshot the previous value
      const previousIncidents = queryClient.getQueryData<Incident[]>([QUERY_KEYS.incidents]);
      
      // Optimistically update to the new value
      queryClient.setQueryData<Incident[]>([QUERY_KEYS.incidents], (oldData = []) => {
        return oldData.map(incident => 
          incident.id === id 
            ? { ...incident, ...updates, updatedAt: new Date() }
            : incident
        );
      });
      
      // Return a context object with the snapshotted value
      return { previousIncidents };
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousIncidents) {
        queryClient.setQueryData([QUERY_KEYS.incidents], context.previousIncidents);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
    }
  });
}

// Background sync hook
export function useBackgroundSync() {
  const queryClient = useQueryClient();
  
  // Sync data in the background
  const syncData = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.incidents] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard] });
  };
  
  return { syncData };
}
