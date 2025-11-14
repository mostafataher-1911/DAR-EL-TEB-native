import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// شاشاتك - تأكد من المسارات الصحيحة
import AccountScreen from "./account";
import UnionsScreen from "./unions";
import HomeScreen from "./index";
import LabLocationScreen from "./LabLocationScreen"; // تأكد من أن المسار صحيح
import OffersScreen from "./offers";
const Tab = createBottomTabNavigator();

export default function TabsScreen() {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    checkGuestStatus();
  }, []);

  const checkGuestStatus = async () => {
    try {
      const guestStatus = await AsyncStorage.getItem("isGuest");
      setIsGuest(guestStatus === "true");
      console.log("Guest status:", guestStatus); // للت debugging
    } catch (error) {
      console.log("Error checking guest status:", error);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="OffersScreen" 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#005FA1",
        tabBarInactiveTintColor: "#B9BCBE",
      }}
    >
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
       <Tab.Screen
        name="OffersScreen"
        component={OffersScreen}
        options={{
          title: 'العروض',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-offer" size={size} color={color} />
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
        name="LabLocation"
        component={LabLocationScreen}
        options={{
          title: "موقعنا",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" size={size} color={color} />
          ),
        }}
      />

      {/* إخفاء حسابي للضيف */}
      {!isGuest && (
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
      )}
    </Tab.Navigator>
  );
}
