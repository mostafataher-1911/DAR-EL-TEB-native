import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showLogo, setShowLogo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 🌀 الأنيميشن الأول
    Animated.timing(scaleAnim, {
      toValue: 20,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // 🔄 الأنيميشن الثاني (الاختفاء)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowLogo(true);
        // ⏰ بعد الانيميشن يروح دايمًا على login
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!showLogo && (
          <Animated.View
            style={[
              styles.circle,
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}
          />
        )}

        {showLogo && (
          <View style={styles.logoBox}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
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
    width: width * 0.7,
    height: width * 0.7,
  },
});
