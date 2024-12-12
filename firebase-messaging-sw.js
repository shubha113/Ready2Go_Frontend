
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

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
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.notification?.icon || ''
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});