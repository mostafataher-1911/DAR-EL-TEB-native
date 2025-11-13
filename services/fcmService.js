// services/fcmService.js
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fcmService = {
  // ✅ جلب التوكن وإرساله للباك إند
  setupFCM: async (userToken) => {
    try {
      // طلب الصلاحيات
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

      if (enabled) {
        // جلب التوكن
        const fcmToken = await messaging().getToken();
        console.log('📱 FCM Token:', fcmToken);
        
        // إرسال التوكن للباك إند
        await fetch("https://apilab.runasp.net/WeatherForecast/ExpoPush", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ fcmToken })
        });
        
        return fcmToken;
      }
    } catch (error) {
      console.log('❌ FCM Setup Error:', error);
    }
  }
};