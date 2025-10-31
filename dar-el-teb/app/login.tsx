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
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useNavigation } from "@react-navigation/native";

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

  // 📩 إعداد Expo Notifications
  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      alert("Push notifications require a physical device.");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("فشل في الحصول على إذن الإشعارات");
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "b1f6acf7-dd88-4640-8271-f1028090b7c0", // 👈 استخدم الـ projectId من app.json
      })
    ).data;

    return token;
  };

  useEffect(() => {
    // listener لأي Notification تفتح التطبيق
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data.screen;
        if (screen) {
          navigation.replace("TabsScreen");
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  // 🧩 تحويل الأرقام العربية إلى إنجليزية
  const convertArabicToEnglishNumbers = (input: string) => {
    return input.replace(/[\u0660-\u0669]/g, (d) => {
      return String(d.charCodeAt(0) - 1632);
    });
  };

  const handleLogin = async () => {
    setError("");

    // 🔹 نحول الرقم قبل أي شيء
    const normalizedPhone = convertArabicToEnglishNumbers(phone);

    if (normalizedPhone.length !== 10) {
      setError("رقم الهاتف يجب أن يكون مكون من 10 أرقام بالضبط");
      return;
    }

    setLoading(true);

    try {
      const expoToken = await registerForPushNotificationsAsync();

      if (!expoToken) {
        setError("فشل الحصول على توكن الإشعارات");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://apilab.runasp.net/api/ClientMobile/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            phone: normalizedPhone, // ✅ نرسل الرقم بعد التحويل
            fcmToken: expoToken,
          }),
        }
      );

      const text = await response.text();
      let data = text ? JSON.parse(text) : null;

      if (response.ok && data.success) {
        await AsyncStorage.setItem("token", data.resource.token);
        await AsyncStorage.setItem("username", data.resource.username);
        await AsyncStorage.setItem("phoneNumber", data.resource.phoneNumber);

        navigation.replace("TabsScreen");
      } else {
        setError("فشل تسجيل الدخول، تأكد من صحة رقم الهاتف");
      }
    } catch (error) {
      setError("حدث خطأ أثناء الاتصال بالسيرفر");
    }

    setLoading(false);
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

            <Text style={styles.footer}>
              من خلال الاستمرار فإنك توافق على شروط الاستخدام وسياسة الخصوصية
            </Text>
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
