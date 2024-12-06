
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBTMGjYkoraNTcr_MajS83QV6EjR3on8KY",
    authDomain: "readytogo-e7bde.firebaseapp.com",
    projectId: "readytogo-e7bde",
    storageBucket: "readytogo-e7bde.firebasestorage.app",
    messagingSenderId: "960914370023",
    appId: "1:960914370023:web:0f79185253812998826142",
    measurementId: "G-KXCS8374NK"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) =>{
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
})