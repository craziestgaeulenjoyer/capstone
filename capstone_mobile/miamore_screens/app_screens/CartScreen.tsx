import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IMAGE_MAP: { [key: string]: any } = {
  "BrewedHotCoffee.png": require("../../assets/BrewedHotCoffee.png"),
  "BrewedIcedCoffee.png": require("../../assets/BrewedIcedCoffee.png"),
  "Cappuccino.png": require("../../assets/Cappuccino.png"),
  "CaramelIcedCoffee.png": require("../../assets/CaramelIcedCoffee.png"),
  "ClassicIcedCoffee.png": require("../../assets/ClassicIcedCoffee.png"),
  "FrenchVanillaIcedCoffee.png": require("../../assets/FrenchVanillaIcedCoffee.png"),
  "Caramel.png": require("../../assets/Caramel.png"),
  "HazelnutIcedCoffee.png": require("../../assets/HazelnutIcedCoffee.png"),
  "Platter1.png": require("../../assets/Platter1.png"),
};

const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [usePoints, setUsePoints] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const points = 120;
  const discount = 12;

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("http://10.0.2.2:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadCart();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const updateQuantity = async (item: any, newQty: number) => {
    const token = await AsyncStorage.getItem("token");

    if (newQty <= 0) {
      // Remove item
      await fetch(`http://10.0.2.2:5000/api/cart/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.filter(x => x.id !== item.id));
    } else {
      // Update quantity
      await fetch(`http://10.0.2.2:5000/api/cart/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      setCartItems(prev =>
        prev.map(x => (x.id === item.id ? { ...x, quantity: newQty } : x))
      );
    }
  };

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://10.0.2.2:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const normalized = data.map((it: any) => ({
          ...it,
          price: it.price != null ? Number(it.price) : 0,
          quantity: it.quantity != null ? Number(it.quantity) : 0,
        }));
        setCartItems(normalized);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditModalVisible(true);
  };

  const saveEditChanges = async () => {
    setEditModalVisible(false);
    fetchCart(); 
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.price || 0),
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() =>
            showLoyalty ? setShowLoyalty(false) : navigation.goBack()
          }
        >
          <Icon name="arrow-back" size={24} color="#76B13A" />
          <Text style={styles.headerTitle}>
            {showLoyalty ? "Promo & Loyalty Points" : "Cart"}
          </Text>
        </TouchableOpacity>

        {/* Right Side Icons */}
        {!showLoyalty && (
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Icon name="search-outline" size={22} color="#000" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="create-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Main Content */}
      {!showLoyalty ? (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ padding: 16 }}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                let imageSource: any = require("../../assets/MiAmore2.png");
                if (item.image) {
                  if (
                    typeof item.image === "string" &&
                    (item.image.startsWith("http://") || item.image.startsWith("https://"))
                  ) {
                    imageSource = { uri: item.image }; 
                  } else if (IMAGE_MAP[item.image]) {
                    imageSource = IMAGE_MAP[item.image]; 
                  }
                }

                return (
                  <View key={item.id} style={styles.cartItem}>
                    <TouchableOpacity style={styles.checkbox} onPress={() => toggleSelect(item.id)}>
                      <Icon
                        name={selectedItems.includes(item.id) ? "checkbox-outline" : "square-outline"}
                        size={22}
                        color="#76B13A"
                      />
                    </TouchableOpacity>

                    <Image source={imageSource} style={styles.itemImage} />

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.itemTitle}>{item.product_name}</Text>
                      <Text style={styles.itemDesc}>
                        {item.instructions || "No special instructions"}
                      </Text>

                      <Text style={styles.itemPrice}>
                        ₱{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.qtyControls}>
                      <TouchableOpacity onPress={() => updateQuantity(item, item.quantity - 1)}>
                        <Text style={styles.qtyBtn}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item, item.quantity + 1)}>
                        <Text style={styles.qtyBtn}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => openEditModal(item)}>
                      <Text style={styles.editBtn}>Edit</Text>
                    </TouchableOpacity>

                    <View style={styles.qtyBox}>
                      <Text>{item.quantity}x</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={{ textAlign: "center", marginTop: 50 }}>
                Your cart is empty
              </Text>
            )}
          </ScrollView>

          {/* Loyalty Points Button + Checkout */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.loyaltyBtn}
              onPress={() => setShowLoyalty(true)}
            >
              <Icon name="gift-outline" size={20} color="#73C04D" />
              <Text style={styles.loyaltyText}>Loyalty Points</Text>
              <Text style={styles.loyaltySubText}>
                Collect points. Enjoy rewards.
              </Text>
            </TouchableOpacity>
            <View style={styles.checkoutRow}>
              <Text>{cartItems.length} Selected Food Items</Text>
              <Text style={styles.totalAmount}>₱{totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => {
                setModalMessage("Proceeding to checkout...");
                setModalVisible(true);
              }}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Loyalty Points Page
        <ScrollView style={{ padding: 16 }}>
          <View style={styles.loyaltyCard}>
            <Text style={styles.sectionTitle}>
              Apply Promo or Loyalty Points (Optional)
            </Text>
            <Text style={styles.sectionSubtitle}>
              Boost your savings with promo codes or loyalty rewards
            </Text>

            {/* Promo Code */}
            <View style={styles.promoRow}>
              <TextInput
                placeholder="e.g SAVE10"
                style={styles.input}
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={{ color: "#fff" }}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Loyalty Points Toggle */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => setUsePoints(!usePoints)}
            >
              <Icon
                name={usePoints ? "toggle" : "toggle-outline"}
                size={40}
                color={usePoints ? "#73C04D" : "#999"}
              />
              <Text style={styles.switchLabel}>Use My Loyalty Points</Text>
            </TouchableOpacity>

            {/* Points Info */}
            <Text style={styles.pointsInfo}>
              You have: {points} points   Equivalent: ₱{discount} discount
            </Text>
            <Text style={styles.autoText}>
              *Loyalty points will automatically be applied to this order
            </Text>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {modalMessage}
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <Image source={editItem?.image ? IMAGE_MAP[editItem.image] : require("../../assets/MiAmore2.png")} style={styles.editModalImage} />
            <Text style={styles.editModalTitle}>{editItem?.product_name}</Text>

            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.editModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#76B13A" }]}
                onPress={saveEditChanges}
              >
                <Text style={styles.editModalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        {["Home", "Nearby", "Menu", "Cart", "Profile"].map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={styles.tabItem}
            onPress={() => {
              if (tab === "Menu") navigation.navigate("Menu");
              else if (tab === "Home") navigation.navigate("Home");
              else if (tab === "Nearby") navigation.navigate("Nearby");
              else if (tab === "Cart") navigation.navigate("Cart");
              else if (tab === "Profile") navigation.navigate("Profile");
            }}
          >
            <Icon
              name={
                tab === "Cart"
                  ? "cart"
                  : tab === "Nearby"
                  ? "location-outline"
                  : tab === "Menu"
                  ? "restaurant-outline"
                  : tab === "Home"
                  ? "home-outline"
                  : "person-outline"
              }
              size={22}
              color={tab === "Cart" ? "#73C04D" : "#999"}
            />
            <Text
              style={[
                styles.tabText,
                { color: tab === "Cart" ? "#73C04D" : "#999" },
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

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,        
    borderBottomWidth: 1,     
    borderColor: "#eee",
    elevation: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 5,
  },
  itemImage: { backgroundColor: "#b5b5b3", width: 90, height: 90, borderRadius: 8, resizeMode: 'contain', },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemDesc: { fontSize: 12, color: "#777" },
  itemPrice: { marginTop: 5, fontWeight: "700" },
  qtyBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 5,
    marginLeft: 10,
    alignSelf: "center",
  },

  checkbox: {
    marginRight: 8,
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  cartDesc: {
    fontSize: 13,
    color: "#555",
  },
  cartPrice: {
    fontWeight: "600",
    fontSize: 15,
    marginTop: 4,
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  qtyBtn: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 8,
    color: "#76B13A",
  },
  qtyValue: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  editBtn: {
    color: "#555",
    fontSize: 14,
    marginLeft: 10,
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editModalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "85%",
  },
  editModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editModalBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    textAlign: "center",
  },

  editModalImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
    resizeMode: "contain",
  },

  footer: { padding: 16, borderTopWidth: 1, borderColor: "#eee" },
  loyaltyBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  loyaltyText: { marginLeft: 8, fontWeight: "600", color: "#73C04D" },
  loyaltySubText: { marginLeft: 8, fontSize: 12, color: "#777" },
  checkoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalAmount: { fontWeight: "700" },
  checkoutBtn: {
    backgroundColor: "#76B13A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  loyaltyCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  sectionTitle: { fontWeight: "700", fontSize: 16 },
  sectionSubtitle: { fontSize: 12, color: "#555", marginBottom: 10 },
  promoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  applyBtn: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  switchRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  switchLabel: { marginLeft: 8, fontSize: 14 },
  pointsInfo: { marginTop: 8, fontWeight: "600" },
  autoText: { fontSize: 12, color: "#777", marginTop: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "75%",
    alignItems: "center",
  },
  modalBtn: {
    marginTop: 16,
    backgroundColor: "#76B13A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
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
