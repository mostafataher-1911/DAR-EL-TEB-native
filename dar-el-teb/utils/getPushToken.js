import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';

export async function getPushToken() {
  if (!Device.isDevice) {
    Alert.alert("تنبيه", "يجب تشغيل التطبيق على جهاز حقيقي لتفعيل الإشعارات");
    return null;
  }

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

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra?.eas?.projectId,
  })).data;

  console.log("📱 Expo Push Token:", token);
  return token;
}
