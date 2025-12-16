import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Platform, ActivityIndicator, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import LogoutButton from "@/components/LogoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router"; // ✅ لإرجاع المستخدم إلى شاشة تسجيل الدخول
import DeleteAccountButton from "@/components/DeleteAccountButton";

type UserData = {
  name?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  bonus?: number;
};

type State = {
  userData: UserData | null;
  loading: boolean;
};

export default class Account extends Component<{}, State> {
  state: State = {
    userData: null,
    loading: true,
  };

  componentDidMount() {
    this.fetchUserData();
  }

  async fetchUserData() {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        // console.warn("⚠️ No token found — redirecting to Login");
        Alert.alert("تنبيه", "يجب تسجيل الدخول أولاً", [
          {
            text: "حسناً",
            onPress: () => router.replace("/login"), // ✅ يرجع المستخدم للـ Login
          },
        ]);
        this.setState({ loading: false });
        return;
      }

      // console.log("📦 Token found:", token);

      const response = await fetch("https://apilab.runasp.net/api/ClientMobile/GetProfile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        // console.error("❌ Fetch failed:", response.status, errorText);

        if (response.status === 401) {
          // ✅ التوكن منتهي أو غير صالح → يرجعه للـ Login
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        }

        this.setState({ loading: false });
        return;
      }

      const text = await response.text();
      if (!text.trim()) {
        // console.error("⚠️ Empty response body");
        this.setState({ loading: false });
        return;
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (err) {
        // console.error("❌ JSON parse error:", err, "\nResponse:", text);
        this.setState({ loading: false });
        return;
      }

      // console.log("✅ User Profile Data:", data);

      if (!data?.resource) {
        // console.error("⚠️ Invalid data format:", data);
        this.setState({ loading: false });
        return;
      }

      const res = data.resource;
      const normalized: UserData = {
        name: res.name ?? res.username ?? "",
        phone: res.phone ?? res.phoneNumber ?? "",
        address: res.address ?? "",
        bonus: typeof res.bonus === "number" ? res.bonus : Number(res.bonus) || 0,
      };

      this.setState({ userData: normalized, loading: false });
    } catch (error) {
      // console.error("🔥 Error fetching profile:", error);
      this.setState({ loading: false });
    }
  }

  render() {
    const { userData, loading } = this.state;

    if (loading) {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="#005FA1" />
        </View>
      );
    }

    if (!userData) {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <Text style={{ color: "#005FA1", fontSize: wp("5%") }}>فشل تحميل البيانات 😔</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>أهلا بك في معمل دار الطب</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>الاسم:</Text>
          <View style={styles.displayBox}>
            <Text style={styles.value}>{userData.name || "غير متوفر"}</Text>
            <Ionicons name="person-outline" size={wp("6%")} style={styles.icon} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>رقم الهاتف:</Text>
          <View style={styles.displayBox}>
            <Text style={styles.value}>{userData.phone || "غير متوفر"}</Text>
            <Feather name="phone" size={wp("5.5%")} style={styles.icon} />
          </View>
        </View>

        <View style={styles.coinsContainer}>
          <Text style={styles.labelcoins}>عدد الكوينز:</Text>
          <View style={styles.coinsBox}>
            <Image
              source={require("../../assets/images/Group 27.png")}
              style={styles.coinsIcon}
              resizeMode="contain"
            />
            <Text style={styles.coinsValue}>{userData.bonus ?? 0}</Text>
          </View>

        </View>

        <View style={styles.footerContainer}>
          {/* <Text style={styles.footerValue}>
            📍 العنوان: ش أمام مدرسة الثانوية بنات بجوار مدرسة ميس بيرسون _ ملوي _ المنيا
          </Text> */}
        </View>

        <View style={{ marginTop: hp("3%") }}>
          <LogoutButton />
        </View>
        <View style={{ marginTop: hp("1%") }}>
  <DeleteAccountButton />
</View> 

      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: wp("5%"),
  },
  logo: {
    position: "absolute",
    top: "35%",
    width: wp("90%"),
    height: wp("90%"),
    opacity: 0.08,
  },
  welcomeBox: {
    width: wp("90%"),
    height: hp("7%"),
    borderRadius: 30,
    backgroundColor: "#005FA1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.select({ ios: hp("10%"), android: hp("5%") }),
    marginBottom: hp("5%"),
    shadowColor: "#001D3C",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeText: {
    fontSize: wp("5%"),
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
  inputContainer: {
    width: wp("90%"),
    marginTop: hp("1%"),
  },
  label: {
    fontSize: wp("4%"),
    color: "#4c9bd3ff",
    marginBottom: hp("1%"),
    textAlign: "right",
    fontWeight: "700",
    alignSelf: "flex-end",
  },
  labelcoins: {
    fontSize: wp("4%"),
    color: "#4c9bd3ff",
    marginBottom: hp("1%"),
    textAlign: "right",
    fontWeight: "700",
  },
  displayBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: hp("8%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4c9bd3ff",
    backgroundColor: "#FFFFFFCC",
    paddingHorizontal: wp("4%"),
  },
  icon: {
    color: "#4c9bd3ff",
  },
  value: {
    fontSize: wp("4.5%"),
    color: "#4c9bd3ff",
    textAlign: "right",
    flex: 1,
    marginRight: wp("2%"),
  },
  coinsContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
    width: "100%",
  },
  coinsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: wp("50%"),
    height: hp("6%"),
    borderRadius: 20,
    backgroundColor: "#4087B9",
    paddingHorizontal: wp("4%"),
    marginTop: hp("1%"),
  },
  coinsIcon: {
    marginRight: wp("2%"),
    width: wp("7%"),
    height: wp("7%"),
  },
  coinsValue: {
    fontSize: wp("5%"),
    color: "#fff",
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: hp("1%"),
    width: "100%",
    paddingHorizontal: wp("5%"),
  },
  footerValue: {
    fontSize: wp("4.5%"),
    color: "#003670ff",
    fontWeight: "700",
    textAlign: "center",
  },
});
