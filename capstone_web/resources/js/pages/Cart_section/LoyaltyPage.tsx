import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import axiosClient from "@/axiosClient";
import GuestNavBarLayout from "@/layouts/navbar_layouts/GuestNavBar_Layout";
import Footer from "@/components/footer/Footer_MiAmore";

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

const steps = ["Cart", "Payment", "Loyalty", "Confirm", "Success"];

const LoyaltyPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [useLoyalty, setUseLoyalty] = useState(false); // UI Toggle state
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("customer_token");
      if (!token) return router.visit("/signin");

      try {
        const cartRes = await axiosClient.get("/api/cart/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartRes.data.items || []);

        const loyaltyRes = await axiosClient.get("/api/customer/loyalty-points", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaxPoints(loyaltyRes.data.points || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = sub * 0.1;
    setSubtotal(sub);
    setTaxes(tax);
    setTotal(sub + tax - loyaltyDiscount);
  }, [cartItems, loyaltyDiscount]);

  // Sync logic with the new toggle UI
  const handleToggleLoyalty = () => {
    const newState = !useLoyalty;
    setUseLoyalty(newState);
    if (newState) {
      // Logic: apply all available points up to the total cost
      const discount = Math.min(maxPoints, subtotal + taxes);
      setLoyaltyDiscount(discount);
      localStorage.setItem("loyalty_discount", discount.toString());
    } else {
      setLoyaltyDiscount(0);
      localStorage.removeItem("loyalty_discount");
    }
  };

  const formatPeso = (amount: number) => `₱${amount.toFixed(2)}`;
  const handleNext = () => router.visit("/checkout");
  const handleBack = () => router.visit("/payment");

  return (
    <GuestNavBarLayout>
      <div className="min-h-screen bg-white p-6 pt-24 max-w-4xl mx-auto font-sans">
        {/* Header Section */}
        <div className="mb-8 px-4">
          <h1 className="text-xl font-bold text-gray-800">Apply Promo or Loyalty Points (Optional)</h1>
          <p className="text-gray-500 text-sm">Boost your savings with promo codes or loyalty rewards</p>
        </div>

        {/* Layout Container matching image_e106b6.png */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Promo Code Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Enter Promo Code</label>
            <div className="flex gap-4 max-w-md">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g SAVE10"
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8cb662]"
              />
              <button className="bg-[#8B6E5C] hover:bg-[#725a4b] text-white px-8 py-2 rounded-md font-bold text-sm transition">
                Apply
              </button>
            </div>
          </div>

          {/* Loyalty Points Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Custom Toggle Switch */}
              <button 
                onClick={handleToggleLoyalty}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useLoyalty ? 'bg-[#8cb662]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useLoyalty ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-semibold text-gray-700">Use My Loyalty Points</span>
            </div>

            <div className="flex gap-8 text-sm pl-2">
              <p className="text-gray-600">You have: <span className="font-bold text-[#8B6E5C]">{maxPoints} points</span></p>
              <p className="text-gray-600">Equivalent: <span className="font-bold text-[#8B6E5C]">{maxPoints} discount</span></p>
            </div>

            <p className="text-[#0066FF] text-[11px] italic">
              * Loyalty points will automatically be applied to this order
            </p>

            {/* Reference ID Component matching bottom of image */}
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded px-3 py-1 mt-2">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] text-gray-500">Automated list to user @ <span className="text-[#8cb662] font-mono">MI-09-091293</span></span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-10 px-4 justify-start">
          <button
            onClick={handleBack}
            className="px-10 py-2.5 bg-[#E0E0E0] hover:bg-gray-300 text-gray-600 font-bold rounded-md text-sm transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-10 py-2.5 bg-[#8cb662] hover:bg-[#7aa354] text-white font-bold rounded-md text-sm transition shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </GuestNavBarLayout>
  );
};

export default LoyaltyPage;