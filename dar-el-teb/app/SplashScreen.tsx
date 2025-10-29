// import React, { useEffect, useRef } from "react";
// import { View, StyleSheet, Image, Animated, Dimensions } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { SafeAreaView } from "react-native-safe-area-context";


// type RootStackParamList = {
//   SplashScreen: undefined;
//   LoginScreen: undefined;
// };

// type NavigationProps = NativeStackNavigationProp<
//   RootStackParamList,
//   "SplashScreen"
// >;

// const { width, height } = Dimensions.get("window");

// export default function SplashScreen() {
//   const navigation = useNavigation<NavigationProps>();

//   const circleScale = useRef(new Animated.Value(0)).current;
//   const circleOpacity = useRef(new Animated.Value(1)).current;
//   const logoScale = useRef(new Animated.Value(0)).current;
//   const logoOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // 1️⃣ الدائرة تكبر وتملأ الشاشة
//     Animated.timing(circleScale, {
//       toValue: 15, // تكبير قوي لملء الشاشة
//       duration: 2000,
//       useNativeDriver: true,
//     }).start(() => {
//       // 2️⃣ تخفي الدائرة تدريجياً
//       Animated.timing(circleOpacity, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       }).start();

//       // 3️⃣ يظهر اللوجو بانيميشن ناعم
//       Animated.parallel([
//         Animated.timing(logoScale, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(logoOpacity, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         // 4️⃣ بعد شوية اللوجو يختفي ويروح لصفحة اللوجن
//         setTimeout(() => {
//           Animated.parallel([
//             Animated.timing(logoOpacity, {
//               toValue: 0,
//               duration: 600,
//               useNativeDriver: true,
//             }),
//             Animated.timing(logoScale, {
//               toValue: 0.7,
//               duration: 600,
//               useNativeDriver: true,
//             }),
//           ]).start(() => {
//             navigation.replace("LoginScreen");
//           });
//         }, 2500);
//       });
//     });
//   }, []);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* الدائرة الزرقاء */}
//         <Animated.View
//           style={[
//             styles.circle,
//             {
//               opacity: circleOpacity,
//               transform: [{ scale: circleScale }],
//             },
//           ]}
//         />

//         {/* اللوجو */}
//         <Animated.View
//           style={[
//             styles.logoContainer,
//             {
//               opacity: logoOpacity,
//               transform: [{ scale: logoScale }],
//             },
//           ]}
//         >
//           <Image
//             source={require("../assets/images/logo.png")}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     backgroundColor: "white",
//   },
//   circle: {
//     width: 10,
//     height: 10,
//     borderRadius: 50,
//     backgroundColor: "#005FA1",
//     position: "absolute",
//   },
//   logoContainer: {
//     position: "absolute",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: width * 0.55,
//     height: width * 0.55,
//   },
// });

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
};

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "SplashScreen"
>;

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProps>();

  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      // حساب أكبر قطر لتغطية الشاشة
      const maxCircleDiameter = Math.sqrt(width * width + height * height);
      const scaleFactor = maxCircleDiameter / 20; // 20 هو حجم البداية للدائرة

      // 1️⃣ تكبير الدائرة لتغطي الشاشة
      Animated.timing(circleScale, {
        toValue: scaleFactor,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // 2️⃣ اختفاء الدائرة تدريجياً
        Animated.timing(circleOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start();

        // 3️⃣ ظهور اللوجو بعد الدائرة
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 4️⃣ بعد ثانية، إخفاء اللوجو والانتقال للوجن
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(logoOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(logoScale, {
                toValue: 0.7,
                duration: 600,
                useNativeDriver: true,
              }),
            ]).start(() => {
              navigation.replace("LoginScreen");
            });
          }, 1000);
        });
      });
    }, 2000);

    return () => clearTimeout(startTimeout);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* الدائرة الزرقاء */}
        <Animated.View
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{ scale: circleScale }],
            },
          ]}
        />

        {/* اللوجو */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "white",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#005FA1",
    position: "absolute",
  },
  logoContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.55,
    height: width * 0.55,
  },
});
