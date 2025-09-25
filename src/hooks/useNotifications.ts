import { useEffect, useCallback } from 'react';

export const useNotifications = () => {
  useEffect(() => {
    // Only attempt service worker registration in production environment
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost' && !window.location.hostname.includes('stackblitz')) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed (this is expected in development):', error);
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.log('Notification permission request failed:', error);
        return false;
      }
    }
    return false;
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Try service worker first (for production)
      if ('serviceWorker' in navigator && window.location.hostname !== 'localhost' && !window.location.hostname.includes('stackblitz')) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            requireInteraction: true,
            ...options
          }).catch(() => {
            // Fallback to regular notification
            new Notification(title, {
              icon: '/icon-192.png',
              ...options
            });
          });
        }).catch(() => {
          // Fallback to regular notification
          new Notification(title, {
            icon: '/icon-192.png',
            ...options
          });
        });
      } else {
        // Use regular notification API (for development)
        try {
          new Notification(title, {
            icon: '/icon-192.png',
            ...options
          });
        } catch (error) {
          console.log('Notification failed:', error);
        }
      }
    } else {
      // Visual fallback for browsers that don't support notifications
      console.log(`Notification: ${title}`, options?.body);
    }
  }, []);

  return { requestPermission, showNotification };
};
