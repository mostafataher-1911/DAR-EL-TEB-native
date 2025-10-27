
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// شاشاتك
import AccountScreen from "./account";
import UnionsScreen from "./unions";
import HomeScreen from "./index";

const Tab = createBottomTabNavigator();

export default function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#005FA1",
        tabBarInactiveTintColor: "#B9BCBE",
      }}
    >
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "حسابي",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Unions"
        component={UnionsScreen}
        options={{
          title: "النقابات",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-balance" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
