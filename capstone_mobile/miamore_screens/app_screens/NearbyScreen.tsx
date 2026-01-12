import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from "react-native";
{/* import MapView, { Marker, Polyline } from "react-native-maps"; */}
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

const NearbyScreen: React.FC = () => {
  const navigation = useNavigation();

  const [region, setRegion] = useState({
    latitude: 14.6500,
    longitude: 121.0000,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  const [routeCoords] = useState([
    { latitude: 14.9500, longitude: 120.9000 }, // Baliwag
    { latitude: 14.7000, longitude: 121.0000 }, // Valenzuela
    { latitude: 14.5995, longitude: 120.9842 }, // Manila
    { latitude: 14.5547, longitude: 121.0244 }, // Makati
  ]);

  const [history] = useState([
    { id: "1", time: "10 Apr 13:48", event: "Parcel has been delivered", proof: true },
    { id: "2", time: "10 Apr 14:18", event: "Parcel is out for delivery" },
    { id: "3", time: "10 Apr 09:25", event: "Delivery driver has been assigned" },
  ]);

  // Request location permission (Android only)
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn("Location permission denied");
          }
        } catch (err) {
          console.error("Permission error:", err);
        }
      }
    };
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Nearby" />

      {/* Map Section */}
      {/* <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          provider="google"
        >
          {routeCoords.map((coord, index) => (
            <Marker
              key={index}
              coordinate={coord}
              pinColor={index === routeCoords.length - 1 ? "#73C04D" : "red"}
            />
          ))}
          <Polyline coordinates={routeCoords} strokeColor="#73C04D" strokeWidth={4} />
        </MapView>
      </View> */}

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.deliveredText}>Delivered on 10 Apr</Text>
          <View style={styles.progressContainer}>
            <View style={styles.step}>
              <View style={[styles.dot, { backgroundColor: "#73C04D" }]} />
              <Text style={styles.stepLabel}>Shipped</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.step}>
              <View style={[styles.dot, { backgroundColor: "#73C04D" }]} />
              <Text style={styles.stepLabel}>Out for Delivery</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.step}>
              <View style={[styles.dot, { backgroundColor: "#73C04D" }]} />
              <Text style={[styles.stepLabel, { fontWeight: "700" }]}>
                Delivered
              </Text>
            </View>
          </View>
        </View>

        {/* History */}
        <View style={styles.historyCard}>
          <Text style={styles.historyHeader}>SPX Express</Text>
          <Text style={styles.trackingNumber}>PH255729584855H</Text>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Order Details</Text>
          </TouchableOpacity>

          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyTime}>{item.time}</Text>
                <Text
                  style={[
                    styles.historyEvent,
                    { color: item.proof ? "#73C04D" : "#555" },
                  ]}
                >
                  {item.event}
                </Text>
                {item.proof && (
                  <Text style={styles.proofLink}>View Proof of Delivery</Text>
                )}
              </View>
            )}
          />
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
                  ? "home-outline"
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
                { color: tab === "Nearby" ? "#73C04D" : "#999" },
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

export default NearbyScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  mapContainer: {
    height: 250,
    marginHorizontal: 16,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
  },
  map: { flex: 1 },

  scrollContent: {
    flex: 1,
  },

  statusCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
  },
  deliveredText: {
    color: "#73C04D",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  step: { alignItems: "center" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  stepLabel: { fontSize: 12 },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#73C04D",
    marginHorizontal: 3,
  },

  historyCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
  },
  historyHeader: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  trackingNumber: { color: "#666", marginBottom: 6 },
  detailsBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#73C04D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
  },
  detailsBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  historyItem: { marginBottom: 8 },
  historyTime: { fontSize: 11, color: "#888" },
  historyEvent: { fontSize: 13, fontWeight: "500" },
  proofLink: {
    color: "#73C04D",
    fontSize: 12,
    textDecorationLine: "underline",
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
