// background-message-handler.js
import messaging from '@react-native-firebase/messaging';

// ✅ معالجة الإشعارات عندما يكون التطبيق في الخلفية أو مغلق
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('📱 Background FCM message:', remoteMessage);
  
  // الإشعار هيظهر تلقائياً في الـ Notification Center
  // لأن الباك إند هو اللي بيبعت الإشعار عبر FCM
  
  return Promise.resolve();
});