import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  ActivityIndicator 
} from "react-native";
import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ التعديل هنا
import HeaderWithSearch from "@/components/HeaderWithSearch";
import SectionWithHorizontalScroll from "@/components/SectionWithHorizontalScroll";

export default function HomeScreen() {
  const [banners, setBanners] = useState<any[]>([]);
  const [labsData, setLabsData] = useState<any[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("https://apilab.runasp.net/api/ClientMobile/GetResponserImage", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data1 = await res1.json();
        if (data1.success && data1.resource) setBanners(data1.resource);

        const res2 = await fetch("https://apilab.runasp.net/api/ClientMobile/GetMedicalLabs", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "",
            unionId: "00000000-0000-0000-0000-000000000000",
          }),
        });
        const data2 = await res2.json();
        if (data2.success && data2.resource) {
          setLabsData(data2.resource);
          setFilteredLabs(data2.resource);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (text: string) => {
    if (!text.trim()) {
      setFilteredLabs(labsData);
      return;
    }
    const searchLower = text.toLowerCase();
    const filtered = labsData
      .map((section) => ({
        ...section,
        labs: section.labs.filter((lab: any) =>
          lab.name.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((section) => section.labs.length > 0);
    setFilteredLabs(filtered);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}> 
      {/* ✅ edges={["top"]} يمنع الطلوع فوق في Android */}
      <View style={styles.container}>
        <HeaderWithSearch
          onChangeText={handleSearch}
          searchPlaceholder="ابحث عن نوع التحليل"
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005FA1" />
            <Text style={styles.loadingText}>جاري التحميل...</Text>
          </View>
        ) : (
          <>
            <View style={styles.bannerWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bannerContainer}
              >
                {banners.map((item, index) => (
                  <Image
                    key={index}
                    source={{ uri: `https://apilab.runasp.net${item.imageUrl}` }}
                    style={styles.image}
                  />
                ))}
              </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {filteredLabs.length > 0 ? (
                filteredLabs.map((section, index) => (
                  <SectionWithHorizontalScroll
                    key={index}
                    title={section.category?.name}
                    backgroundColor={section.category?.colorHexa || "#005FA1"}
                    items={section.labs.map((lab: any) => ({
                      id: lab.id,
                      image: { uri: `https://apilab.runasp.net${lab.imageUrl}` },
                      label: lab.name,
                      coins: lab.coins,
                    }))}
                  />
                ))
              ) : (
                <Text style={styles.noResults}>لا يوجد تحليل بهذا الاسم ⚠️</Text>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerWrapper: {
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
  },
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
    paddingHorizontal: wp("3%"),
  },
  image: {
    width: wp("80%"),
    height: hp("25%"),
    borderRadius: wp("3%"),
    resizeMode: "cover",
  },
  scrollContent: {
    paddingBottom: hp("5%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#005FA1",
    fontSize: wp("4%"),
    marginTop: hp("1%"),
  },
  noResults: {
    textAlign: "center",
    marginTop: hp("5%"),
    fontSize: wp("4%"),
    color: "red",
  },
});
