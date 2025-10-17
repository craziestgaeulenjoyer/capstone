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
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const points = 120;
  const discount = 12;

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found — user might be logged out");
          return;
        }

        const res = await fetch("http://10.0.2.2:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data;
        const text = await res.text(); 
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("Cart response is not JSON:", text);
          if (text.includes("Forbidden") || text.includes("token")) {
            await AsyncStorage.removeItem("token");
            navigation.navigate("SignIn");
          }
          return;
        }

        if (!res.ok) {
          console.warn("Cart fetch failed:", data.message || res.status);
          return;
        }

        setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadCart();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
      setShowRemoveBtn(newSelection.length > 0);
      return newSelection;
    });
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
    if (!editItem) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://10.0.2.2:5000/api/cart/${editItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: editItem.quantity,
          size: editItem.size,
          instructions: editItem.instructions,
        }),
      });

      const raw = await response.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        console.error("Non-JSON response:", raw);
        throw new Error("Server did not return JSON");
      }

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((x) => (x.id === editItem.id ? { ...x, ...data.item } : x))
        );
        setModalMessage("Item updated successfully!");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 3000);
      } else {
        console.error("Failed to update:", data);
        setModalMessage(data?.message || "Error updating item");
        setModalVisible(true);
      }
    } catch (err) {
      console.error("Error updating item:", err);
      setModalMessage("Error updating item");
      setModalVisible(true);
    } finally {
      setEditModalVisible(false);
    }
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
          </View>
        )}
      </View>

      {/* Main Content */}
      {!showLoyalty ? (
        <View style={{ flex: 1, }}>
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
                    <TouchableOpacity
                      style={[styles.checkbox, selectedItems.includes(item.id) && styles.checkboxChecked,]}
                      onPress={() => toggleSelect(item.id)}
                    >
                      {selectedItems.includes(item.id) && (
                          <Icon name="checkmark" size={14} color="#fff" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.editIconContainer}
                      onPress={() => openEditModal(item)}
                    >
                      <Icon name="create-outline" size={20} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.row}>
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

                      <View style={styles.editCardQtyControls}>
                        <TouchableOpacity onPress={() => updateQuantity(item, item.quantity - 1)}>
                          <Text style={styles.qtyCardBtn}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyCardValue}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item, item.quantity + 1)}>
                          <Text style={styles.qtyCardBtn}>+</Text>
                        </TouchableOpacity>
                      </View>
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

          {showRemoveBtn && (
            <TouchableOpacity
              style={styles.removeCartBtn}
              onPress={() => setConfirmRemoveVisible(true)}
            >
              <Text style={styles.removeCartBtnText}>Remove from Cart</Text>
            </TouchableOpacity>
          )}

          {/* Loyalty Points Button + Checkout */}
          <View style={styles.footer}>
            <View style={styles.loyaltyRow}>
              <View style={styles.loyaltyLeft}>
                <Icon name="ticket" size={20} color="#76B13A" />
                <Text style={styles.loyaltyLabel}>Loyalty Points</Text>
              </View>
              <TouchableOpacity
                style={styles.loyaltyBtnRight}
                onPress={() => setShowLoyalty(true)}
              >
                <Text style={styles.loyaltyBtnText}>Collect points. Enjoy rewards.</Text>
              </TouchableOpacity>
              <Text style={styles.rightCaret}>{`>>`}</Text>
            </View>

            {/* Summary Row */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLeft}>
                {selectedItems.length} Selected Food Items
              </Text>
              <Text style={styles.summaryRight}>₱{totalAmount.toFixed(2)}</Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={async () => {
                try {
                  setModalMessage("Proceeding to checkout...");
                  setModalVisible(true);

                  const token = await AsyncStorage.getItem("token");
                  const response = await fetch("http://10.0.2.2:5000/api/checkout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      cartItems,
                      totalAmount,
                      paymentMethod: "Pay on Pickup", // or "GCash"
                    }),
                  });

                  let data;
                  try {
                    data = await response.json();
                  } catch (err) {
                    const text = await response.text();
                    throw new Error(`Server did not return valid JSON. Response: ${text}`);
                  }

                  if (!response.ok) {
                    throw new Error(data.message || "Checkout failed");
                  }

                  console.log("✅ Checkout success:", data);
                  setModalMessage("Order Confirmed!");
                  setTimeout(() => setModalVisible(false), 3000);

                } catch (err) {
                  console.error("Checkout error:", err);
                  setModalMessage(err.message || "Error processing checkout");
                  setTimeout(() => setModalVisible(false), 3000);
                }
              }}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Loyalty Points Page
        <ScrollView style={{ padding: 16 }}>
          <View style={styles.loyaltyContainer}>
            <Text style={styles.sectionTitle}>
              Apply Promo or Loyalty Points <Text style={{ fontWeight: "400" }}>(Optional)</Text>
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
                <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Loyalty Toggle */}
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => setUsePoints(!usePoints)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.toggleOuter,
                  usePoints ? styles.toggleActive : styles.toggleInactive,
                ]}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    usePoints ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" },
                  ]}
                />
              </View>
              <Text style={styles.switchLabel}>Use My Loyalty Points</Text>
            </TouchableOpacity>

            {/* Points Info */}
            <View style={styles.pointsInfoBox}>
              <Text style={styles.pointsText}>
                You have: <Text style={styles.pointsValue}>{points}</Text> points
              </Text>
              <Text style={styles.pointsText}>
                Equivalent: <Text style={styles.pointsValue}>₱{discount}</Text> discount
              </Text>
            </View>

            <Text style={styles.autoText}>
              *Loyalty points will automatically be applied to this order
            </Text>

            <View style={styles.redemptionBox}>
              <Icon name="lock-closed-outline" size={14} color="#777" />
              <Text style={styles.redemptionText}>
                Redemption tied to User ID: <Text style={styles.userId}>#USR-001293</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* General Modal */}
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
          </View>
        </View>
      </Modal>

      {/* Confirm Remove Modal */}
      <Modal
        visible={confirmRemoveVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmRemoveVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
              Are you sure you want to remove selected item(s)?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setConfirmRemoveVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#E53935" }]}
                onPress={async () => {
                  const token = await AsyncStorage.getItem("token");
                  for (const id of selectedItems) {
                    await fetch(`http://10.0.2.2:5000/api/cart/${id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                  }
                  setCartItems((prev) =>
                    prev.filter((item) => !selectedItems.includes(item.id))
                  );
                  setSelectedItems([]);
                  setShowRemoveBtn(false);
                  setConfirmRemoveVisible(false);
                  setModalMessage("Item(s) removed from cart!");
                  setModalVisible(true);
                  setTimeout(() => setModalVisible(false), 3000);
                }}
              >
                <Text style={styles.modalBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalBox}>
            {/* Product Image */}
            <Image
              source={
                editItem?.image
                  ? IMAGE_MAP[editItem.image]
                  : require("../../assets/MiAmore2.png")
              }
              style={styles.editModalImage}
            />

            {/* Product Info */}
            <Text style={styles.editModalTitle}>{editItem?.product_name}</Text>
            <Text style={styles.editModalPrice}>
              ₱{(Number(editItem?.price) * Number(editItem?.quantity)).toFixed(2)}
            </Text>

            {/* Quantity Selector */}
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.editQtyControls}>
              <TouchableOpacity onPress={() => setEditItem({ ...editItem, quantity: Math.max(1, editItem.quantity - 1) })}>
                <Text style={styles.qtyBtn}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{editItem?.quantity}</Text>
              <TouchableOpacity onPress={() => setEditItem({ ...editItem, quantity: editItem.quantity + 1 })}>
                <Text style={styles.qtyBtn}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Size Options */}
            <Text style={styles.sectionLabel}>Select options</Text>
            <View style={styles.sizeRow}>
              {["Small", "Medium", "Large"].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.sizeBtn,
                    editItem?.size === s.toLowerCase() && styles.sizeBtnActive,
                  ]}
                  onPress={() => setEditItem({ ...editItem, size: s.toLowerCase() })}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      editItem?.size === s.toLowerCase() && styles.sizeTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes */}
            <Text style={styles.sectionLabel}>What's included</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add special instructions..."
              value={editItem?.instructions || ""}
              onChangeText={(txt) =>
                setEditItem({ ...editItem, instructions: txt })
              }
              multiline
            />

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#76B13A" }]}
                onPress={saveEditChanges}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckout}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkoutBox}>
            <View style={styles.checkoutHeader}>
              <TouchableOpacity onPress={() => setShowCheckout(false)}>
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.checkoutTitle}>Checkout</Text>
            </View>

            <ScrollView style={{ marginTop: 10 }}>
              <Text style={styles.checkoutSectionTitle}>Order Will Be Delivered To</Text>

              {/* Information Card */}
              <View style={styles.infoCard}>
                <Icon name="person-outline" size={18} color="#76B13A" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.infoLabel}>Your Information</Text>
                  <Text style={styles.infoValue}>John Doe</Text>
                  <Text style={styles.infoSub}>johndoe@email.com</Text>
                </View>
              </View>

              {/* Address Card */}
              <View style={styles.infoCard}>
                <Icon name="home-outline" size={18} color="#76B13A" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.infoLabel}>Home</Text>
                  <Text style={styles.infoValue}>+63 987-654-3210</Text>
                  <Text style={styles.infoSub}>
                    Unit 5, Sleepy Panda Street, Laughington
                  </Text>
                </View>
              </View>

              {/* Payment Methods */}
              <Text style={styles.paymentTitle}>Payment Method</Text>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === "GCash" && styles.paymentSelected,
                ]}
                onPress={() => setSelectedPayment("GCash")}
              >
                <Icon name="wallet-outline" size={20} color="#76B13A" />
                <Text style={styles.paymentLabel}>GCash</Text>
                <Text style={styles.paymentDesc}>
                  Securely pay by entering your GCash number online.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === "Pickup" && styles.paymentSelected,
                ]}
                onPress={() => setSelectedPayment("Pickup")}
              >
                <Icon name="cash-outline" size={20} color="#76B13A" />
                <Text style={styles.paymentLabel}>Pay on Pickup</Text>
                <Text style={styles.paymentDesc}>
                  Pay the delivery rider upon receiving your order (Cash or GCash accepted)
                </Text>
              </TouchableOpacity>

              {/* Totals */}
              <View style={styles.totalBox}>
                <Text style={styles.totalRow}>
                  Delivery Charge <Text style={styles.totalValue}>₱0.00</Text>
                </Text>
                <Text style={styles.totalRow}>
                  Subtotal <Text style={styles.totalValue}>₱{totalAmount.toFixed(2)}</Text>
                </Text>
                <Text style={styles.totalRowBold}>
                  Total Amount <Text style={styles.totalValue}>₱{totalAmount.toFixed(2)}</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmCheckoutBtn}
                onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem("token");
                    const response = await fetch("http://10.0.2.2:5000/api/checkout", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        cartItems,
                        paymentMethod: selectedPayment,
                        totalAmount,
                      }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                      setShowCheckout(false);
                      setShowOrderConfirm(true);
                      console.log("Checkout successful:", data);
                    } else {
                      console.error("Checkout failed:", data);
                      setModalMessage(data.message || "Error placing order");
                      setModalVisible(true);
                    }
                  } catch (err) {
                    console.error("Checkout error:", err);
                    setModalMessage("Network or server error");
                    setModalVisible(true);
                  }
                }}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Order Confirmed Modal */}
      <Modal
        visible={showOrderConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOrderConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.orderConfirmBox}>
            <Icon name="checkmark-circle" size={70} color="#76B13A" />
            <Text style={styles.orderConfirmTitle}>Order Confirmed</Text>
            <Text style={styles.orderConfirmDetail}>
              User ID: <Text style={{ fontWeight: "bold" }}>#USR-001293</Text>
            </Text>
            <Text style={styles.orderConfirmDetail}>
              Transaction ID: <Text style={{ fontWeight: "bold" }}>TXN-405321</Text>
            </Text>
            <Text style={styles.orderConfirmTime}>
              Estimated Time: <Text style={{ color: "#3182ce" }}>25–30 minutes</Text>
            </Text>
            <Text style={styles.orderConfirmNote}>
              A receipt has been sent to your email. You can view your order in order history.
            </Text>
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
              if (tab === "Menu") navigation.navigate("Menu" as never);
              else if (tab === "Home") navigation.navigate("Home" as never);
              else if (tab === "Nearby") navigation.navigate("Nearby" as never);
              else if (tab === "Cart") navigation.navigate("Cart" as never);
              else if (tab === "Profile") navigation.navigate("Profile" as never);
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
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 3,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemImage: { backgroundColor: "#b5b5b3", width: 90, height: 90, borderRadius: 8, resizeMode: 'contain', marginTop: 26, },
  itemTitle: { marginLeft: 6, fontSize: 16, fontWeight: "600" },
  itemDesc: { marginLeft: 6, fontSize: 12, color: "#777" },
  itemPrice: { marginLeft: 6, marginTop: 5, fontWeight: "700" },
  editIconContainer: { position: "absolute", top: 2, right: 8, marginBottom: 4, padding: 8, },

  checkbox: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#76B13A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  checkboxChecked: {
    backgroundColor: "#76B13A", 
    borderColor: "#76B13A",    
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
    justifyContent: "flex-end",
    marginLeft: 50,
  },
  qtyBtn: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#76B13A",
    paddingHorizontal: 8,
    marginHorizontal: 10,
  },
  qtyCardBtn: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#76B13A",
    paddingHorizontal: 8,
    marginHorizontal: 6,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 6,
  },
  qtyCardValue: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 6,
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
  editModalBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20, 
    width: "90%",
    maxHeight: "90%",
  },
  editModalImage: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    width: "100%",
    height: 140,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "left",
    marginVertical: 4,
  },
  editModalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#76B13A",
    textAlign: "left",
    marginBottom: 12,
  },
  editCardQtyControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 2,
    marginTop: 8,
    width: 90,
    backgroundColor: "#fff",
  },
  editQtyControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 3,
    width: 110,
    marginLeft: 5,
    backgroundColor: "#fff",
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 14,
    borderBottomWidth: 3, 
    borderColor: "#73C04D",
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  sizeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,    
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",

    // shadow settings (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },   
    shadowOpacity: 0.15,
    shadowRadius: 3,

    // shadow settings (Android)
    elevation: 4,
  },
  sizeBtnActive: {
    backgroundColor: "#76B13A",
    borderColor: "#76B13A",
    elevation: 4,
  },
  sizeText: {
    color: "#555",
    fontWeight: "500",
  },
  sizeTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
  },
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  removeCartBtn: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  removeCartBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // Footer and Loyalty Styles
  footer: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderTopLeftRadius: 30,  
    borderTopRightRadius: 30,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#dfdfdf",
    marginTop: 10,
  },
  loyaltyContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,

    // ios shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    // android shadow
    elevation: 3,
  },
  loyaltyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  loyaltyLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  loyaltyLabel: {
    marginLeft: 8,
    color: "#76B13A",
    fontWeight: "600",
  },
  loyaltyBtnRight: {
    borderWidth: 1,
    borderColor: "#76B13A",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 18,
  },
  loyaltyBtnText: {
    color: "#76B13A",
    fontSize: 12,
    fontWeight: "500",
  },
  toggleOuter: {
    width: 50,
    height: 28,
    borderRadius: 24,
    justifyContent: "center",
    padding: 3,
    marginRight: 10,
  },
  toggleActive: {
    backgroundColor: "#76B13A",
  },
  toggleInactive: {
    backgroundColor: "#ccc",
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  pointsInfoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 14,
    color: "#555",
  },
  pointsValue: {
    fontWeight: "bold",
    color: "#000",
  },
  autoText: {
    fontSize: 12,
    color: "#3182ce",
    marginBottom: 16,
  },
  redemptionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  redemptionText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 6,
  },
  userId: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  rightCaret: {
    fontSize: 20,
    fontWeight: "600",
    color: "#76B13A",  
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderTopColor: "#dfdfdf",
    borderTopWidth: 2,
  },
  summaryLeft: {
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 13,
    color: "#333",
  },
  summaryRight: {
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  checkoutBtn: {
    backgroundColor: "#76B13A",
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  sectionSubtitle: { 
    fontSize: 13,
    color: "#555",
    marginBottom: 16,
  },
  promoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16, 
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pointsInfo: { 
    marginTop: 8, 
    fontWeight: "600",
  },

  // Checkout Modal Styles
  checkoutBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: "90%",
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  checkoutSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  infoLabel: {
    fontWeight: "700",
    color: "#000",
  },
  infoValue: {
    fontSize: 14,
    color: "#222",
  },
  infoSub: {
    fontSize: 12,
    color: "#777",
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  paymentSelected: {
    borderColor: "#76B13A",
    backgroundColor: "#f4faef",
  },
  paymentLabel: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000",
  },
  paymentDesc: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  totalBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  totalRow: {
    fontSize: 13,
    color: "#444",
    marginBottom: 5,
  },
  totalRowBold: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000",
  },
  totalValue: {
    float: "right",
  },
  confirmCheckoutBtn: {
    backgroundColor: "#73C04D",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  orderConfirmBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  orderConfirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  orderConfirmDetail: {
    fontSize: 14,
    marginTop: 6,
    color: "#333",
  },
  orderConfirmTime: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  orderConfirmNote: {
    fontSize: 12,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 18,
  },

  // Bottom Tabs
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
