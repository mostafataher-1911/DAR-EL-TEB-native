import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  StatusBar,
  Platform 
} from "react-native";
import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import SectionWithHorizontalScroll from "@/components/SectionWithHorizontalScroll";

export default function HomeScreen() {
  const [labsData, setLabsData] = useState<any[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://apilab.runasp.net/api/ClientMobile/GetMedicalLabs", {
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
        const data = await res.json();

        if (data.success && data.resource) {
          // ✅ نجمع التحاليل حسب الفئة
          interface Lab {
            id: string;
            name: string;
            imageUrl: string;
            coins: number;
          }

          interface Category {
            name: string;
          }

          interface Section {
            category?: Category;
            labs: Lab[];
          }

          interface GroupedLabs {
            [key: string]: Lab[];
          }

          const grouped: GroupedLabs = {};

          data.resource.forEach((section: Section) => {
            section.labs.forEach((lab: Lab) => {
              const categoryName = section.category?.name || "غير مصنف";
              if (!grouped[categoryName]) {
                grouped[categoryName] = [];
              }
              grouped[categoryName].push(lab);
            });
          });

          // نحولها لمصفوفة sections منظمة
          const groupedArray = Object.keys(grouped).map((categoryName) => ({
            category: { name: categoryName },
            labs: grouped[categoryName],
          }));

          setLabsData(groupedArray);
          setFilteredLabs(groupedArray);
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header مع ضبط المسافات */}
        <View style={styles.headerContainer}>
          <HeaderWithSearch
            onChangeText={handleSearch}
            searchPlaceholder="ابحث عن نوع التحليل"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005FA1" />
            <Text style={styles.loadingText}>جاري التحميل...</Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredLabs.length > 0 ? (
              filteredLabs.map((section, index) => (
                <SectionWithHorizontalScroll
                  key={index}
                  title={section.category?.name}
                  backgroundColor={
                    index % 3 === 0
                      ? "#001D3CF2"
                      : index % 3 === 1
                      ? "#005FA1"
                      : "#09BCDB"
                  }
                  items={section.labs.map((lab: any) => ({
                    id: lab.id,
                    image: { uri: `https://apilab.runasp.net${lab.imageUrl}` },
                    label: lab.name,
                    coins: lab.coins,
                  }))}
                />
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResults}>لا يوجد تحليل بهذا الاسم ⚠️</Text>
              </View>
            )}
          </ScrollView>
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
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? hp('1%') : hp('2%'),
    paddingBottom: hp('1%'),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: hp('1%'),
    paddingBottom: hp('8%'),
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
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('20%'),
  },
  noResults: {
    textAlign: "center",
    fontSize: wp("4%"),
    color: "#666",
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});