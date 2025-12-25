import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import GuestNavBarLayout from "@/layouts/navbar_layouts/GuestNavBar_Layout";
import Footer from "@/components/footer/Footer_MiAmore";
import axiosClient from "@/axiosClient";

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface PaymentInfo {
  address: string;
  phone: string;
  payment_type: string;
  picture?: File | null;
  loyalty_discount?: number;
}

interface Customer {
  full_name: string;
  email: string;
}

const steps = ["Cart", "Payment", "Loyalty", "Confirm", "Success"];

const CheckoutReviewPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ full_name: "", email: "" });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    address: "",
    phone: "",
    payment_type: "cod",
    loyalty_discount: 0,
  });
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("customer_token");
      if (!token) return router.visit("/signin");

      try {
        const customerRes = await axiosClient.get("/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer({
          full_name: customerRes.data.customer.full_name,
          email: customerRes.data.customer.email,
        });

        const cartRes = await axiosClient.get("/api/cart/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartRes.data.items);

        const savedAddress = localStorage.getItem("address") || "";
        const savedPhone = localStorage.getItem("phone") || "";
        const savedPaymentType = localStorage.getItem("payment_type") || "cash";
        const savedDiscount = localStorage.getItem("loyalty_discount");

        setPaymentInfo({
          address: savedAddress,
          phone: savedPhone,
          payment_type: savedPaymentType,
          loyalty_discount: savedDiscount ? Number(savedDiscount) : 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = sub * 0.1;
    const discount = paymentInfo.loyalty_discount || 0;
    setSubtotal(sub);
    setTaxes(tax);
    setTotal(sub + tax - discount);
  }, [cartItems, paymentInfo]);

  const formatPeso = (amount: number) => `₱${amount.toFixed(2)}`;

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("customer_token");
    if (!token) return router.visit("/signin");

    try {
      await axiosClient.post(
        "/api/order/store",
        {
          subtotal,
          taxes,
          loyalty_discount: paymentInfo.loyalty_discount || 0,
          total,
          payment_type: paymentInfo.payment_type,
          address: paymentInfo.address,
          phone: paymentInfo.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowThankYou(true);
    } catch (err: any) {
      console.log("Place order failed:", err.response?.data?.message || err.message);
      alert("Failed to place order.");
    }
  };

  return (
    <GuestNavBarLayout>
      <div className="min-h-screen bg-white p-6 pt-24 max-w-6xl mx-auto font-sans">
        
        {/* Stepper Section */}
        <div className="flex items-center justify-center mb-12 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    index <= 3 ? "bg-[#8cb662] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-tighter ${index <= 3 ? "text-gray-800" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 mb-4 bg-gray-100 relative">
                  <div
                    className={`absolute top-0 left-0 h-full bg-[#8cb662] transition-all duration-500 ${
                      index < 3 ? "w-full" : "w-0"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Top Summary Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4">
          <div>
            <h1 className="text-[22px] font-bold text-gray-800">Payment Confirmation</h1>
            <p className="text-[11px] text-[#4A90E2] font-semibold tracking-wide uppercase">#USR-001293</p>
          </div>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-gray-500 font-medium">Order Total:</span>
              <span className="text-[20px] font-bold text-gray-900">{formatPeso(total)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-[#8CB662] hover:bg-[#7da357] text-white px-10 py-2.5 rounded-[6px] font-bold text-sm transition shadow-sm"
            >
              Place Order
            </button>
          </div>
        </div>

        {/* Main Review Card */}
        <div className="bg-white border border-gray-100 rounded-sm p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
            
            {/* Column 1: Your Information & Payment */}
            <div className="space-y-10">
              <section>
                <div className="border-b border-dashed border-gray-300 pb-2 mb-4 flex justify-between items-center">
                  <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">Your Information</h2>
                  <button onClick={() => router.visit('/payment')} className="text-[#4A90E2] text-[11px] font-bold hover:underline">Edit</button>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-semibold text-gray-800">{customer.full_name}</p>
                  <p className="text-[13px] text-gray-500 font-medium">{customer.email}</p>
                  <p className="text-[13px] text-gray-500 font-medium">{paymentInfo.phone}</p>
                </div>
              </section>

              <section>
                <div className="border-b border-dashed border-gray-300 pb-2 mb-4 flex justify-between items-center">
                  <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">Payment</h2>
                  <button onClick={() => router.visit('/payment')} className="text-[#4A90E2] text-[11px] font-bold hover:underline">Edit</button>
                </div>
                <div className="border border-gray-100 rounded-[8px] p-4 flex items-center justify-between bg-[#F9FAFB]">
                   <div className="flex items-center gap-3">
                      <div className="text-[#0052CC] font-black italic text-[16px] tracking-tighter uppercase">{paymentInfo.payment_type}</div>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">Securely pay via your chosen<br/>payment method.</p>
                   </div>
                </div>
              </section>
            </div>

            {/* Column 2: Shipping Address */}
            <div className="space-y-10">
              <section>
                <div className="border-b border-dashed border-gray-300 pb-2 mb-4 flex justify-between items-center">
                  <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">Shipping Address</h2>
                  <button onClick={() => router.visit('/payment')} className="text-[#4A90E2] text-[11px] font-bold hover:underline">Edit</button>
                </div>
                <div className="text-[13px] text-gray-500 leading-relaxed font-medium">
                  <p className="max-w-xs">{paymentInfo.address}</p>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-[12px] p-10 max-w-[360px] mx-auto shadow-2xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-[#F0FDF4] text-[#8CB662] rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-2xl">✓</div>
            <h2 className="text-[22px] font-black text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-[13px] text-gray-500 font-medium mb-8">Your order has been successfully placed.</p>
            <button onClick={() => router.visit("/home")} className="w-full bg-[#8CB662] hover:bg-[#7da357] text-white py-3.5 rounded-[8px] font-bold text-sm transition-all">
              Return to Home
            </button>
          </div>
        </div>
      )}

      <Footer />
    </GuestNavBarLayout>
  );
};

export default CheckoutReviewPage;