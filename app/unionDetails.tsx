import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
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
  const [filteredLabsData, setFilteredLabsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // فلترة البيانات حسب البحث
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLabsData(labsData);
      return;
    }

    const filtered = labsData.map(section => ({
      ...section,
      labs: section.labs.filter((lab: any) =>
        lab.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.labs.length > 0);

    setFilteredLabsData(filtered);
  }, [searchQuery, labsData]);

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
          // 👇 نجمع التحاليل حسب النوع
          const grouped: Record<string, any> = {};

          data.resource.forEach((section: any) => {
            const categoryName = section.category?.name || "غير محدد";
            if (!grouped[categoryName]) grouped[categoryName] = [];
            grouped[categoryName].push(...section.labs);
          });

          // نحول الـ grouped object لمصفوفة جاهزة للعرض
          const groupedArray = Object.keys(grouped).map((key) => ({
            category: { name: key },
            labs: grouped[key],
          }));

          setLabsData(groupedArray);
          setFilteredLabsData(groupedArray);
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
          {/* ✅ العنوان والبحث */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>الخصومات المتاحة</Text>
            <Text style={styles.unionName}>{name}</Text>
            
            {/* ✅ شريط البحث */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#005FA1" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن تحليل..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ✅ رسالة إذا ماكانش في نتائج بحث */}
          {filteredLabsData.length === 0 && searchQuery.length > 0 && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noResultsText}>لا توجد نتائج لـ "{searchQuery}"</Text>
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearchButton}>
                <Text style={styles.clearSearchText}>مسح البحث</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ✅ الأقسام - بدون مسافات جانبية */}
          <View style={styles.sectionsContainer}>
            {filteredLabsData.map((section, index) => (
              <SectionWithHorizontalScroll
                key={index}
                title={section.category?.name}
                backgroundColor={
                  index % 3 === 0
                    ? "#001D3CF2"  // اللون الأول
                    : index % 3 === 1
                    ? "#005FA1" // اللون الثاني
                    : "#09BCDB"   // اللون الثالث
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

          {/* ✅ الفوتر */}
          <View style={styles.footerContainer}>
            {/* <Text style={styles.footerValue}>
              📍 العنوان: ش أمام مدرسة الثانوية بنات بجوار مدرسة ميس بيرسون _ ملوي _ المنيا
            </Text> */}
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
    paddingTop: height * 0.02,
    alignItems: "center",
    paddingBottom: height * 0.05,
  },
  headerSection: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#001D3C",
    textAlign: "center",
    marginBottom: height * 0.008,
  },
  unionName: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#005FA1",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  // ✅ تصميم شريط البحث
  searchContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "#005FA1",
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#001D3C",
    textAlign: "right",
    paddingVertical: 8,
  },
  clearButton: {
    padding: 5,
  },
  // ✅ تصميم عدم وجود نتائج
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.05,
    width: "100%",
  },
  noResultsText: {
    fontSize: width * 0.045,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  clearSearchButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#005FA1",
    borderRadius: 8,
  },
  clearSearchText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // ✅ الأقسام - بدون مسافات جانبية
  sectionsContainer: {
    width: "100%",
    paddingHorizontal: 0, // ✅ غيرنا من width * 0.04 إلى 0
  },
  footerContainer: {
    marginTop: height * 0.04,
    width: "100%",
    paddingHorizontal: width * 0.06,
    marginBottom: height * 0.04,
  },
  footerValue: {
    fontSize: width * 0.04,
    color: "#003670",
    fontWeight: "600",
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