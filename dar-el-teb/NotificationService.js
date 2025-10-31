import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function useRegisterPushToken() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    // ✅ استقبال الإشعارات داخل التطبيق
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // console.log("📩 Notification Received:", notification);
    });

    // ✅ لو عايز تتعامل مع الضغط على الإشعار (فتح صفحة معينة مثلاً)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log("🟢 Notification clicked:", response);
    });

    return () => {
      subscription.remove();
      responseListener.remove();
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert("❌ يجب التجربة على جهاز فعلي (وليس محاكي)");
      return;
    }

    // 🟡 طلب صلاحيات الإشعارات
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("🚫 Permission not granted for notifications!");
      return;
    }

    // 🟢 الحصول على Expo Push Token (مع projectId)
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "b1f6acf7-dd88-4640-8271-f1028090b7c0",
      })
    ).data;

    // console.log("✅ Expo Push Token:", token);

    // ✅ إرسال التوكن للسيرفر
    try {
      const response = await fetch("https://apilab.runasp.net/WeatherForecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      console.log("📡 Server response:", await response.text());
    } catch (error) {
      console.log("❌ Error sending token:", error);
    }

    // 🔵 إعداد قناة الإشعارات للأندرويد فقط
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // 🟢 إعداد السلوك الافتراضي لـ iOS
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
}
