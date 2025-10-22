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
  Alert,
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

  interface UserData {
    id?: number;
    full_name: string;
    email: string;
    phone_number?: string;
  }

  interface CartItem {
    id: number;
    customer_id?: number;
    product_id: number;
    product_name: string;
    phone_number?: string;
    size?: string;
    quantity: number;
    instructions?: string;
    price: number;
    image?: string;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [toggledTrashItems, setToggledTrashItems] = useState<number[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [modalMessage, setModalMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderCode, setOrderCode] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [showLoyalty, setShowLoyalty] = useState(false);
  const [usePoints, setUsePoints] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
  const [showOrderConfirmTab, setShowOrderConfirmTab] = useState(false);
  const [showCheckoutTab, setShowCheckoutTab] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://10.0.2.2:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://10.0.2.2:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setCartItems(data);

          const subtotalCalc = data.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0
          );
          setSubtotal(subtotalCalc);

          const deliveryFee = 0; 
          setTotalAmount(subtotalCalc + deliveryFee);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("No Items Selected", "Please select at least one item to proceed to checkout.");
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://10.0.2.2:5000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: selectedCartItems,
          paymentMethod: selectedPayment,
          totalAmount,
          address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTransactionId(data.transaction_id);
        setOrderCode(data.order_code);
        setUserData({ full_name: data.full_name, email: data.email });
        setShowOrderModal(true);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleTrashItem = (id: number) => {
    setToggledTrashItems((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];

      setShowRemoveBtn(updated.length > 0);

      return updated;
    });
  };

  const updateQuantity = async (item: CartItem, newQty: number) => {
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

  const openEditModal = (item: CartItem) => {
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
      {!showLoyalty && !showCheckoutTab && !showOrderConfirmTab ? (
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

                const isSelected = selectedItems.includes(item.id);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.cartItem,
                      isSelected && { borderColor: "#76B13A", borderWidth: 2 },
                    ]}
                  >
                    {/* Selection checkbox */}
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxChecked,
                      ]}
                      onPress={() => toggleSelectItem(item.id)} 
                    >
                      {isSelected && <Icon name="checkmark" size={14} color="#fff" />}
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", right: 10, top: 10 }}>
                      {/* Edit Icon */}
                      <TouchableOpacity
                        style={[styles.editIconContainer, { marginRight: 10 }]}
                        onPress={() => openEditModal(item)}
                      >
                        <Icon name="create-outline" size={20} color="#000" />
                      </TouchableOpacity>

                      {/* Trash Icon */}
                      <TouchableOpacity
                        style={styles.trashIconContainer}
                        onPress={() => toggleTrashItem(item.id)}
                      >
                        <Icon
                          name="trash-outline"
                          size={20}
                          color={toggledTrashItems.includes(item.id) ? "red" : "#000"} 
                        />
                      </TouchableOpacity>
                    </View>

                    {/* item info */}
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
                        <TouchableOpacity
                          onPress={() => updateQuantity(item, item.quantity - 1)}
                        >
                          <Text style={styles.qtyCardBtn}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyCardValue}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item, item.quantity + 1)}
                        >
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
                {selectedItems.length} Selected Food Item
                {selectedItems.length !== 1 ? "s" : ""}
              </Text>
              <Text style={styles.summaryRight}>
                ₱{cartItems
                  .filter((item) => selectedItems.includes(item.id))
                  .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
                  .toFixed(2)}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                selectedItems.length === 0 && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (selectedItems.length === 0) {
                  Alert.alert(
                    "No Items Selected",
                    "Please select at least one item to proceed to checkout."
                  );
                  return;
                }

                setShowCheckoutTab(true);
              }}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : showLoyalty ? (
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
      ) : showCheckoutTab && !showOrderConfirmTab ? (
        <ScrollView style={styles.checkoutContainer}>
          <Text style={styles.checkoutTitle}>Order Will Be Delivered To</Text>

          <View style={styles.checkoutSection}>
            <View style={styles.checkoutCard}>
              <View style={styles.cardHeader}>
                <Icon name="person-circle-outline" size={20} color="#76B13A" />
                <Text style={styles.cardHeaderText}>Your Information</Text>
              </View>
              <Text style={styles.cardText}>{userData?.full_name || "Loading..."}</Text>
              <Text style={styles.cardSubText}>{userData?.email || ""}</Text>
            </View>

            <View style={styles.checkoutCard}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="home-outline" size={20} color="#76B13A" />
                  <Text style={styles.cardHeaderText}>Delivery Address</Text>
                </View>

                <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                  <Icon name="pencil-outline" size={18} color="#555" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardText}>(+63) {userData?.phone_number || "No phone number."}</Text>
              <Text style={styles.cardSubText}>
                {address || "No address entered yet. Tap the pencil to add one."}
              </Text>
            </View>
          </View>

          <Text style={styles.paymentLabel}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.paymentOptionRow, selectedPayment === "GCash" && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment("GCash")}
          >
            <View style={styles.paymentLeftRow}>
              <Image source={require("../../assets/gcash.png")} style={styles.paymentIcon} />
              <View>
                <Text style={styles.paymentName}>GCash</Text>
                <Text style={styles.paymentDescOne}>
                  Securely pay by entering your GCash number online.
                </Text>
              </View>
            </View>
            <Icon
              name={
                selectedPayment === "GCash"
                  ? "radio-button-on-outline"
                  : "radio-button-off-outline"
              }
              size={22}
              color={selectedPayment === "GCash" ? "#76B13A" : "#999"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOptionRow, selectedPayment === "Pay on Pickup" && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment("Pay on Pickup")}
          >
            <View style={styles.paymentLeftRow}>
              <Image source={require("../../assets/deliveryicon.png")} style={styles.paymentIcon} />
              <View>
                <Text style={styles.paymentName}>Pay on Pickup</Text>
                <Text style={styles.paymentDescTwo}>
                  Pay the delivery rider upon receiving your order (Cash or GCash accepted).
                </Text>
              </View>
            </View>
            <Icon
              name={
                selectedPayment === "Pay on Pickup"
                  ? "radio-button-on-outline"
                  : "radio-button-off-outline"
              }
              size={22}
              color={selectedPayment === "Pay on Pickup" ? "#76B13A" : "#999"}
            />
          </TouchableOpacity>

          <View style={styles.amountBox}>
            <View style={styles.amountRow}>
              <Text style={styles.amountText}>Delivery Charge</Text>
              <Text style={styles.amountValue}>₱0.00</Text>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountText}>Subtotal</Text>
              <Text style={styles.amountValue}>₱{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountTotal}>Total Amount</Text>
              <Text style={styles.amountTotalValue}>₱{totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmCheckoutBtn}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}

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

      {/* Order Confirmation Modal */}
      <Modal visible={showOrderModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={80} color="#76B13A" />
            <Text style={styles.confirmTitle}>Order Confirmed</Text>

            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>
                <Text style={styles.confirmLabel}>Order ID: </Text>{orderCode || "ORD-XXXXXX"}
              </Text>
              <Text style={styles.confirmText}>
                <Text style={styles.confirmLabel}>Transaction ID: </Text>{transactionId || "TXN-XXXXXX"}
              </Text>
              <Text style={styles.confirmText}>
                <Text style={styles.confirmLabel}>Name: </Text>{userData?.full_name || "Loading..."}
              </Text>
              <Text style={styles.confirmText}>
                <Text style={styles.confirmLabel}>Email: </Text>{userData?.email || ""}
              </Text>
              <Text style={styles.confirmText}>
                <Text style={styles.confirmLabel}>Estimated Time: </Text>
                <Text style={styles.confirmLink}>25–30 minutes</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setShowOrderModal(false);
                navigation.navigate("Home");
              }}
            >
              <Text style={styles.confirmBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Address Modal */}
      <Modal visible={showAddressModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addressModal}>
            <Text style={styles.modalTitle}>Edit Delivery Address</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your address..."
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#76B13A" }]}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
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
                  for (const id of toggledTrashItems) {
                    await fetch(`http://10.0.2.2:5000/api/cart/${id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                  }

                  setCartItems((prev) =>
                    prev.filter((item) => !toggledTrashItems.includes(item.id))
                  );
                  setToggledTrashItems([]);
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
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
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
  trashIconContainer: {
    padding: 6,
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
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

  addressModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    elevation: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    fontSize: 14,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  checkoutContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  checkoutSection: {
    marginBottom: 20,
  },
  checkoutCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginLeft: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
  },
  cardSubText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
    lineHeight: 18,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 10,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  paymentDescTwo: {
    fontSize: 12,
    color: "#777",
    position: "relative",
    width: "70%",
  },
  paymentDescOne: {
    fontSize: 12,
    color: "#777",
    position: "relative",
    width: "90%",
  },
  amountBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  amountText: {
    fontSize: 13,
    color: "#444",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 13,
    color: "#444",
    textAlign: "right",
  },
  amountTotal: {
    fontWeight: "700",
    fontSize: 15,
    marginTop: 6,
  },
  amountTotalValue: {
    fontWeight: "700",
    fontSize: 15,
    color: "#000",
    textAlign: "right",
  },
  confirmCheckoutBtn: {
    backgroundColor: "#73C04D",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  confirmContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  confirmContent: {
    alignItems: "center",
    marginTop: 50,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    color: "#000",
  },
  confirmBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  confirmLabel: {
    fontWeight: "700",
    color: "#000",
  },
  confirmLink: {
    color: "#3182ce",
    fontWeight: "600",
  },
  confirmNote: {
    fontSize: 13,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 18,
  },
  confirmBtn: {
    backgroundColor: "#76B13A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 30,
    elevation: 4,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  paymentOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  paymentLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentOptionSelected: {
    borderColor: "#76B13A",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "85%",
    alignItems: "center",
    elevation: 6,
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
  tabItem: { 
    alignItems: "center" 
  },
  tabText: { 
    fontSize: 12, 
    marginTop: 2 
  },
});


