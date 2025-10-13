export async function requestPermissions() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("تنبيه", "يجب منح إذن الإشعارات لتفعيل التنبيهات");
        return false;
      }
    }
    return true;
  } else {
    Alert.alert("تنبيه", "شغل التطبيق على هاتف حقيقي لتفعيل الإشعارات");
    return false;
  }
}
if (Platform.OS === "android") {
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}
