
// import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { I18nManager, Platform } from "react-native";
// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";

// // ✅ استدعاء خدمة الإشعارات
// import useRegisterPushToken from "../NotificationService";

// // الشاشات
// import SplashScreen from "./SplashScreen";
// import LoginScreen from "./login";
// import TabsScreen from "./(tabs)/_layout";
// import ModalScreen from "./modal";
// import UnionDetailsScreen from "./unionDetails";

// const Stack = createNativeStackNavigator();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   I18nManager.allowRTL(false);
//   I18nManager.forceRTL(false);

//   // ✅ تفعيل الإشعارات
//   useRegisterPushToken();

//   useEffect(() => {
//     if (Platform.OS === "android") {
//       Notifications.setNotificationChannelAsync("default", {
//         name: "Default Channel",
//         importance: Notifications.AndroidImportance.HIGH,
//         sound: "default",
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//     }
//   }, []);

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <StatusBar style="auto" />

//       <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="SplashScreen" component={SplashScreen} />
//         <Stack.Screen name="LoginScreen" component={LoginScreen} />
//         <Stack.Screen name="TabsScreen" component={TabsScreen} />
//         <Stack.Screen name="ModalScreen" component={ModalScreen} options={{ presentation: "modal", headerShown: true }} />
//         <Stack.Screen name="UnionDetails" component={UnionDetailsScreen} />
//       </Stack.Navigator>
//     </ThemeProvider>
//   );
// }
import { useEffect, useState } from "react";
import { I18nManager, Platform } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

// الشاشات
import SplashScreen from "./SplashScreen";
import LoginScreen from "./login";
import TabsScreen from "./(tabs)/_layout";
import ModalScreen from "./modal";
import UnionDetailsScreen from "./unionDetails";

// Hooks
import { useColorScheme } from "@/hooks/use-color-scheme";
import useRegisterPushToken from "../NotificationService";

// Notifications
import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [rtlChecked, setRtlChecked] = useState(false);

  // تسجيل Push Token
  useRegisterPushToken();

  // إعداد الإشعارات (Android)
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }, []);

  // التحقق من RTL قبل أي رندر
  useEffect(() => {
    async function checkRTL() {
      if (I18nManager.isRTL) {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);

        // إعادة تشغيل التطبيق بعد تعديل Native RTL
        if (Platform.OS === "android") {
          const RNRestart = require("react-native-restart").default;
          RNRestart.Restart();
        } else {
          const Updates = await import("expo-updates");
          Updates.reloadAsync();
        }
      } else {
        // الاتجاه مضبوط، نسمح للرندر
        setRtlChecked(true);
      }
    }

    checkRTL();
  }, []);

  // لو RTL مش مضبوط بعد، نعرض Splash مؤقت
  if (!rtlChecked) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TabsScreen" component={TabsScreen} />
        <Stack.Screen name="ModalScreen" component={ModalScreen} options={{ presentation: "modal", headerShown: true }} />
        <Stack.Screen name="UnionDetails" component={UnionDetailsScreen} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
