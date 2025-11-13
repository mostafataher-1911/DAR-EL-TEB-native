// HeaderWithSearch.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageSourcePropType,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  Linking,
  Alert,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface HeaderWithSearchProps {
  logoSource?: ImageSourcePropType;
  onSearch?: (text: string) => void;
  onWhatsAppPress?: () => void;
  searchPlaceholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const HeaderWithSearch: React.FC<HeaderWithSearchProps> = ({
  logoSource = require("../assets/images/logo.png"),
  onSearch,
  onWhatsAppPress,
  searchPlaceholder = " ابحث عن نوع التحليل ",
  value,
  onChangeText,
}) => {
  const [localValue, setLocalValue] = useState<string>(value ?? "");

  // keep localValue in sync when parent updates `value`
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // submit handler (called on Enter or on search icon press)
  const handleSubmit = (e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const text = e?.nativeEvent?.text ?? localValue;
    if (onSearch) onSearch(text);
  };

  // whatsapp open with fallback
  const handleWhatsApp = async () => {
    if (onWhatsAppPress) {
      onWhatsAppPress();
      return;
    }

    const phoneNumber = "201002281461"; // رقمك
    const appUrl = `whatsapp://send?phone=${phoneNumber}`;
    const webUrl = `https://wa.me/${phoneNumber}`;

    try {
      // حاول تفتح رابط التطبيق أولاً
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
      } else {
        // fallback للمتصفح
        await Linking.openURL(webUrl);
      }
    } catch (err) {
      Alert.alert("خطأ", "لا يمكن فتح واتساب على هذا الجهاز");
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Logo left */}
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />

        {/* Search center */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor="#00000080"
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            value={localValue}
            onChangeText={(t) => {
              setLocalValue(t);
              onChangeText?.(t);
            }}
          />
          <TouchableOpacity onPress={() => handleSubmit()}>
            <EvilIcons name="search" size={30} color="#005FA1" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {/* WhatsApp icon right */}
        <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappBtn}>
          <FontAwesome name="whatsapp" size={24} color="#005FA1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderWithSearch;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    backgroundColor: "rgba(0,95,161,0.1)",
    borderRadius: 50,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
    marginHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    textAlign: "right",
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#0b3954",
    padding: 0,
  },
  whatsappBtn: {
    width: 48,
    height: 48,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,95,161,0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 0,
      },
    }),
  },
});
