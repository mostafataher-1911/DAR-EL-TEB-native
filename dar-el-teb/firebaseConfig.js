import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function getFcmToken() {
  try {
    let token;

    if (Device.isDevice) {
      // 🔹 طلب إذن الإشعارات من المستخدم
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("تنبيه", "يجب منح إذن الإشعارات لتفعيل التنبيهات");
        return null;
      }

      // 🔹 الحصول على Expo FCM Token
      const projectId =
        Constants.expoConfig.extra?.eas?.projectId ||
        Constants.easConfig?.projectId;

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("📱 FCM Token:", token);
    } else {
      Alert.alert("تنبيه", "يجب تشغيل التطبيق على هاتف حقيقي لتفعيل الإشعارات");
    }

    // 🔹 إعداد قناة الإشعارات لأندرويد
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token; // ✅ رجّع التوكن
  } catch (error) {
    console.error("❌ خطأ أثناء جلب التوكن:", error);
    return null;
  }
}

