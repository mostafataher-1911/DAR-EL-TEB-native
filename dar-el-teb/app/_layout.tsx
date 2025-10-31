
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
  const [rtlReady, setRtlReady] = useState(false);

  useRegisterPushToken();

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

  // إعداد RTL الصحيح من أول مرة بدون كراش أو تصميم مكسور
  useEffect(() => {
    const setupRTL = async () => {
      const shouldBeRTL = false; // خليه false دايمًا لو عايز اتجاه ثابت LTR
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setRtlReady(true);
    };
    setupRTL();
  }, []);

  if (!rtlReady) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="TabsScreen" component={TabsScreen} />
        <Stack.Screen
          name="ModalScreen"
          component={ModalScreen}
          options={{ presentation: "modal", headerShown: true }}
        />
        <Stack.Screen name="UnionDetails" component={UnionDetailsScreen} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
