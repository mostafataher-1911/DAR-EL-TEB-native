import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DeleteAccountButton = () => {
  const navigation = useNavigation<any>();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد أنك تريد حذف الحساب؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "نعم، حذف",
          style: "destructive",
          onPress: async () => {
            try {
              // ✅ هنا ممكن لاحقًا تضيف API لحذف الحساب فعلاً
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("isLoggedIn");

              Alert.alert("تم الحذف", "تم حذف الحساب بنجاح", [
                {
                  text: "حسناً",
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "LoginScreen" }],
                    }),
                },
              ]);
            } catch (error) {
              console.log("Error deleting account:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
      <Text style={styles.text}>حذف الحساب</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#B00000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeleteAccountButton;
