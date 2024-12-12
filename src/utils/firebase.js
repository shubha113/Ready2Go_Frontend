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
export const messaging = getMessaging(app);

// Function to get the FCM token
export const getFCMToken = async () => {
  try {
    // Ensure HTTPS
    if (window.location.protocol !== 'https:') {
      console.error('Notifications require HTTPS');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Use absolute path
      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: './' }
      );
      
      console.log('Service Worker Registered:', serviceWorkerRegistration);

      const token = await getToken(messaging, {
        vapidKey: 'BMxFBwOZK7cUSehtq1ROBOJ5qS_6cmIieJ2GvfjHNdZLJ5F_J22VtE8WFZiK4bTuqE2CKYSoZZftJSR5fhMJTXs',
        serviceWorkerRegistration: serviceWorkerRegistration
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.error('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Detailed FCM Token Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return null;
  }
};