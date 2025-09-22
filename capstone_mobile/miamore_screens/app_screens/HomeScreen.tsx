import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/MiAmore2.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.headerIcons}>
          <Icon name="mic-outline" size={24} color="#000" style={styles.icon} />
          <Icon name="notifications-outline" size={24} color="#000" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8c8c8c"
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
          <Text style={styles.linkText}>See all</Text>
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
              <View key={index} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: bgColor }]} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </View>
            );
          })}
        </View>

        {/* Most Popular */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most popular</Text>
          <Text style={styles.linkText}>View all  {'>'}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 27, paddingRight: 0 }}>
          {[
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
          ].map((item, i, arr) => (
            <View
              style={[
                styles.card,
                i === arr.length - 1 ? { marginRight: 27 } : {},
              ]}
              key={i}
            >
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
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        {["Home", "Nearby", "Menu", "Cart", "Profile"].map((tab, i) => (
          <TouchableOpacity key={i} style={styles.tabItem}>
            <Icon
              name={
                tab === "Home"
                  ? "home"
                  : tab === "Nearby"
                  ? "location-outline"
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
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerIcons: { flexDirection: "row" },
  icon: { marginRight: 24 },

  searchContainer: {
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

  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#000" },

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
  },
  deliverySubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
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
    width: 180,
    height: 260, 
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 22,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
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
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, marginTop: 2 },
});
