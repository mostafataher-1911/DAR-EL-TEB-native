import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import DiscountCard from "@/components/DiscountCard";

export default function Unions() {
  const [unions, setUnions] = useState([]);
  const [filteredUnions, setFilteredUnions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://apilab.runasp.net/api/ClientMobile/GetAllUnion", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.resource) {
          setUnions(data.resource);
          setFilteredUnions(data.resource);
        }
      })
      .catch((err) => console.log("Error fetching unions:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    const filtered = unions.filter((union: any) =>
      union.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchQuery(text);
    setFilteredUnions(filtered);
  };

  return (
    <View style={{ marginTop: Platform.select({ ios: 50, android: 40 }), flex: 1 }}>
      <HeaderWithSearch
        value={searchQuery}
        onChangeText={handleSearch}
        searchPlaceholder="ابحث عن النقابة"
      />

      <View style={styles.container}>
        <Text style={styles.text}>الخصومات الخاصة بالنقابات</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005FA1" />
          <Text style={{ marginTop: 10, color: "#005FA1" }}>جاري التحميل...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredUnions.length > 0 ? (
            filteredUnions.map((union: any) => (
              <DiscountCard
                key={union.id}
                imageSource={{ uri: `https://apilab.runasp.net${union.imageUrl}` }}
                unionName={union.name}
                discount={`${union.disCount}%`}
              />
            ))
          ) : (
            <Text style={{ color: "red", marginTop: 20, fontSize: 16 }}>
              لا توجد نتائج مطابقة
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#001D3C",
    width: 375,
    height: 63,
    borderRadius: 20,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  text: {
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 22,
    color: "#FFFFFF",
    textAlign: "center",
  },
  scrollContainer: {
    padding: 20,
    marginTop: 10,
    paddingBottom: 30,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
});
