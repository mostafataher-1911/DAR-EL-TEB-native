// // NotificationService.js
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";
// import { useEffect } from "react";

// export default function useRegisterPushToken() {
//   useEffect(() => {
//     registerForPushNotificationsAsync();

//     const subscription = Notifications.addNotificationReceivedListener((notification) => {
//       console.log("📩 Notification received:", notification);
//     });

//     const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log("🔔 User interacted with notification:", response);
//     });

//     return () => {
//       subscription.remove();
//       responseListener.remove();
//     };
//   }, []);

//   async function registerForPushNotificationsAsync() {
//     if (!Device.isDevice) {
//       alert("❌ يجب التجربة على جهاز فعلي (وليس محاكي)");
//       return;
//     }

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       alert("🚫 Permission not granted for notifications!");
//       return;
//     }

//     // ✅ Expo Token
//     const token = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId: "b1f6acf7-dd88-4640-8271-f1028090b7c0"
//       })
//     ).data;

//     console.log("✅ Expo Push Token:", token);

//     // ✅ إعداد قناة للأندرويد
//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         sound: "default",
//       });
//     }

//     Notifications.setNotificationHandler({
//       handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//       }),
//     });

//     // (اختياري) إرسال التوكن للسيرفر بتاعك
//     try {
//       await fetch("https://apilab.runasp.net/WeatherForecast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token }),
//       });
//     } catch (error) {
//       console.log("❌ Error sending token:", error);
//     }
//   }
// }
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
