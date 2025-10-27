import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { SlideInLeft } from "react-native-reanimated";
import SectionWithHorizontalScroll from "@/components/SectionWithHorizontalScroll";

const { width, height } = Dimensions.get("window");

export default function UnionDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { name, id } = route.params as { name: string; id: string };

  const [labsData, setLabsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch("https://apilab.runasp.net/api/ClientMobile/GetMedicalLabs", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "",
        unionId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.resource) {
          setLabsData(data.resource);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching labs:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      {/* ✅ رأس الصفحة */}
      <SafeAreaView edges={["top"]} style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Animated.View entering={SlideInLeft.duration(400)}>
            <Ionicons name="arrow-back" size={width * 0.07} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل الخصومات</Text>
        <View style={{ width: width * 0.07 }} />
      </SafeAreaView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005FA1" />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>الخصومات المتاحة</Text>
          <Text style={styles.unionName}>{name}</Text>

          <View style={styles.sectionsContainer}>
            {labsData.map((section, index) => (
              <SectionWithHorizontalScroll
                key={index}
                title={section.category?.name}
                backgroundColor={
    index % 3 === 0
      ? "#001D3CF2"  // اللون الأول
      : index % 3 === 1
      ? "#005FA1" // اللون الثاني
      : "#09BCDB"   // اللون الثالث (غيره زي ما تحب)
  }
                items={section.labs.map((lab: any) => ({
                  id: lab.id,
                  image: { uri: `https://apilab.runasp.net${lab.imageUrl}` },
                  label: lab.name,
                  coins: lab.coins,
                }))}
              />
            ))}
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerValue}>
              📍 العنوان: ش أمام مدرسة الثانوية بنات بجوار مدرسة ميس بيرسون _ ملوي _ المنيا
            </Text>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    backgroundColor: "#001D3C",
    height: height * 0.12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: width * 0.08,
    height: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  scrollWrapper: {
    backgroundColor: "#F9F9F9",
  },
  container: {
    paddingTop: height * 0.03,
    alignItems: "center",
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#001D3C",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
  unionName: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#005FA1",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  sectionsContainer: {
    width: "100%",
    paddingHorizontal: width * 0.04,
  },
  footerContainer: {
    marginTop: height * 0.04,
    width: "100%",
    paddingHorizontal: width * 0.06,
    marginBottom: height * 0.04,
  },
  footerValue: {
    fontSize: width * 0.045,
    color: "#003670",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: width * 0.06,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#005FA1",
    fontSize: width * 0.045,
  },
});
