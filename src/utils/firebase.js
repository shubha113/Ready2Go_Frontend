export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Register the service worker
      const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const token = await getToken(messaging, {
        vapidKey: 'BMxFBwOZK7cUSehtq1ROBOJ5qS_6cmIieJ2GvfjHNdZLJ5F_J22VtE8WFZiK4bTuqE2CKYSoZZftJSR5fhMJTXs',
        serviceWorkerRegistration: serviceWorkerRegistration
      });
      console.log(token)
      return token;
    } else {
      throw new Error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};