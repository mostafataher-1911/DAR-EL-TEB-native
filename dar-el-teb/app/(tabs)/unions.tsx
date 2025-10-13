import { Text, StyleSheet, View, ScrollView, Platform, ActivityIndicator } from "react-native";
import React, { Component } from "react";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import DiscountCard from "@/components/DiscountCard";
import { router } from "expo-router";

export default class Unions extends Component {
  state = {
    unions: [],
    filteredUnions: [], // ✅ هنا هنخزن النقابات بعد الفلترة
    searchQuery: "",
    loading: true,
  };

  componentDidMount() {
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
          this.setState({
            unions: data.resource,
            filteredUnions: data.resource, // ✅ في البداية كلهم يظهروا
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        console.log("Error fetching unions:", err);
        this.setState({ loading: false });
      });
  }

  handleSearch = (text: string) => {
    const { unions } = this.state;
    const filtered = unions.filter((union: any) =>
      union.name.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ searchQuery: text, filteredUnions: filtered });
  };

  handleNavigate = (union: any) => {
    router.push({
      pathname: "/unionDetails",
      params: {
        id: union.id,
        name: union.name,
      },
    });
  };

  render() {
    const { loading, filteredUnions, searchQuery } = this.state;

    return (
      <View style={{ marginTop: Platform.select({ ios: 50, android: 40 }), flex: 1 }}>
        {/* ✅ ابعت الـ props للـ Search */}
        <HeaderWithSearch
          value={searchQuery}
          onChangeText={this.handleSearch}
          searchPlaceholder="ابحث عن النقابة"
        />

        <View style={styles.container}>
          <Text style={styles.text}>خصومات الخاصة بالنقابات</Text>
        </View>

        {/* ✅ حالة التحميل */}
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
                  onPress={() => this.handleNavigate(union)}
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#001D3C",
    width: 375,
    height: 63,
    borderRadius: 20,
    marginTop: Platform.select({ ios: 10, android: 10 }),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  text: {
    fontFamily: "Roboto",
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
