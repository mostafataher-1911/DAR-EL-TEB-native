import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LabLocationScreen() {
  const openMaps = async () => {
    try {
      const url = 'https://maps.google.com/?q=27.736946,30.844242';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("خطأ", "لا يمكن فتح الخرائط");
      }
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء فتح الخرائط");
    }
  };

  const callPhone = async () => {
    try {
      const url = 'tel:01002281461';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("خطأ", "لا يمكن إجراء المكالمة");
      }
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء إجراء المكالمة");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>موقع المعمل</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.labName}>معمل دار الطب</Text>
        
        <Text style={styles.address}>
          📍 ش أمام مدرسة الثانوية بنات بجوار مدرسة ميس بيرسون - ملوي - المنيا
        </Text>

        {/* إحداثيات الموقع */}
        {/* <View style={styles.coordinates}>
          <Text style={styles.coordinatesTitle}>الإحداثيات:</Text>
          <Text style={styles.coordinatesText}>27.736946, 30.844242</Text>
        </View> */}

        <TouchableOpacity style={styles.contactItem} onPress={callPhone}>
          <Text style={styles.contactText}>01002281461</Text>
          <Ionicons name="call" size={24} color="#005FA1" />
        </TouchableOpacity>

        <View style={styles.hoursSection}>
          <Text style={styles.sectionTitle}>أوقات العمل:</Text>
          <Text style={styles.hours}>🕗 من 8:30 صباحاً حتى 10:00 مساءً</Text>
          <Text style={styles.hours}>🕗 الجمعة من 10:00 صباحاً حتى 10:00 مساءً</Text>
          <Text style={styles.hours}>⏰ طوال أيام الأسبوع</Text>
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>فتح في خرائط جوجل</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005FA1",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005FA1",
    textAlign: "center",
    marginBottom: 15,
  },
  address: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 15,
  },
  coordinates: {
    backgroundColor: "#f0f7ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#005FA1",
    borderStyle: "dashed",
  },
  coordinatesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#005FA1",
    textAlign: "center",
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontFamily: "monospace",
  },
  contactItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    gap: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#005FA1",
    fontWeight: "bold",
  },
  hoursSection: {
    backgroundColor: "#f0f7ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#005FA1",
    marginBottom: 10,
    textAlign: "center",
  },
  hours: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  mapButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#005FA1",
    borderRadius: 10,
    padding: 15,
    gap: 10,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});