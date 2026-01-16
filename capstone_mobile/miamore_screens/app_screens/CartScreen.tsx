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
  Linking,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import CheckoutTab from "../components/CheckoutTab";
import { authFetch } from "../../utils/authFetch";
import { API_BASE } from "../../config/api";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../../routes/navigation";

type CartRouteProp = RouteProp<RootStackParamList, "Cart">;

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
  const navigation = useNavigation<any>();
  const route = useRoute<CartRouteProp>();

  const initialStep =
  route.params?.checkoutStep === "confirm" ? 3 : 1;

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
    type: string;
    phone_number?: string;
    size?: string;
    quantity: number;
    instructions?: string;
    price: number;
    image?: string;
    category?: string;
    is_free?: boolean; 
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [toggledTrashItems, setToggledTrashItems] = useState<number[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrderState] = useState<any | null>(null);
  
  const [modalMessage, setModalMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderCode, setOrderCode] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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
  const [gcashHandled, setGcashHandled] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loyaltyRewards, setLoyaltyRewards] = useState(0);
  const [loyaltyProgress, setLoyaltyProgress] = useState(0);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup" | null>(null);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [freeDrinkAllowance, setFreeDrinkAllowance] = useState(0);
  const [freeItems, setFreeItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found — user might be logged out");
          return;
        }

        const res = await authFetch(`${API_BASE}/api/cart`);

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

        console.log("Cart items fetched from backend:");
        data.forEach((item: any, i: number) => {
          console.log(`#${i + 1} created_at:`, item.created_at);
        });
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log("🔗 Deep link received:", url);

      // prevent double execution
      if (gcashHandled) return;

      if (url.includes("payment-success")) {
        setGcashHandled(true);

        // 1️⃣ Extract order_code from PayMongo redirect
        const match = url.match(/order_code=([^&]+)/);
        const returnedOrderCode = match?.[1];

        if (!returnedOrderCode) {
          console.warn("No order_code found in redirect URL");
          return;
        }

        setOrderCode(returnedOrderCode);

        // 2️⃣ CLEAR CART IN BACKEND (THIS WAS MISSING)
        await authFetch(`${API_BASE}/api/orders/clear-cart-after-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderCode: returnedOrderCode }),
        });

        // 3️⃣ Refresh cart (should now be EMPTY)
        await fetchCartItems();

        // 4️⃣ Show success modal
        setShowOrderModal(true);
      }
    };

    // Listen while app is running
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle cold start (app was closed)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [gcashHandled]);

  useEffect(() => {
    const loadLoyalty = async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/loyalty/status`);
        const data = await res.json();

        setFreeDrinkAllowance(Number(data.free_drinks || 0));
      } catch (err) {
        console.error("Failed to load loyalty:", err);
      }
    };

    loadLoyalty();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/profile`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchLoyaltyProgress = async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/loyalty/progress`);
        const data = await res.json();

        if (res.ok) {
          setLoyaltyProgress(data.progress);
          setLoyaltyRewards(data.freeDrinksEarned);
        }
      } catch (err) {
        console.error("Error fetching loyalty progress:", err);
      }
    };

    fetchLoyaltyProgress();
  }, []);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found — user might be logged out");
          return;
        }

        const res = await authFetch(`${API_BASE}/api/orders/pending`);

        const text = await res.text();
        try {
          const data = JSON.parse(text); 
          if (Array.isArray(data)) {
            setPendingOrders(data);
          } else {
            console.warn("Unexpected data format:", data);
          }
        } catch (parseErr) {
          console.error("JSON parse error:", parseErr, "\nRaw response:", text);
        }
      } catch (err) {
        console.error("Error fetching pending orders:", err);
      }
    };

    fetchPendingOrders();
  }, []);

  useEffect(() => {
    const selectedTotal = cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );

    setTotalAmount(selectedTotal);
  }, [cartItems, selectedItems]);

  const fetchCartItems = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/cart`);

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.warn("Cart response is not JSON:", text);
        return;
      }

      if (!res.ok) {
        console.warn("Cart fetch failed:", data?.message || res.status);
        return;
      }

      if (Array.isArray(data)) {
        setCartItems(data);

        const subtotalCalc = data.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        );

        setSubtotal(subtotalCalc);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, [])
  );

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        "No Items Selected",
        "Please select at least one item to proceed to checkout."
      );
      return;
    }

    // Build selectedCartItems cleanly with correct fields
    const selectedCartItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        id: item.id,
        product_id: item.product_id || item.id,
        product_name: item.product_name,
        type: item.type,
        size: item.size,
        quantity: item.quantity,
        price: Number(item.price),
        image: item.image,
        instructions: item.instructions || "",
      }));

    const freeDrinks = Array.from({ length: loyaltyRewards }).map((_, i) => ({
      product_id: 0,
      product_name: `Free Drink #${i + 1}`,
      size: "medium",
      quantity: 1,
      price: 0,
      image: "BrewedIcedCoffee.png",
      is_free: true,
      instructions: "Loyalty Reward",
    }));

    // Prepare and log payload for debugging
    const payload = {
      cartItems: [...selectedCartItems, ...freeDrinks],
      paymentMethod: selectedPayment,
      totalAmount, 
      address,
      fulfillmentMethod,
    };

    console.log("🛒 Sending checkout payload:", JSON.stringify(payload, null, 2));

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }

      // GCash branch
      if (selectedPayment === "GCash") {
        // Create order first (pending)
        const orderRes = await authFetch(`${API_BASE}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const orderData = await orderRes.json();

        if (!orderRes.ok) {
          Alert.alert("Error", orderData.message || "Checkout failed");
          return;
        }

        // 2️⃣ Start GCash payment
        const payRes = await authFetch(`${API_BASE}/api/paymongo/gcash`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            phone_number: userData?.phone_number,
            order_code: orderData.order_code,
          }),
        });

        const payData = await payRes.json();

        console.log("💳 GCash response:", payRes.status, payData);

        // ❌ Payment init failed → STOP
        if (!payRes.ok) {
          Alert.alert(
            "GCash Payment Failed",
            payData.message || "Unable to initiate GCash payment."
          );
          return false;
        }

        // ✅ Redirect to GCash
        if (payData.redirect_url) {
          Linking.openURL(payData.redirect_url);
          return false; 
        }

        // Safety fallback
        Alert.alert(
          "Payment Pending",
          "Your order was created. Please complete payment via GCash."
        );

        return;
      }

      // Pay on Pickup (and other methods)
      const response = await authFetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Checkout response (Pay on Pickup):", data);

      if (response.ok) {
        // Remove selected items from backend cart
        for (const id of selectedItems) {
          await authFetch(`${API_BASE}/api/cart/${id}`, {
            method: "DELETE",
          });
        }

        // Update UI
        setCartItems((prev) =>
          prev.filter((item) => !selectedItems.includes(item.id))
        );
        setSelectedItems([]);
        setTransactionId(data.transaction_id);
        setOrderCode(data.order_code);
        setUserData({ full_name: data.full_name, email: data.email });
        setShowOrderModal(true);

        return true;
      } else {
        Alert.alert("Error", data.message || "Checkout failed. Try again.");
        return false;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      Alert.alert("Error", "Something went wrong during checkout.");
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

  const clearCheckedItems = async () => {
    try {
      if (selectedItems.length === 0) return;

      // selectedItems contains cart_item IDs
      await authFetch(`${API_BASE}/api/cart/clear-checked`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemIds: selectedItems }),
      });

      // ✅ Update UI
      setCartItems(prev =>
        prev.filter(item => !selectedItems.includes(item.id))
      );

      setSelectedItems([]);
    } catch (err) {
      console.error("Failed to clear checked items:", err);
    }
  };

  const updateQuantity = async (item: CartItem, newQty: number) => {
    const token = await AsyncStorage.getItem("token");

    if (newQty <= 0) {
      // Remove item
      await authFetch(`${API_BASE}/api/cart/${item.id}`, {
        method: "DELETE",
      });
      setCartItems(prev => prev.filter(x => x.id !== item.id));
    } else {
      // Update quantity
      await authFetch(`${API_BASE}/api/cart/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      const response = await authFetch(`${API_BASE}/api/cart/${editItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

  const calculateFreeDrinks = (totalDrinks: number) => {
    const threshold = 10;
    return Math.floor(totalDrinks / threshold);
  };

  const displayedCartItems = [
    ...freeItems,
    ...cartItems.filter(i => !i.is_free),
  ];

  function setSelectedOrder(order: any) {
    setSelectedOrderState(order);
  }

  function parseBackendTimestamp(val: any): Date | null {
    if (!val) return null;
    const s = String(val);
    // If it already has a T, keep it; otherwise replace first space with T
    let normalized = s.includes("T") ? s : s.replace(" ", "T");
    // If there are multiple spaces (rare), replace the first space only:
    // normalized = s.replace(" ", "T");

    // Try creating a Date
    const d = new Date(normalized);
    if (!isNaN(d.getTime())) return d;

    // fallback: trim fractional microseconds (e.g. .733567 -> .733)
    const dotIndex = normalized.indexOf(".");
    if (dotIndex !== -1) {
      const prefix = normalized.slice(0, dotIndex + 4); // keep up to 3ms digits
      const fallback = new Date(prefix);
      if (!isNaN(fallback.getTime())) return fallback;
    }

    // last fallback: manual parse of "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD HH:mm:ss.ssssss"
    const parts = s.split(/[- :\.T]/).map(Number);
    // parts -> [yyyy, mm, dd, hh, mm, ss, ms?]
    if (parts.length >= 6 && parts.every((p) => !isNaN(p))) {
      const [year, month, day, hour, minute, second] = parts;
      const ms = parts.length >= 7 ? parts[6] : 0;
      const manual = new Date(year, month - 1, day, hour, minute, second, ms);
      if (!isNaN(manual.getTime())) return manual;
    }

    return null;
  }

  const selectedCartItemsForCheckout = cartItems.filter(item =>
    selectedItems.includes(item.id)
  );

  const itemsWithDates = displayedCartItems.map((item: any) => {
    const parsed = parseBackendTimestamp(item.created_at);
    const ms = parsed && !isNaN(parsed.getTime()) ? parsed.getTime() : 0;
    const formattedDate = parsed
      ? parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "Unknown Date";

    return {
      ...item,
      _parsedDate: parsed,
      _parsedMs: ms,
      _dateKey: formattedDate,
    };
  });

  // Debug logging so you can verify what's being used for sorting
  console.log("itemsWithDates (id, raw created_at, parsedMs):");
  itemsWithDates.forEach((it: any) =>
    console.log(`#${it.id}`, it.created_at, "=>", it._parsedDate ? it._parsedDate.toISOString() : null, it._parsedMs)
  );

  const map = new Map<string, any[]>();
  itemsWithDates.forEach((it: any) => {
    const key = it._dateKey || "Unknown Date";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  });

  // Convert map to array of groups so we can sort reliably by timestamp
  let groupedArray = Array.from(map.entries()).map(([dateKey, items]) => {
    // compute representative timestamp for the group (use max ms so group date sorts by newest item)
    const dateMs = items.reduce((max: number, it: any) => Math.max(max, it._parsedMs || 0), 0);
    return { dateKey, items, dateMs };
  });

  // Sort items inside each group (newest first or oldest first)
  groupedArray.forEach((g) => {
    g.items.sort((a: any, b: any) => {
      const aMs = a._parsedMs || 0;
      const bMs = b._parsedMs || 0;
      // when sortOrder === "newest", show newest (larger ms) first inside group
      return sortOrder === "newest" ? bMs - aMs : aMs - bMs;
    });
  });

  // Sort groups by dateMs according to sortOrder
  groupedArray.sort((a, b) => (sortOrder === "newest" ? b.dateMs - a.dateMs : a.dateMs - b.dateMs));

  // Debug group order
  console.log("groupedArray order (dateKey => dateMs):", groupedArray.map(g => [g.dateKey, g.dateMs]));

  useEffect(() => {
    const loadLoyalty = async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/loyalty/status`);
        const text = await res.text();

        console.log("LOYALTY STATUS RAW:", text);

        if (!res.ok) return;

        const data = JSON.parse(text);
        setFreeDrinkAllowance(Number(data.free_drinks || 0));
      } catch (err) {
        console.error("Failed to load loyalty:", err);
        setFreeDrinkAllowance(0);
      }
    };

    loadLoyalty();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      {showLoyalty ? (
        // Loyalty Header
        <View style={styles.checkoutHeader}>
          <TouchableOpacity
            onPress={() => setShowLoyalty(false)}
            style={styles.backBtn}
          >
            <Icon name="arrow-back-outline" size={22} color="#76B13A" />
          </TouchableOpacity>
          <Text style={styles.checkoutHeaderTitle}>Loyalty Points</Text>
        </View> 
      ) : showCheckoutTab ? (
        // Checkout Header
        <View style={styles.checkoutHeader}>
          <TouchableOpacity
            onPress={() => setShowCheckoutTab(false)}
            style={styles.backBtn}
          >
            <Icon name="arrow-back-outline" size={22} color="#76B13A" />
          </TouchableOpacity>
          <Text style={styles.checkoutHeaderTitle}>Checkout</Text>
        </View>
      ) : (
        // Default (Cart) Header
        <Header title="Cart" active={!showCheckoutTab && !showLoyalty} />
      )}

      {/* Main Content */}
      {!showLoyalty && !showCheckoutTab && !showOrderConfirmTab ? (
        <>
          {/* Toggle bar (Pending Orders / View Cart) */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, showPending && styles.activeTab]}
              onPress={() => setShowPending(true)}
            >
              <Text
                style={[styles.toggleText, showPending && styles.activeText]}
              >
                Pending Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, !showPending && styles.activeTab]}
              onPress={() => setShowPending(false)}
            >
              <Text
                style={[styles.toggleText, !showPending && styles.activeText]}
              >
                View Cart
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sort By Dropdown (floating) */}
          {!showPending && (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => setSortDropdownVisible(!sortDropdownVisible)}
                style={styles.sortDropdownButton}
              >
                <Text style={styles.sortDropdownText}>
                  {sortOrder === "newest"
                    ? "Sort By: Newest"
                    : sortOrder === "oldest"
                    ? "Sort By: Oldest"
                    : "Sort By"}
                </Text>
                <Icon
                  name={sortDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"}
                  size={18}
                  color="#333"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>

              {sortDropdownVisible && (
                <View style={styles.sortDropdownOverlay}>
                  <View style={styles.sortDropdownMenu}>
                    <TouchableOpacity
                      onPress={() => {
                        setSortOrder("newest");
                        setSortDropdownVisible(false);
                      }}
                      style={[
                        styles.sortDropdownItem,
                        sortOrder === "newest" && styles.sortDropdownItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sortDropdownItemText,
                          sortOrder === "newest" && styles.sortDropdownItemTextActive,
                        ]}
                      >
                        Newest
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setSortOrder("oldest");
                        setSortDropdownVisible(false);
                      }}
                      style={[
                        styles.sortDropdownItem,
                        sortOrder === "oldest" && styles.sortDropdownItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sortDropdownItemText,
                          sortOrder === "oldest" && styles.sortDropdownItemTextActive,
                        ]}
                      >
                        Oldest
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {!showPending ? (
            <View style={{ flex: 1, }}>
              <ScrollView style={{ padding: 16 }}>
                {groupedArray.length > 0 ? (
                  groupedArray.map((group) => (
                    <View key={group.dateKey}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          marginBottom: 8,
                          color: "#333",
                        }}
                      >
                        {group.dateKey}
                      </Text>

                      {group.items.map((item: any) => {
                        let imageSource: any = require("../../assets/MiAmore2.png");
                        if (item.image) {
                          if (
                            typeof item.image === "string" &&
                            (item.image.startsWith("http://") ||
                              item.image.startsWith("https://"))
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
                            {/* Checkbox */}
                            <TouchableOpacity
                              style={[styles.checkbox, isSelected && styles.checkboxChecked]}
                              onPress={() => toggleSelectItem(item.id)}
                            >
                              {isSelected && <Icon name="checkmark" size={14} color="#fff" />}
                            </TouchableOpacity>

                            {/* Edit + Trash */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                right: 10,
                                top: 10,
                              }}
                            >
                              <TouchableOpacity
                                style={[styles.editIconContainer, { marginRight: 10 }]}
                                onPress={() => openEditModal(item)}
                              >
                                <Icon name="create-outline" size={20} color="#000" />
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.trashIconContainer}
                                onPress={() => toggleTrashItem(item.id)}
                              >
                                <Icon
                                  name="trash-outline"
                                  size={20}
                                  color={
                                    toggledTrashItems.includes(item.id) ? "red" : "#000"
                                  }
                                />
                              </TouchableOpacity>
                            </View>

                            {/* Product info */}
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
                      })}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      Your cart is currently empty. Want to add something to the mix?
                    </Text>
                    <TouchableOpacity
                      style={styles.goToMenuButton}
                      onPress={() => navigation.navigate("Menu")}
                    >
                      <Text style={styles.goToMenuButtonText}>Go to Menu</Text>
                    </TouchableOpacity>
                  </View>
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
                </View>

                {loyaltyEnabled && freeDrinkAllowance > 0 && (
                  <TouchableOpacity
                    style={styles.rewardBtn}
                    onPress={() => navigation.navigate("Menu", { useReward: true })}
                  >
                    <Text style={styles.rewardBtnText}>
                      Choose Reward ({freeDrinkAllowance})
                    </Text>
                  </TouchableOpacity>
                )}

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
                  disabled={selectedItems.length === 0}
                  style={[
                    styles.checkoutBtn,
                    selectedItems.length === 0 && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    setFulfillmentMethod(null);
                    setShowCheckoutTab(true);
                  }}
                >
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView style={{ padding: 16 }}>
                {pendingOrders.length > 0 ? (
                  pendingOrders.map((order) => (
                    <TouchableOpacity
                      key={order.id}
                      style={styles.pendingCard}
                      onPress={() => {
                        setSelectedOrder(order);
                        setShowOrderDetailsModal(true);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.orderCode}>{order.order_code}</Text>
                      </View>
                      <Text style={styles.orderDetail}>
                        ₱{Number(order.total_amount).toFixed(2)} •{" "}
                        {order.payment_method}
                      </Text>
                      <Text style={styles.orderDate}>
                        {new Date(order.created_at).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ textAlign: "center", marginTop: 50 }}>
                    You have no pending orders
                  </Text>
                )}
              </ScrollView>
          )}
        </>
      ) : showLoyalty ? (
        // Loyalty Points Page
        <ScrollView style={{ padding: 16 }}>
          <View style={styles.loyaltyContainer}>
            <Text style={styles.sectionTitle}>
              Loyalty Progress <Text style={{ fontWeight: "400" }}>(Drinks Ordered)</Text>
            </Text>
            <Text style={styles.sectionSubtitle}>
              Buy 10 drinks to earn 1 free drink — your progress so far:
            </Text>

            {/* Progress Dots */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    marginHorizontal: 4,
                    backgroundColor: i < loyaltyProgress ? "#76B13A" : "#ddd",
                  }}
                />
              ))}
            </View>

            {/* Reward Info */}
            {loyaltyRewards > 0 ? (
              <>
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600", color: "#76B13A" }}>
                  🎉 You’ve earned {loyaltyRewards} free drink{loyaltyRewards > 1 ? "s" : ""}!
                </Text>
                <Text style={{ textAlign: "center", fontSize: 14, color: "#555", marginTop: 4 }}>
                  You can claim your reward during your next checkout.
                </Text>
              </>
            ) : (
              <Text style={{ textAlign: "center", fontSize: 14, color: "#777" }}>
                Keep going! Order {10 - loyaltyProgress} more drink{10 - loyaltyProgress > 1 ? "s" : ""} to earn your free one.
              </Text>
            )}

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 24 }} />


            {/* Enable Loyalty Reward */}
            <View style={styles.loyaltyToggleRow}>
              <Text style={styles.sectionTitle}>Enable Loyalty Reward</Text>

              <Switch
                value={loyaltyEnabled}
                onValueChange={(value) => {
                  setLoyaltyEnabled(value);

                  if (!value) {
                    setFreeItems([]);
                  }
                }}
              />
            </View>

            {loyaltyEnabled && (
              <Text style={styles.subTextCentered}>
                You can claim up to {freeDrinkAllowance} free drink(s)
              </Text>
            )}

            {/* Points Info (optional, keep your old look) */}
            <View style={styles.pointsInfoBox}>
              <Text style={styles.pointsText}>
                Total Drinks Ordered: <Text style={styles.pointsValue}>{loyaltyProgress + loyaltyRewards * 10}</Text>
              </Text>
              <Text style={styles.pointsText}>
                Free Drinks Earned: <Text style={styles.pointsValue}>{loyaltyRewards}</Text>
              </Text>
            </View>

            <Text style={styles.autoText}>
              *Rewards reset after every 10 drinks — progress carries over automatically
            </Text>
          </View>
        </ScrollView>
      ) : showCheckoutTab && !showOrderConfirmTab ? (
        <CheckoutTab
          initialStep={initialStep}
          userData={userData}
          address={address}
          setAddress={setAddress}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          fulfillmentMethod={fulfillmentMethod}              
          setFulfillmentMethod={setFulfillmentMethod}  
          handleCheckout={handleCheckout}
          subtotal={cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
          }
          totalAmount={cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
          }
          onEditAddress={() => setShowAddressModal(true)}
          clearCheckedItems={clearCheckedItems}
          cartItems={selectedCartItemsForCheckout} 
        />
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
                <Text style={styles.confirmLink}>5-10 minutes</Text>
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

      {/* Order Details Modal */}
      <Modal visible={showOrderDetailsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.editModalBox}>
            <Text style={styles.editModalTitle}>Order Details</Text>

            {selectedOrder && (
              <>
                <Text style={styles.editModalPrice}>
                  ₱{Number(selectedOrder.total_amount).toFixed(2)}
                </Text>

                <View style={styles.sectionLabelRow}>
                  <Text style={styles.sectionLabel}>Order Info</Text>
                </View>

                <Text style={styles.confirmText}>
                  <Text style={styles.confirmLabel}>Order Code: </Text>
                  {selectedOrder.order_code}
                </Text>

                <Text style={styles.confirmText}>
                  <Text style={styles.confirmLabel}>Payment Method: </Text>
                  {selectedOrder.payment_method}
                </Text>

                <Text style={styles.confirmText}>
                  <Text style={styles.confirmLabel}>Date Ordered: </Text>
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </Text>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#76B13A" }]}
                onPress={() => setShowOrderDetailsModal(false)}
              >
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
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
                    await authFetch(`${API_BASE}/api/cart/${id}`, {
                      method: "DELETE",
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
                tab === "Cart"
                  ? "cart"
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
  checkoutHeader: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    elevation: 3,
  },
  backBtn: {
    marginRight: 10,
  },
  checkoutHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
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
  
  sortDropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#76B13A",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    elevation: 2,
    zIndex: 10,
  },
  sortDropdownText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  sortDropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    width: 160,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sortDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sortDropdownItemActive: {
    backgroundColor: "#E9F7E3",
  },
  sortDropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  sortDropdownItemTextActive: {
    color: "#76B13A",
    fontWeight: "700",
  },
  sortDropdownOverlay: {
    position: "absolute",
    top: 45, // positions below button
    zIndex: 999,
    elevation: 999,
  },

  toggleContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 6,
  },
  toggleText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#76B13A",
  },
  activeText: {
    color: "#76B13A",
    fontWeight: "700",
  },
  pendingCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  orderCode: { fontWeight: "700", color: "#333" },
  orderStatus: { color: "#76B13A", fontWeight: "600" },
  orderDetail: { color: "#666", fontSize: 13, marginTop: 4 },
  orderDate: { color: "#999", fontSize: 12, marginTop: 2 },

  loyaltyCard: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  loyaltyToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    marginTop: 4,     
    marginBottom: 8, 
  },

  subTextCentered: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

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
  rewardBtn: {
    backgroundColor: "#76B13A",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // Android shadow
  },

  rewardBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
  sectionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  goToMenuButton: {
    backgroundColor: "#8B4513", 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  goToMenuButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
    marginTop: 4, 
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


