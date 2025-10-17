import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

type DiscountCardProps = {
  imageSource: any;
  unionName: string;
  discount: string;
  onPress?: () => void;
};

const DiscountCard: React.FC<DiscountCardProps> = ({
  imageSource,
  unionName,
  discount,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={imageSource}
        style={styles.card}
        imageStyle={styles.cardImage}
        resizeMode="cover"
      >
        <View style={styles.innerBox}>
          <Text style={styles.title}>
            معمل دار الطب يقدم خصم خاص {unionName}
          </Text>

          <View style={styles.discountInnerBox}>
            <Text style={styles.discountLabel}>بخصومات تصل:</Text>
            <Text style={styles.discountValue}>{discount}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default DiscountCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    height: width * 0.4,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: 12,
  },
  innerBox: {
    width: width * 0.35, // ✅ بدل "38%" استخدم قيمة ثابتة بالبيكسل حسب الشاشة
    minWidth: 130,
    height: "75%",
    borderRadius: 10,
    backgroundColor: "rgba(217,217,217,0.68)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "800",
    fontSize: width * 0.028,
    lineHeight: 16,
    color: "#001D3C",
    textAlign: "center",
    marginBottom: 8,
  },
  discountInnerBox: {
    backgroundColor: "rgba(143, 126, 126, 0.29)",
    borderRadius: 10,
    width: 70,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#363636ff",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  discountLabel: {
    fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 10,
    color: "#001D3C",
    marginBottom: 3,
  },
  discountValue: {
    fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 10,
    color: "#001D3C",
  },
});
