import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTMGjYkoraNTcr_MajS83QV6EjR3on8KY",
  authDomain: "readytogo-e7bde.firebaseapp.com",
  projectId: "readytogo-e7bde",
  storageBucket: "readytogo-e7bde.firebasestorage.app",
  messagingSenderId: "960914370023",
  appId: "1:960914370023:web:0f79185253812998826142",
  measurementId: "G-KXCS8374NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize messaging
const messaging = getMessaging(app);

// Function to get the FCM token
export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BMxFBwOZK7cUSehtq1ROBOJ5qS_6cmIieJ2GvfjHNdZLJ5F_J22VtE8WFZiK4bTuqE2CKYSoZZftJSR5fhMJTXs',
        serviceWorkerRegistration: await navigator.serviceWorker.register('../../firebase-messaging-sw.js')
      });
      return token;
    } else {
      throw new Error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};
