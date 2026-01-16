import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { authFetch } from "../../utils/authFetch";
import { API_BASE } from "../../config/api";
import { useEffect } from "react";

interface CheckoutTabProps {
  userData: any;
  subtotal: number;
  totalAmount: number;
  address: string;
  setAddress: (v: string) => void;
  selectedPayment: string;
  setSelectedPayment: (v: string) => void;
  fulfillmentMethod: "delivery" | "pickup" | null;  
  setFulfillmentMethod: (v: "delivery" | "pickup") => void;
  handleCheckout: () => Promise<{ order_code: string } | false>;
  onEditAddress: () => void;
  clearCheckedItems: () => void;
  cartItems: any[];
  initialStep?: number | string;
}

const CheckoutTab: React.FC<CheckoutTabProps> = ({
  userData,
  subtotal,
  totalAmount,
  address,
  selectedPayment,
  setSelectedPayment,
  fulfillmentMethod,          
  setFulfillmentMethod,     
  handleCheckout,
  onEditAddress,
  cartItems,
  initialStep,
  clearCheckedItems,
}) => {
  const navigation = useNavigation<any>();

  const stepMap: Record<string, number> = {
    details: 1,
    payment: 2,
    confirm: 3,
  };

  const [step, setStep] = useState(() => {
    if (typeof initialStep === "number") return initialStep;
    if (typeof initialStep === "string") return stepMap[initialStep] ?? 1;
    return 1;
  });

  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashError, setGcashError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [gcashModalVisible, setGcashModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Step 1 → Proceed button
  const proceedToPayment = () => {
    setStep(2);
  };

  // Step 2 → Handle GCash modal + OTP flow
  const handleProceedPayment = async () => {
    if (!fulfillmentMethod) {
      Alert.alert("Select Fulfillment Method", "Please choose delivery or pickup.");
      return;
    }

    if (selectedPayment === "GCash") {
      setGcashModalVisible(true);
    } else if (selectedPayment === "Pay on Pickup") {
      setStep(3);
    } else {
      Alert.alert("Select Payment", "Please choose a payment method.");
    }
  };

  const handleSendOtp = async () => {
    if (!gcashNumber.trim() || gcashNumber.length !== 11) {
      setGcashError("Please enter a valid 11-digit GCash number.");
      return;
    }

    setGcashError("");
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await authFetch(`${API_BASE}/api/gcash/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData?.email }),
      });

      const text = await res.text(); // ✅ SAFE
      let data: any = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ Non-JSON response from server:", text);
        Alert.alert("Server Error", "Invalid server response.");
        return;
      }

      if (res.ok) {
        setGcashModalVisible(false);
        setOtpModalVisible(true);
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      Alert.alert("Network Error", "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setOtpError("Enter a valid 6-digit OTP.");
      return;
    }

    setOtpError("");
    setLoading(true);

    try {
      const res = await authFetch(`${API_BASE}/api/gcash/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData?.email,
          otp,
        }),
      });

      const data = await res.json();

      if (data.verified) {
        setSelectedPayment("GCash");
        setOtpModalVisible(false);
        setStep(3);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setOtpError("Something went wrong verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const checkoutResult = await handleCheckout();
      if (!checkoutResult) return;

      // 🔒 FAILSAFE — MARK CART AS CLEARED
      await AsyncStorage.setItem("cartCleared", "true");

      // 🔹 GCash payment flow
      if (selectedPayment === "GCash") {
        const res = await authFetch(`${API_BASE}/api/paymongo/gcash`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100),
            phone_number: gcashNumber,
            order_code: checkoutResult.order_code,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.redirect_url) {
          Alert.alert("Payment Error", "Unable to start GCash payment.");
          return;
        }

        Linking.openURL(data.redirect_url);
        return; // ❗ DO NOT CLEAR CART HERE AGAIN
      }

      // 🔹 Pay on Pickup
      clearCheckedItems();
      setOrderConfirmed(true);

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }, 1500);

    } catch (err) {
      console.error("Checkout error:", err);
      Alert.alert("Error", "Something went wrong confirming your order.");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    let title = "Checkout";
    if (step === 1) title = "Order Details";
    else if (step === 2) title = "Payment Confirmation";
    else if (step === 3) title = "Review Your Order";
    return (
      <View style={styles.header}>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)}>
            <Icon name="arrow-back-outline" size={22} color="#76B13A" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    );
  };

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (!url) return;

      if (url.includes("payment-success")) {
        setOrderConfirmed(true); 

        setTimeout(() => {
          clearCheckedItems();   
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }, 1500); 
      }

      if (url.includes("payment-failed")) {
        Alert.alert("Payment Failed", "GCash payment was not completed.");
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  // -------- STEP SCREENS ---------
  const renderStep1 = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.checkoutCard}>
          <View style={styles.cardHeader}>
            <Icon name="person-circle-outline" size={20} color="#76B13A" />
            <Text style={styles.cardHeaderText}>Your Information</Text>
          </View>
          <Text style={styles.cardText}>{userData?.full_name}</Text>
          <Text style={styles.cardSubText}>{userData?.email}</Text>
        </View>

        <View style={styles.checkoutCard}>
          <View style={styles.cardHeader}>
            <Icon name="home-outline" size={20} color="#76B13A" />
            <Text style={styles.cardHeaderText}>Delivery Details</Text>
          </View>
          <View style={{ marginTop: 4 }}>
            <View style={styles.infoRow}>
              <Icon name="call-outline" size={18} color="#76B13A" style={{ marginRight: 6 }} />
              <Text style={styles.cardText}>
                (+63) {userData?.phone_number || "No phone number yet."}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location-outline" size={18} color="#76B13A" style={{ marginRight: 6 }} />
              <Text style={styles.cardText}>
                {address && address.trim() !== "" ? address : "No address yet."}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editAddressBtn} onPress={onEditAddress}>
            <Icon name="create-outline" size={16} color="#fff" />
            <Text style={styles.editAddressText}>Edit Address</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.checkoutCard}>
          <View style={styles.cardHeader}>
            <Icon name="cart-outline" size={20} color="#76B13A" />
            <Text style={styles.cardHeaderText}>Your Order</Text>
          </View>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.orderRow,
                  item.is_free && { borderColor: "#76B13A", borderWidth: 1, borderRadius: 8, padding: 8 },
                ]}
              >
                <Text style={styles.orderName}>
                  {item.product_name}
                  {item.type ? ` (${item.type})` : ""}
                </Text>
                <Text style={styles.orderQty}>x{item.quantity}</Text>
                {item.is_free && (
                  <Text style={{ color: "#76B13A", fontWeight: "bold", marginLeft: 8 }}>Free</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.cardSubText}>No items selected.</Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky bottom button */}
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.nextBtn} onPress={proceedToPayment}>
          <Text style={styles.nextBtnText}>Proceed to Payment Confirmation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.paymentLabel}>Payment Method</Text>

        {/* GCash */}
        <TouchableOpacity
          style={[
            styles.paymentOptionRow,
            selectedPayment === "GCash" && styles.paymentOptionSelected,
          ]}
          onPress={() => setSelectedPayment("GCash")}
        >
          <View style={styles.paymentLeftRow}>
            <Image source={require("../../assets/gcash.png")} style={styles.paymentIcon} />
            <View>
              <Text style={styles.paymentName}>GCash</Text>
              <Text style={styles.paymentDesc}>Pay securely using GCash mobile number.</Text>
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

        {/* Pay on Pickup */}
        <TouchableOpacity
          style={[
            styles.paymentOptionRow,
            selectedPayment === "Pay on Pickup" && styles.paymentOptionSelected,
          ]}
          onPress={() => setSelectedPayment("Pay on Pickup")}
        >
          <View style={styles.paymentLeftRow}>
            <Image source={require("../../assets/deliveryicon.png")} style={styles.paymentIcon} />
            <View>
              <Text style={styles.paymentName}>Pay on Pickup</Text>
              <Text style={styles.paymentDesc}>Pay at the counter when picking up your order.</Text>
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

        <Text style={styles.paymentLabel}>Fulfillment Method</Text>

        {/* To Deliver */}
        <TouchableOpacity
          style={[
            styles.paymentOptionRow,
            fulfillmentMethod === "delivery" && styles.paymentOptionSelected,
          ]}
          onPress={() => setFulfillmentMethod("delivery")}
        >
          <View style={styles.paymentLeftRow}>
            <Icon name="bicycle-outline" size={24} color="#76B13A" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.paymentName}>To Deliver</Text>
              <Text style={styles.paymentDesc}>Your order will be delivered to your address.</Text>
            </View>
          </View>
          <Icon
            name={fulfillmentMethod === "delivery" ? "radio-button-on-outline" : "radio-button-off-outline"}
            size={22}
            color={fulfillmentMethod === "delivery" ? "#76B13A" : "#999"}
          />
        </TouchableOpacity>

        {/* Pickup on Counter */}
        <TouchableOpacity
          style={[
            styles.paymentOptionRow,
            fulfillmentMethod === "pickup" && styles.paymentOptionSelected,
          ]}
          onPress={() => setFulfillmentMethod("pickup")}
        >
          <View style={styles.paymentLeftRow}>
            <Icon name="walk-outline" size={24} color="#76B13A" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.paymentName}>To Pickup on Counter</Text>
              <Text style={styles.paymentDesc}>Pick up your order personally at the counter.</Text>
            </View>
          </View>
          <Icon
            name={fulfillmentMethod === "pickup" ? "radio-button-on-outline" : "radio-button-off-outline"}
            size={22}
            color={fulfillmentMethod === "pickup" ? "#76B13A" : "#999"}
          />
        </TouchableOpacity>

        {/* Totals */}
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
      </ScrollView>

      {/* Sticky bottom button */}
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            isInitiatingPayment && { opacity: 0.6 }
          ]}
          disabled={isInitiatingPayment}
          onPress={async () => {
            if (isInitiatingPayment) return;
            setIsInitiatingPayment(true);

            try {
              await handleProceedPayment();
            } finally {
              setIsInitiatingPayment(false);
            }
          }}
        >
          <Text style={styles.nextBtnText}>Confirm Your Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.reviewBox}>
          <Text style={styles.reviewLabel}>Name:</Text>
          <Text>{userData?.full_name}</Text>
          <Text style={styles.reviewLabel}>Email:</Text>
          <Text>{userData?.email}</Text>
          <Text style={styles.reviewLabel}>Address:</Text>
          <Text>{address}</Text>
          <Text style={styles.reviewLabel}>Payment Method:</Text>
          <Text>{selectedPayment}</Text>
        </View>

        <View style={styles.reviewBox}>
          <Text style={styles.sectionTitle}>Ordered Products</Text>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <View key={index} style={styles.orderRow}>
                <Text style={styles.orderName}>
                  {item.product_name}
                  {item.type ? ` (${item.type})` : ""}
                </Text>
                <Text style={styles.orderQty}>x{item.quantity}</Text>
              </View>
            ))
          ) : (
            <Text>No items selected.</Text>
          )}
        </View>

        {/* Amount Summary */}
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
      </ScrollView>

      {/* Sticky bottom button */}
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            loading && { opacity: 0.6 }
          ]}
          disabled={loading}
          onPress={handleConfirmOrder}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextBtnText}>Confirm Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // --------- MAIN RENDER ---------
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {renderHeader()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* GCash Number Modal */}
      <Modal visible={gcashModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter GCash Number</Text>
            <TextInput
              style={[styles.input, gcashError && { borderColor: "red" }]}
              placeholder="09XXXXXXXXX"
              keyboardType="numeric"
              maxLength={11}
              value={gcashNumber}
              onChangeText={setGcashNumber}
            />
            {gcashError ? <Text style={styles.errorText}>{gcashError}</Text> : null}
            <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleSendOtp}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Proceed</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGcashModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* OTP Modal */}
      <Modal visible={otpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter 6-Digit OTP</Text>
            <TextInput
              style={[styles.input, otpError && { borderColor: "red" }]}
              placeholder="Enter OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
            <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleVerifyOtp}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Verify OTP</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Order Confirmed Modal */}
      <Modal visible={orderConfirmed} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Icon name="checkmark-circle" size={80} color="#76B13A" />
            <Text style={styles.modalTitle}>Order Confirmed!</Text>
            <Text style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
              Redirecting to Home...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutTab;

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginLeft: 10,
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
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  cardHeaderText: { fontSize: 15, fontWeight: "700", color: "#000", marginLeft: 6 },
  cardText: { fontSize: 14, color: "#333" },
  cardSubText: { fontSize: 12, color: "#777", marginTop: 2 },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  orderName: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  orderQty: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  editAddressBtn: {
    backgroundColor: "#76B13A",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginTop: 10,
  },
  editAddressText: { color: "#fff", fontSize: 13, fontWeight: "600", marginLeft: 4 },
  paymentLabel: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  paymentOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  paymentOptionSelected: { borderColor: "#76B13A", borderWidth: 2 },
  paymentLeftRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  paymentIcon: { width: 35, height: 35, resizeMode: "contain", marginRight: 10 },
  paymentName: { fontSize: 14, fontWeight: "700" },
  paymentDesc: { fontSize: 12, color: "#777", width: "85%" },
  amountBox: { borderTopWidth: 1, borderColor: "#eee", paddingTop: 10 },
  amountRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  amountText: { fontSize: 13, color: "#444" },
  amountValue: { fontSize: 13, color: "#444" },
  amountTotal: { fontWeight: "700", fontSize: 15, marginTop: 6 },
  amountTotalValue: { fontWeight: "700", fontSize: 15 },
  nextBtn: {
    backgroundColor: "#73C04D",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  footerButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 6,
  },
  modalBtnPrimary: {
    backgroundColor: "#76B13A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  modalBtnText: { color: "#fff", fontWeight: "700" },
  modalCancel: { color: "#777", marginTop: 8 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  reviewBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  reviewLabel: { fontWeight: "600", color: "#333", marginTop: 8 },
  sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 10 },
});
