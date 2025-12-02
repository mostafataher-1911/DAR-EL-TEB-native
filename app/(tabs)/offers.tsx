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
import { SafeAreaView } from "react-native-safe-area-context";

export default function OffersScreen() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("https://apilab.runasp.net/api/ClientMobile/GetResponserImage", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        if (data.success && data.resource) {
          setBanners(data.resource);
        }
      } catch (err) {
        console.log("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005FA1" />
          <Text style={styles.loadingText}>جاري تحميل العروض...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>العروض والإعلانات</Text>
        </View>

        {/* Banners */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {banners.length > 0 ? (
            banners.map((item, index) => (
              <View key={index} style={styles.bannerCard}>
                <Image
                  source={{ uri: `https://apilab.runasp.net${item.imageUrl}` }}
                  style={styles.bannerImage}
                  resizeMode="contain"
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد عروض حالياً</Text>
            </View>
          )}
        </ScrollView>
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#001D3C",
    borderBottomWidth: 1,
    borderRadius:50,
    borderBottomColor: "#e9ecef",
   
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContent: {
    padding: wp("4%"),
    paddingBottom: hp("5%"),
  },
  bannerCard: {
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: hp("30%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    color: "#005FA1",
    fontSize: wp("4%"),
    marginTop: hp("1%"),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("20%"),
  },
  emptyText: {
    fontSize: wp("4.5%"),
    color: "#6c757d",
    textAlign: "center",
  },
});