// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Image,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import messaging from "@react-native-firebase/messaging";
// import { useNavigation } from "@react-navigation/native";
// import { Platform } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const { width, height } = Dimensions.get("window");

// type RootStackParamList = {
//   SplashScreen: undefined;
//   LoginScreen: undefined;
//   TabsScreen: undefined;
// };

// type NavigationProps = NativeStackNavigationProp<
//   RootStackParamList,
//   "LoginScreen"
// >;

// export default function LoginScreen() {
//   const navigation = useNavigation<NavigationProps>();

//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ إعداد Firebase Cloud Messaging محسن للإنتاج
//   const registerForPushNotificationsAsync = async (): Promise<string> => {
//     try {
//       // طلب صلاحيات الإشعارات
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       console.log("🔔 Notification permission:", enabled ? "GRANTED" : "DENIED");

//       if (!enabled) {
//         console.log("🚫 Notification permission not granted");
//         return "fallback-token";
//       }

//       // جلب FCM Token
//       const fcmToken = await messaging().getToken();
//       console.log("📱 FCM Token:", fcmToken);
      
//       if (!fcmToken) {
//         console.log("⚠️ No FCM token received");
//         return "fallback-token";
//       }

//       // حفظ التوكن في AsyncStorage
//       await AsyncStorage.setItem('fcmToken', fcmToken);
      
//       // إرسال التوكن للسيرفر
//       await sendTokenToServer(fcmToken);
      
//       return fcmToken;
//     } catch (err) {
//       console.log("⚠️ Error getting FCM token:", err);
//       return "fallback-token";
//     }
//   };

//   // ✅ إرسال التوكن للسيرفر
//   const sendTokenToServer = async (token: string) => {
//     try {
//       const response = await fetch("https://apilab.runasp.net/WeatherForecast/ExpoPush", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token: token,
//           platform: Platform.OS,
//           appVersion: "1.0.1"
//         }),
//       });

//       if (response.ok) {
//         console.log('✅ FCM token sent to server successfully');
//       } else {
//         console.log('⚠️ Failed to send FCM token to server');
//       }
//     } catch (error) {
//       console.log('❌ Error sending FCM token:', error);
//     }
//   };

//   useEffect(() => {
//     // 📩 عندما يضغط المستخدم على إشعار
//     const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
//       console.log("🔔 Notification opened app:", remoteMessage);
//       if (remoteMessage?.data?.screen) {
//         navigation.replace("TabsScreen");
//       }
//     });

//     // 📦 عندما يفتح التطبيق من إشعار
//     messaging()
//       .getInitialNotification()
//       .then((remoteMessage) => {
//         if (remoteMessage) {
//           console.log("📩 App opened from notification:", remoteMessage);
//           if (remoteMessage?.data?.screen) {
//             navigation.replace("TabsScreen");
//           }
//         }
//       });

//     // 📨 استقبال الإشعارات أثناء فتح التطبيق
//     const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
//       console.log("📨 Notification received in foreground:", remoteMessage);
//       // يمكنك إضافة Toast هنا إذا أردت
//     });

//     return () => {
//       unsubscribeOnNotificationOpened();
//       unsubscribeOnMessage();
//     };
//   }, [navigation]);

//   // 🧩 تحويل الأرقام العربية إلى إنجليزية
//   const convertArabicToEnglishNumbers = (input: string) => {
//     return input.replace(/[\u0660-\u0669]/g, (d) => {
//       return String(d.charCodeAt(0) - 1632);
//     });
//   };

//   // ✅ تسجيل الدخول
//   const handleLogin = async () => {
//     setError("");
//     const normalizedPhone = convertArabicToEnglishNumbers(phone);

//     if (normalizedPhone.length !== 10) {
//       setError("رقم الهاتف يجب أن يكون مكون من 10 أرقام بالضبط");
//       return;
//     }

//     setLoading(true);

//     try {
//       const fcmToken = await registerForPushNotificationsAsync();
//       console.log("🚀 Token used for login:", fcmToken);

//       const response = await fetch("https://apilab.runasp.net/api/ClientMobile/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({
//           phone: normalizedPhone,
//           fcmToken: fcmToken,
//         }),
//       });

//       const text = await response.text();
//       const data = text ? JSON.parse(text) : null;
//       console.log("📩 Response data:", data);

//       if (response.ok && data?.success) {
//         await AsyncStorage.setItem("token", data.resource.token);
//         await AsyncStorage.setItem("username", data.resource.username);
//         await AsyncStorage.setItem("phoneNumber", data.resource.phoneNumber);
//         await AsyncStorage.setItem("userFcmToken", fcmToken);
//         await AsyncStorage.setItem("isGuest", "false"); // تأكيد أنه ليس ضيف

//         navigation.replace("TabsScreen");
//       } else {
//         setError("فشل تسجيل الدخول، تأكد من صحة رقم الهاتف");
//       }
//     } catch (err) {
//       console.log("❌ Network error:", err);
//       setError("حدث خطأ أثناء الاتصال بالسيرفر");
//     }

//     setLoading(false);
//   };

//   // ✅ الدخول كضيف
//   const handleGuestLogin = async () => {
//     try {
//       // حفظ حالة الضيف
//       await AsyncStorage.setItem("isGuest", "true");
//       await AsyncStorage.setItem("guestUsername", "ضيف");
      
//       navigation.replace("TabsScreen");
//     } catch (error) {
//       console.log("❌ Error in guest login:", error);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAwareScrollView
//         style={{ flex: 1, backgroundColor: "#fff" }}
//         contentContainerStyle={{ flexGrow: 1 }}
//         enableOnAndroid={true}
//         extraScrollHeight={20}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           <Image
//             source={require("../assets/images/Rectangle 3.png")}
//             style={styles.topRightImage}
//           />
//           <Image
//             source={require("../assets/images/Rectangle 4.png")}
//             style={styles.bottomLeftImage}
//           />

//           <Image
//             source={require("../assets/images/logo.png")}
//             style={styles.logo}
//           />
//           <Text style={styles.logoText}>DAR EL-TEB</Text>

//           <View style={styles.card}>
//             <Text style={styles.title}>اهلاً بك في دار الطب</Text>
//             <View style={styles.underline} />

//             <Text style={styles.label}>رقم الهاتف:</Text>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="ادخل رقم الهاتف"
//                 placeholderTextColor="#888"
//                 keyboardType="phone-pad"
//                 textAlign="right"
//                 value={phone}
//                 onChangeText={setPhone}
//                 maxLength={10}
//               />
//               <Text style={styles.prefix}>🇪🇬 (+20)</Text>
//             </View>

//             {error ? <Text style={styles.errorText}>{error}</Text> : null}

//             {/* زر متابعة */}
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 (!phone || loading) && styles.buttonDisabled,
//               ]}
//               onPress={handleLogin}
//               disabled={!phone || loading}
//             >
//               {loading ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text
//                   style={[
//                     styles.buttonText,
//                     (!phone || loading) && styles.buttonTextDisabled,
//                   ]}
//                 >
//                   متابعة
//                 </Text>
//               )}
//             </TouchableOpacity>

//             {/* زر الدخول كضيف - تصميم محسن */}
//             <View style={styles.guestSection}>
//               <View style={styles.divider}>
//                 <View style={styles.dividerLine} />
//                 <Text style={styles.dividerText}>أو</Text>
//                 <View style={styles.dividerLine} />
//               </View>
              
//               <TouchableOpacity
//                 style={styles.guestButton}
//                 onPress={handleGuestLogin}
//               >
//                 <Ionicons name="person-outline" size={20} color="#005FA1" />
//                 <Text style={styles.guestButtonText}>الدخول كضيف</Text>
//               </TouchableOpacity>
              
//               <Text style={styles.guestNote}>
//                 يمكنك التصفح كضيف وعرض النقابات والموقع
//               </Text>
//             </View>

//             {/* الفوتر - تم تحسين موقعه
//             <View style={styles.footerContainer}>
//               <Text style={styles.footer}>
//                 من خلال الاستمرار فإنك توافق على شروط الاستخدام وسياسة الخصوصية
//               </Text>
//             </View> */}
//           </View>
//         </View>
//       </KeyboardAwareScrollView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#fff", 
//     alignItems: "center",
//     minHeight: height,
//   },
//   logo: {
//     width: width * 0.4,
//     height: width * 0.4,
//     resizeMode: "contain",
//     marginTop: height * 0.06,
//     shadowColor: "#00000040",
//     shadowOffset: { width: 4, height: 3 },
//     shadowOpacity: 1,
//     shadowRadius: 0,
//     elevation: 3,
//   },
//   logoText: {
//     fontSize: width * 0.065,
//     fontWeight: "bold",
//     color: "#005FA2",
//     textShadowColor: "#00000040",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//     marginBottom: height * 0.03,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "#005FA1",
//     width: "100%",
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     paddingHorizontal: width * 0.06,
//     paddingTop: height * 0.04,
//     paddingBottom: height * 0.02,
//     alignItems: "center",
//     justifyContent: "space-between",
//     minHeight: height * 0.6,
//   },
//   title: {
//     fontSize: width * 0.055,
//     fontWeight: "900",
//     color: "#fff",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   underline: {
//     width: width * 0.6,
//     borderBottomWidth: 2,
//     borderColor: "#ffffff88",
//     marginBottom: 20,
//   },
//   label: {
//     alignSelf: "flex-end",
//     fontSize: width * 0.04,
//     color: "#fff",
//     marginBottom: 8,
//     marginTop: 10,
//   },
//   inputContainer: {
//     flexDirection: "row-reverse",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#00000094",
//     borderRadius: 10,
//     width: "100%",
//     height: height * 0.06,
//     paddingHorizontal: 10,
//     marginBottom: 5,
//     backgroundColor: "#fff",
//   },
//   prefix: {
//     position: "absolute",
//     left: 1,
//     fontSize: width * 0.035,
//     color: "#005FA1",
//     backgroundColor: "#CBCBCBB2",
//     paddingHorizontal: 8,
//     paddingVertical: height * 0.015,
//     borderRadius: 8,
//   },
//   input: { 
//     flex: 1, 
//     paddingVertical: 8, 
//     fontSize: width * 0.038, 
//     color: "#000",
//     textAlign: "right",
//   },
//   button: {
//     backgroundColor: "#09BCDB",
//     borderRadius: 10,
//     width: "100%",
//     height: height * 0.055,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   buttonDisabled: { 
//     backgroundColor: "#09BCDB80",
//     // shadowOpacity: 0.1,
//   },
//   buttonText: { 
//     color: "#FFFFFF", 
//     fontSize: width * 0.04, 
//     fontWeight: "bold",
//   },
//   buttonTextDisabled: { 
//     color: "#FFFFFF80" 
//   },
//   // أنماط زر الدخول كضيف المحسنة
//   guestSection: {
//     width: "100%",
//     alignItems: "center",
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginBottom: 15,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#ffffff88",
//   },
//   dividerText: {
//     color: "#ffffff88",
//     paddingHorizontal: 10,
//     fontSize: width * 0.035,
//   },
//   guestButton: {
//     flexDirection: "row-reverse",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     width: "100%",
//     height: height * 0.055,
//     paddingHorizontal: 15,
//     gap: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//     marginBottom: 8,
//   },
//   guestButtonText: {
//     color: "#005FA1",
//     fontSize: width * 0.038,
//     fontWeight: "bold",
//   },
//   guestNote: {
//     color: "#ffffff88",
//     fontSize: width * 0.03,
//     textAlign: "center",
//     lineHeight: 16,
//   },
//   footerContainer: {
//     width: "100%",
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ffffff30",
//     marginTop: 5,
//   },
//   footer: {
//     fontSize: width * 0.03,
//     color: "#ffffff88",
//     textAlign: "center",
//     lineHeight: 16,
//   },
//   topRightImage: {
//     position: "absolute",
//     top: 0,
//     right: -width * 0.05,
//     width: width * 0.3,
//     height: width * 0.3,
//     opacity: 0.8,
//   },
//   bottomLeftImage: {
//     position: "absolute",
//     top: height * 0.2,
//     left: -width * 0.08,
//     width: width * 0.35,
//     height: width * 0.45,
//     opacity: 0.8,
//   },
//   errorText: {
//     color: "#ff6b6b",
//     alignSelf: "flex-end",
//     marginBottom: 8,
//     fontSize: width * 0.03,
//     fontWeight: "500",
//   },
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  TabsScreen: undefined;
};

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProps>();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ إعداد Firebase Cloud Messaging محسن للإنتاج
  const registerForPushNotificationsAsync = async (): Promise<string> => {
    try {
      // طلب صلاحيات الإشعارات
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log("🔔 Notification permission:", enabled ? "GRANTED" : "DENIED");

      if (!enabled) {
        console.log("🚫 Notification permission not granted");
        return "fallback-token";
      }

      // جلب FCM Token
      const fcmToken = await messaging().getToken();
      console.log("📱 FCM Token:", fcmToken);
      
      if (!fcmToken) {
        console.log("⚠️ No FCM token received");
        return "fallback-token";
      }

      // حفظ التوكن في AsyncStorage
      await AsyncStorage.setItem('fcmToken', fcmToken);
      
      // إرسال التوكن للسيرفر
      await sendTokenToServer(fcmToken);
      
      return fcmToken;
    } catch (err) {
      console.log("⚠️ Error getting FCM token:", err);
      return "fallback-token";
    }
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

  useEffect(() => {
    // 📩 عندما يضغط المستخدم على إشعار
    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("🔔 Notification opened app:", remoteMessage);
      if (remoteMessage?.data?.screen) {
        navigation.replace("TabsScreen");
      }
    });

    // 📦 عندما يفتح التطبيق من إشعار
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("📩 App opened from notification:", remoteMessage);
          if (remoteMessage?.data?.screen) {
            navigation.replace("TabsScreen");
          }
        }
      });

    // 📨 استقبال الإشعارات أثناء فتح التطبيق
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log("📨 Notification received in foreground:", remoteMessage);
      // يمكنك إضافة Toast هنا إذا أردت
    });

    return () => {
      unsubscribeOnNotificationOpened();
      unsubscribeOnMessage();
    };
  }, [navigation]);

  // 🧩 تحويل الأرقام العربية إلى إنجليزية
  const convertArabicToEnglishNumbers = (input: string) => {
    return input.replace(/[\u0660-\u0669]/g, (d) => {
      return String(d.charCodeAt(0) - 1632);
    });
  };

  // ✅ تسجيل الدخول
  const handleLogin = async () => {
    setError("");
    const normalizedPhone = convertArabicToEnglishNumbers(phone);

    if (normalizedPhone.length !== 10) {
      setError("رقم الهاتف يجب أن يكون مكون من 10 أرقام بالضبط");
      return;
    }

    setLoading(true);

    try {
      const fcmToken = await registerForPushNotificationsAsync();
      console.log("🚀 Token used for login:", fcmToken);

      const response = await fetch("https://apilab.runasp.net/api/ClientMobile/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          fcmToken: fcmToken,
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log("📩 Response data:", data);

      if (response.ok && data?.success) {
        await AsyncStorage.setItem("token", data.resource.token);
        await AsyncStorage.setItem("username", data.resource.username);
        await AsyncStorage.setItem("phoneNumber", data.resource.phoneNumber);
        await AsyncStorage.setItem("userFcmToken", fcmToken);
        await AsyncStorage.setItem("isGuest", "false"); // تأكيد أنه ليس ضيف

        navigation.replace("TabsScreen");
      } else {
        setError("فشل تسجيل الدخول، تأكد من صحة رقم الهاتف");
      }
    } catch (err) {
      console.log("❌ Network error:", err);
      setError("حدث خطأ أثناء الاتصال بالسيرفر");
    }

    setLoading(false);
  };

  // ✅ الدخول كضيف
  const handleGuestLogin = async () => {
    try {
      // حفظ حالة الضيف
      await AsyncStorage.setItem("isGuest", "true");
      await AsyncStorage.setItem("guestUsername", "ضيف");
      
      navigation.replace("TabsScreen");
    } catch (error) {
      console.log("❌ Error in guest login:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.container}>
          <Image
            source={require("../assets/images/Rectangle 3.png")}
            style={styles.topRightImage}
          />
          <Image
            source={require("../assets/images/Rectangle 4.png")}
            style={styles.bottomLeftImage}
          />

          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>DAR EL-TEB</Text>

          <View style={styles.card}>
            <Text style={styles.title}>اهلاً بك في دار الطب</Text>
            <View style={styles.underline} />

            <Text style={styles.label}>رقم الهاتف:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="ادخل رقم الهاتف"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                textAlign="right"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
              <Text style={styles.prefix}>🇪🇬 (+20)</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.button,
                (!phone || loading) && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!phone || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    (!phone || loading) && styles.buttonTextDisabled,
                  ]}
                >
                  متابعة
                </Text>
              )}
            </TouchableOpacity>

            {/* زر الدخول كضيف - تصميم محسن */}
            <View style={styles.guestSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>أو</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
              >
                <Ionicons name="person-outline" size={24} color="#005FA1" />
                <Text style={styles.guestButtonText}>الدخول كضيف</Text>
              </TouchableOpacity>
              
              <Text style={styles.guestNote}>
                يمكنك التصفح كضيف وعرض النقابات والموقع
              </Text>
            </View>

            {/* <Text style={styles.footer}>
              من خلال الاستمرار فإنك توافق على شروط الاستخدام وسياسة الخصوصية
            </Text> */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    resizeMode: "contain",
    marginTop: height * 0.08,
    shadowColor: "#00000040",
    shadowOffset: { width: 4, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  logoText: {
    fontSize: width * 0.075,
    fontWeight: "bold",
    color: "#005FA2",
    textShadowColor: "#00000040",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: height * 0.05,
  },
  card: {
    flex: 1,
    backgroundColor: "#005FA1",
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
  },
  underline: {
    width: width * 0.7,
    borderBottomWidth: 3,
    borderColor: "#ffffff88",
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-end",
    fontSize: width * 0.045,
    color: "#fff",
    marginBottom: 10,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00000094",
    borderRadius: 10,
    width: "100%",
    height: height * 0.065,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  prefix: {
    position: "absolute",
    left: 1,
    fontSize: width * 0.04,
    color: "#005FA1",
    backgroundColor: "#CBCBCBB2",
    paddingHorizontal: 1,
    paddingVertical: height * 0.018,
    borderRadius: 8,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: width * 0.04, color: "#000" },
  button: {
    backgroundColor: "#09BCDB",
    borderRadius: 10,
    width: "100%",
    height: height * 0.065,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#09BCDB80" },
  buttonText: { color: "#FFFFFF", fontSize: width * 0.045, fontWeight: "bold" },
  buttonTextDisabled: { color: "#FFFFFF80" },
  // أنماط زر الدخول كضيف المحسنة
  guestSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff88",
  },
  dividerText: {
    color: "#ffffff88",
    paddingHorizontal: 10,
    fontSize: width * 0.04,
  },
  guestButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: "100%",
    height: height * 0.065,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guestButtonText: {
    color: "#005FA1",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  guestNote: {
    color: "#ffffff88",
    fontSize: width * 0.035,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  footer: {
    fontSize: width * 0.04,
    color: "#ffffff88",
    textAlign: "right",
    marginTop: height * 0.04,
    lineHeight: 20,
  },
  topRightImage: {
    position: "absolute",
    top: 0,
    right: -width * 0.05,
    width: width * 0.35,
    height: width * 0.35,
  },
  bottomLeftImage: {
    position: "absolute",
    top: height * 0.25,
    left: -width * 0.08,
    width: width * 0.4,
    height: width * 0.55,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-end",
    marginBottom: 5,
    fontSize: width * 0.035,
  },
});