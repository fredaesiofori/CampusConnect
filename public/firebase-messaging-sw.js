/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

const urlParams = new URLSearchParams(self.location.search);
const configFromQuery = {
  apiKey: urlParams.get('apiKey') || '',
  authDomain: urlParams.get('authDomain') || '',
  projectId: urlParams.get('projectId') || '',
  messagingSenderId: urlParams.get('messagingSenderId') || '',
  appId: urlParams.get('appId') || '',
};

if (configFromQuery.apiKey && configFromQuery.projectId && configFromQuery.messagingSenderId) {
  firebase.initializeApp(configFromQuery);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload?.notification?.title || 'Campus Connect Update';
    const notificationOptions = {
      body: payload?.notification?.body || 'Check your Campus Connect student portal for verified details.',
      icon: '/images/african_student_scholar.jpg',
      data: payload?.data || {},
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/';
  event.waitUntil(clients.openWindow(targetUrl));
});
