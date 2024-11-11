// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js');

// Initialize Firebase app in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyBTMGjYkoraNTcr_MajS83QV6EjR3on8KY",
    authDomain: "readytogo-e7bde.firebaseapp.com",
    projectId: "readytogo-e7bde",
    storageBucket: "readytogo-e7bde.firebasestorage.app",
    messagingSenderId: "960914370023",
    appId: "1:960914370023:web:0f79185253812998826142",
    measurementId: "G-KXCS8374NK"
  };
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optional, specify a custom icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
