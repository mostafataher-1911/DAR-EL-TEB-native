
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";

export default function useFirebaseNotifications() {
  useEffect(() => {
    requestUserPermission();
    getFcmToken();
    listenForNotifications();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert("🚫 Notifications not allowed");
    }
  }
async function getFcmToken() {
  try {
    const token = await messaging().getToken();
    if (!token) {
      console.log("❌ No FCM token retrieved");
      return;
    }

    console.log("🔥 FCM Token:", token);

    // أرسل التوكن إلى السيرفر (.NET)
    await fetch("https://apilab.runasp.net/WeatherForecast/ExpoPush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.log("❌ Error getting FCM token:", error);
  }
}

  function listenForNotifications() {
    // لو التطبيق مفتوح
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
     Toast.show({
  type: "info",
  text1: remoteMessage.notification?.title,
  text2: remoteMessage.notification?.body,
});

    });

    // لما يضغط المستخدم على الإشعار
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("🔔 Notification caused app to open:", remoteMessage);
    });

    // لو التطبيق كان مقفول وفتح بسبب الإشعار
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("📩 Opened from quit state:", remoteMessage);
        }
      });

    return unsubscribe;
  }
}
