import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

type Item = {
  id: string;
  image: any;
  label: string;
  coins: number;
};

type SectionWithHorizontalScrollProps = {
  title: string;
  backgroundColor?: string;
  items: Item[];
};

const SectionWithHorizontalScroll: React.FC<SectionWithHorizontalScrollProps> = ({
  title,
  backgroundColor = "#001D3C",
  items,
}) => {
  return (
    <View style={[styles.section, { backgroundColor }]}>
      {/* العنوان */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}:</Text>
      </View>

      {/* ScrollView أفقي */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* الصورة تاخد الجزء العلوي */}
            <Image source={item.image} style={styles.image} resizeMode="cover" />

            {/* البوكس السفلي للنصوص */}
            <View style={styles.textBox}>
              <Text style={styles.label}>{item.label}</Text>
              <View style={styles.coinsRow}>
                <Text style={styles.coinsText}>كوينز</Text>
                <Text style={styles.coinsValue}>{item.coins}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SectionWithHorizontalScroll;

const styles = StyleSheet.create({
  section: {
    marginVertical: 5,
    
    paddingBottom: 20,
     borderRadius: 12,
    //  width: 430,
     height: 260,
  },
  titleBox: {
      fontFamily: "Roboto",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  title: {
      fontFamily: "Roboto",
    paddingTop: 5,
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: 140,
    height: 170,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 15,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 100, // الجزء العلوي كله للصورة
  },
  textBox: {
    flex: 1,
    color: "#001D3C",
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16,
   color: "#001D3C",
    textAlign: "center",
    marginBottom: 4,
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coinsText: {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 10,
   color: "#001D3C",
  },
  coinsValue: {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 16,
    color: "#001D3C",
  
  },
});
