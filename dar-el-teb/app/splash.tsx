import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showLogo, setShowLogo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 20,
      duration: 3000, // خليته قصير للاختبار
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowLogo(true);

        setTimeout(async () => {
          const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
          if (isLoggedIn === "true") {
            router.replace("/(tabs)");
          } else {
            router.replace("/login");
          }
        }, 2000);
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* الدايرة */}
        {!showLogo && (
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          />
        )}

        {/* الصور + اللوجو يظهروا بعد الانيميشن */}
        {showLogo && (
          <>
            {/* صورة شمال فوق */}
            {/* <Image
              source={require("../assets/images/Rectangle 1.png")}
              style={styles.topLeftImage}
            /> */}

            {/* صورة يمين تحت */}
            {/* <Image
              source={require("../assets/images/Rectangle 2.png")}
              style={styles.bottomRightImage}
            /> */}

            {/* اللوجو */}
            <View style={styles.logoBox}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#005FA1",
    position: "absolute",
  },
  logoBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.7, // نسبة من العرض
    height: width * 0.7,
  },
  topLeftImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.45, // نسبة من عرض الجهاز
    height: height * 0.25,
    resizeMode: "contain",
  },
  bottomRightImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: width * 0.45,
    height: height * 0.25,
    resizeMode: "contain",
  },
});
