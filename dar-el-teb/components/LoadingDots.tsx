import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const Dot = ({ delay, size }: { delay: number; size: number }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, opacity },
      ]}
    />
  );
};

export default function LoadingDots({
  size = 12,
  color = "#005FA1",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <View style={styles.container}>
      <Dot delay={0} size={size} />
      <Dot delay={200} size={size} />
      <Dot delay={400} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    backgroundColor: "#005FA1",
    marginHorizontal: 4,
  },
});
