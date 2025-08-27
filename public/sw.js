const CACHE_NAME = 'watcher-incident-system-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// API cache configuration
const API_CACHE_NAME = 'watcher-api-cache-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (request.url.includes('/api/')) {
    // API requests - cache with TTL
    event.respondWith(handleApiRequest(request));
  } else if (request.url.includes('.js') || request.url.includes('.css') || request.url.includes('.png') || request.url.includes('.ico')) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(request));
  } else {
    // HTML requests - network first
    event.respondWith(handlePageRequest(request));
  }
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      
      // Add timestamp for TTL
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers.entries()),
          'sw-cache-timestamp': Date.now().toString()
        }
      });
      
      await cache.put(request, responseWithTimestamp);
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
      const now = Date.now();
      
      // Check if cache is still valid
      if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < API_CACHE_DURATION) {
        return cachedResponse;
      } else {
        // Cache expired, delete it
        await cache.delete(request);
      }
    }
    
    // Return offline fallback or original error
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'Unable to fetch data. Please check your connection.' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first for static assets
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    
    // Return a fallback for critical assets
    if (request.url.includes('.css')) {
      return new Response('/* Offline fallback styles */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    throw error;
  }
}

async function handlePageRequest(request) {
  try {
    // Network first for pages
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for page:', request.url);
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback page
    const fallbackResponse = await cache.match('/');
    return fallbackResponse || new Response('Offline - Please check your connection', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle background sync for offline incident reporting
self.addEventListener('sync', (event) => {
  if (event.tag === 'incident-sync') {
    console.log('[SW] Background sync triggered for incidents');
    event.waitUntil(syncIncidents());
  }
});

async function syncIncidents() {
  try {
    // Get pending incidents from IndexedDB or localStorage
    const pendingIncidents = await getPendingIncidents();
    
    for (const incident of pendingIncidents) {
      try {
        const response = await fetch('/api/incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incident)
        });
        
        if (response.ok) {
          await removePendingIncident(incident.id);
          console.log('[SW] Synced incident:', incident.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync incident:', incident.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// Mock functions for pending incidents management
async function getPendingIncidents() {
  // In a real app, this would read from IndexedDB
  return [];
}

async function removePendingIncident(id) {
  // In a real app, this would remove from IndexedDB
  console.log('[SW] Removing synced incident:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: 'You have new incident updates',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'incident-notification',
    data: event.data ? event.data.json() : {},
    actions: [
      {
        action: 'view',
        title: 'View Incidents',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.body = payload.message || options.body;
    options.data = payload;
  }
  
  event.waitUntil(
    self.registration.showNotification('Watcher - Incident Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/incidents')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default click - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker script loaded');
