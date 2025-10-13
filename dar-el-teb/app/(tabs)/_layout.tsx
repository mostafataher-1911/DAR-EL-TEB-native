import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#005FA1", // اللون الأزرق عند التفعيل
        tabBarInactiveTintColor: "#B9BCBE", // الرمادي عند عدم التفعيل
      }}
    >
      <Tabs.Screen
        name="account"
        options={{
          title: "حسابي",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="coins"
        options={{
          title: "كوينز",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="dollar-circle" size={size} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="unions"
        options={{
          title: "النقابات",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-balance" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
