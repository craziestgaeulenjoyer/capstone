import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/navigation";
import { API_BASE } from "../../config/api";

const HomeScreen: React.FC = () => {  
  type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<HomeNavProp>();
  const { width } = Dimensions.get("window");

  const [sessionExpired, setSessionExpired] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const validateToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("⚠️ No token found, redirecting to SignIn");
        navigation.navigate("SignIn" as never);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.log("⚠️ Token expired or invalid");

          await AsyncStorage.removeItem("token"); // clear token
          setSessionExpired(true);                // show modal
          return;
        }

        const data = await res.json();
        console.log("Token valid:", data);
      } catch (err) {
        console.error("Error validating token:", err);

        await AsyncStorage.removeItem("token");
        setSessionExpired(true);
      }
    };

    validateToken();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Home" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#121212"
          />
        </View>

        {/* Delivery Banner */}
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>Delivery at Home</Text>
          <Text style={styles.deliverySubtitle}>
            Your favorites, delivered fresh and {'\n'}fast straight to your doorstep.
          </Text>

          <TouchableOpacity style={styles.deliveryButton}>
            <Text style={styles.deliveryButtonText}>2.4 km</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={styles.skewedBanner}>
          <View style={styles.skewedInner}>
            <ImageBackground
              source={require('../../assets/MatchaLatteCover.png')}
              style={styles.bannerImage}
              imageStyle={{ borderRadius: 12, resizeMode: 'cover' }}
            >
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>New on the Menu</Text>
                <Text style={styles.promoSubtitle}>
                  A Creamy & Refreshing {'\n'}New Delight
                </Text>
                <TouchableOpacity style={styles.orderBtn}>
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.linkText}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categories}>
          {[
            { name: "Snacks", icon: "fast-food" },
            { name: "Coffee", icon: "coffee" },
            { name: "Milk tea", icon: "cup" },
            { name: "Fruit juices", icon: "apple" },
          ].map((item, index) => {
            let bgColor = "#DFF2D8";
            if (item.name === "Snacks" || item.name === "Milk tea") {
              bgColor = "#92E3A9";
            } else if (item.name === "Coffee" || item.name === "Fruit juices") {
              bgColor = "#8CB662";
            }

            return (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate("Menu", {
                    category:
                      item.name === "Snacks"
                        ? "Foods"
                        : item.name === "Coffee"
                        ? "Coffees"
                        : item.name === "Milk tea"
                        ? "Milktea"
                        : "Lemonade and Fruitti Juice",
                  })
                }
              >
                <View style={[styles.categoryIcon, { backgroundColor: bgColor }]} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Most Popular */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most popular</Text>
          <Text style={styles.linkText}>View all  {'>'}</Text>
        </View>

        <View style={styles.cardContainer}>
          <FlatList
            data={[
              {
                name: "Biscoff Croffle",
                desc: "Crispy, buttery & topped with rich Biscoff goodness.",
                price: "₱150",
                image: require('../../assets/croffles.jpg'),
              },
              {
                name: "Classic Iced Coffee",
                desc: "Bold, smooth & refreshing timeless favorite.",
                price: "₱55/65",
                image: require('../../assets/ClassicIcedCoffee.png'),
              },
              {
                name: "Platters #3",
                desc: "Crispy fries, cheesy sticks & nuggets perfect for sharing.",
                price: "₱170",
                image: require('../../assets/Platter3.png'),
              },
            ]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={200} 
            decelerationRate="fast"
            renderItem={({ item }) => (
              <View style={[styles.card, { width: width * 0.45 }]}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>

                  <View style={{ flex: 1 }} />

                  <Text style={styles.cardPrice}>{item.price}</Text>
                  <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(_, i) => i.toString()}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / (width * 0.75)
              );
              setActiveIndex(index);
            }}
          />

          {/* Dots indicator */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 4, marginRight: 14, }}>
            {[0, 1, 2].map((_, i) => (
              <View
                key={i}
                style={{
                  width: 12,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                  backgroundColor: i === activeIndex ? "#73C04D" : "#ccc",
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        {["Home", "Menu", "Cart", "Profile"].map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={styles.tabItem}
            onPress={() => {
              if (tab === "Menu") navigation.navigate("Menu" as never);
              else if (tab === "Home") navigation.navigate("Home" as never);
              else if (tab === "Cart") navigation.navigate("Cart" as never);
              else if (tab === "Profile") navigation.navigate("Profile" as never);
            }}
          >
            <Icon
              name={
                tab === "Home"
                  ? "home"
                  : tab === "Menu"
                  ? "restaurant-outline"
                  : tab === "Cart"
                  ? "cart-outline"
                  : "person-outline"
              }
              size={22}
              color={tab === "Home" ? "#73C04D" : "#999"}
            />
            <Text
              style={[
                styles.tabText,
                { color: tab === "Home" ? "#73C04D" : "#999" },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={sessionExpired}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
              Session Expired
            </Text>

            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Please login again.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#73C04D",
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 8,
              }}
              onPress={() => {
                setSessionExpired(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SignIn" as never }],
                });
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  searchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 27,
    marginBottom: 24,
    backgroundColor: "#cccccc",
    borderColor: "#8c8c8c",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    elevation: 10, 
    fontFamily: 'Montserrat',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#000", fontFamily: 'Montserrat', },

  deliveryCard: {
    backgroundColor: '#8BC34A', 
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 27,
    marginBottom: 32,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Shadow for Android
    elevation: 14,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  deliverySubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  deliveryButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  deliveryButtonText: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: 'Montserrat-Bold',
  },

  skewedBanner: {
    marginHorizontal: 27,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    marginBottom: 24,
    height: 140,
    overflow: 'hidden',
    borderRadius: 12,
    transform: [{ skewX: '-5deg' }],
  },
  skewedInner: {
    flex: 1,
    transform: [{ skewX: '5deg' }], // reverse the skew for content
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'center',
  },
  promoContent: {
    padding: 16,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  orderBtn: {
    backgroundColor: '#73C04D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  orderBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 27,
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  linkText: { color: "#41E2DA", fontSize: 14, fontWeight: 500, },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 36,
    marginTop: 10,
  },
  categoryItem: { alignItems: "center" },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 45,
    marginBottom: 8,
  },
  categoryText: { fontSize: 12, fontWeight: 700, marginBottom: 10, },

  card: {
    width: 200,
    height: 260, 
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 22,
    marginRight: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContainer: {
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 27,
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#555",
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 6,
  },
  addBtn: {
    backgroundColor: "#73C04D",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 30,
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, marginTop: 2 },
});
