
import { useEffect, useState } from "react";
import { I18nManager, Platform, AppState } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// الشاشات
import SplashScreen from "./SplashScreen";
import LoginScreen from "./login";
import TabsScreen from "./(tabs)/_layout";
import ModalScreen from "./modal";
import UnionDetailsScreen from "./unionDetails";

// Hooks
import { useColorScheme } from "@/hooks/use-color-scheme";

const Stack = createNativeStackNavigator();

// ✅ إعداد معالج الخلفية مباشرة في الملف
messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('📱 Background FCM message:', remoteMessage);
  return Promise.resolve();
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [rtlReady, setRtlReady] = useState(false);

  // ✅ إعداد إشعارات FCM محسن للإنتاج
  useEffect(() => {
    const setupFCM = async () => {
      try {
        // طلب الصلاحيات
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        console.log('🔔 Notification permission:', enabled ? 'GRANTED' : 'DENIED');

        if (enabled) {
          // جلب التوكن
          const fcmToken = await messaging().getToken();
          console.log('📱 FCM Token:', fcmToken);
          
          // حفظ التوكن
          await AsyncStorage.setItem('fcmToken', fcmToken);
          
          // إرسال التوكن للسيرفر
          await sendTokenToServer(fcmToken);
        }
      } catch (error) {
        console.log('❌ FCM Setup Error:', error);
      }
    };

    setupFCM();

    // ✅ 1. الاستماع للإشعارات في الواجهة الأمامية
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('📩 Foreground FCM message:', remoteMessage);
      
      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title ?? "تنبيه",
        text2: remoteMessage.notification?.body ?? "لديك إشعار جديد",
        position: 'top',
        visibilityTime: 5000,
      });
    });

    // ✅ 2. عندما يضغط المستخدم على الإشعار (التطبيق في الخلفية)
    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('🔔 Notification opened app (background):', remoteMessage);
      handleNotificationPress(remoteMessage);
    });

    // ✅ 3. عندما يفتح التطبيق من إشعار (التطبيق مغلق)
    messaging()
      .getInitialNotification()
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (remoteMessage) {
          console.log('📩 App opened from notification (killed):', remoteMessage);
          handleNotificationPress(remoteMessage);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);

  // ✅ معالجة الضغط على الإشعار
  const handleNotificationPress = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('📍 Notification pressed:', remoteMessage);
    
    Toast.show({
      type: 'success',
      text1: 'تم فتح الإشعار',
      text2: 'جاري التوجيه...',
      position: 'top',
      visibilityTime: 3000,
    });
  };

  // ✅ إرسال التوكن للسيرفر
  const sendTokenToServer = async (token: string) => {
    try {
      const response = await fetch("https://apilab.runasp.net/WeatherForecast/ExpoPush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          platform: Platform.OS,
          appVersion: "1.0.1"
        }),
      });

      if (response.ok) {
        console.log('✅ FCM token sent to server successfully');
      } else {
        console.log('⚠️ Failed to send FCM token to server');
      }
    } catch (error) {
      console.log('❌ Error sending FCM token:', error);
    }
  };

  // RTL Setup
  useEffect(() => {
    const setupRTL = async () => {
      const shouldBeRTL = false;
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setRtlReady(true);
    };
    setupRTL();
  }, []);

  if (!rtlReady) return <SplashScreen />;

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
      
      <Toast />
    </ThemeProvider>
  );
}