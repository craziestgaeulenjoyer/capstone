import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import GuestNavBarLayout from "@/layouts/navbar_layouts/GuestNavBar_Layout";
import Footer from "@/components/footer/Footer_MiAmore";
import axiosClient from "@/axiosClient";

interface Customer {
  full_name: string;
  email: string;
}

const CheckoutReviewPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer>({ full_name: "", email: "" });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentInfo, setPaymentInfo] = useState({ address: "", phone: "", payment_type: "cash" });
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axiosClient.get("/customer/profile");
        const customerData = profileRes.data.customer;
        setCustomer({
          full_name: customerData.full_name || "",
          email: customerData.email || "",
        });

        const cartRes = await axiosClient.get("/cart/items");
        setCartItems(cartRes.data.items);

        setPaymentInfo({
          address: localStorage.getItem("address") || "",
          phone: localStorage.getItem("phone") || "",
          payment_type: localStorage.getItem("payment_type") || "cash",
        });

      } catch (err) {
        console.error(err);
        router.visit("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ============================
      ✅ FEE LOGIC (COD ONLY)
     ============================ */
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
  
  // Only add 50 pesos if the payment type is exactly 'cod'

  const total = subtotal ;

  const formatPeso = (amount: number) => `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const handlePlaceOrder = async () => {
    try {
      await axiosClient.post("/order/confirm", {
        phone: paymentInfo.phone,
        address: paymentInfo.address,
        payment_type: paymentInfo.payment_type,
      
        total_amount: total,
      });

      setShowThankYou(true);
      localStorage.removeItem("address");
      localStorage.removeItem("phone");
      localStorage.removeItem("payment_type");
    } catch (err) {
      alert("Order placement failed.");
      console.error(err);
    }
  };

  if (loading) return (
    <GuestNavBarLayout>
      <div className="mt-32 text-center text-gray-500 font-medium italic">Preparing your receipt...</div>
    </GuestNavBarLayout>
  );

  return (
    <GuestNavBarLayout>
      <div className="min-h-screen bg-[#FDFCF8] pt-32 pb-20 px-6 font-sans text-black">
        <div className="max-w-md mx-auto bg-white shadow-2xl border border-gray-100 relative overflow-hidden rounded-t-sm">
          <div className="h-1.5 w-full bg-[#424242]"></div>
          
          <div className="p-8">
            <div className="text-center mb-10">
              <h2 className="font-serif italic text-3xl text-black">Mi Amore</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2 font-bold">Review Order Receipt</p>
            </div>

            {/* Information Section */}
            <div className="text-[11px] mb-8 border-b border-dashed border-gray-200 pb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="uppercase text-gray-400 font-bold">Customer Name</span>
                  <span className="text-black font-bold uppercase">{customer.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase text-gray-400 font-bold">Contact</span>
                  <span className="text-black font-bold">{paymentInfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase text-gray-400 font-bold">Payment Method</span>
                  <span className="text-black font-bold uppercase">
                    {paymentInfo.payment_type === 'cash' ? 'Store Pickup' : 
                     paymentInfo.payment_type === 'cod' ? 'Cash on Delivery' : 'GCash'}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="uppercase text-gray-400 font-bold block mb-1">Address</span>
                  <p className="text-black font-medium italic leading-relaxed">{paymentInfo.address}</p>
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-10">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-black font-medium">{item.product_name}</span>
                    <span className="text-[10px] text-gray-400 italic">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-black">{formatPeso(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t-2 border-gray-100 pt-6 space-y-2 mb-10">
              <div className="flex justify-between text-xs text-gray-400 font-bold">
                <span>SUBTOTAL</span>
                <span className="text-black">{formatPeso(subtotal)}</span>
              </div>
              
            

              <div className="flex justify-between text-2xl font-black text-black border-t pt-4">
                <span>TOTAL</span>
                <span>{formatPeso(total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handlePlaceOrder} 
                className="w-full bg-[#8cb662] hover:bg-[#7aa354] text-white py-4 font-bold uppercase tracking-widest shadow-lg transition-all"
              >
                Confirm & Place Order
              </button>
              
              <button 
                onClick={() => router.visit("/payment")} 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Return to Details
              </button>
            </div>
          </div>
          
          <div className="w-full h-4 flex justify-between px-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-[#FDFCF8] rounded-full -mt-2 border border-gray-50"></div>
            ))}
          </div>
        </div>
      </div>

      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFCF8]/95 backdrop-blur-md text-center">
            <div className="p-10">
                <div className="w-16 h-16 bg-[#8cb662] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">✓</div>
                <h2 className="font-serif italic text-5xl text-black mb-4">Merci!</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-10 font-bold">Order placed successfully</p>
                <button onClick={() => router.visit("/home")} className="bg-[#424242] text-white px-12 py-3 text-[10px] font-bold uppercase tracking-widest">Back to Home</button>
            </div>
        </div>
      )}
      <Footer />
    </GuestNavBarLayout>
  );
};

export default CheckoutReviewPage;