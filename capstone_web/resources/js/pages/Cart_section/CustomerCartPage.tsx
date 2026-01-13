import React, { useEffect, useState } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { router, Link } from "@inertiajs/react";
import axiosClient from "@/axiosClient";
import GuestNavBarLayout from "@/layouts/navbar_layouts/GuestNavBar_Layout";
import Footer from "@/components/footer/Footer_MiAmore";

interface CartItem {
  id: number;
  product_name: string;
  image?: string;
  size?: string;
  flavor?: string;
  add_on?: string;
  quantity: number | string;
  price: number | string;
}

const steps = ["Cart", "Payment", "Confirm", "Success"];

const CustomerCartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const res = await axiosClient.get("/cart/items");
      setItems(res.data.items || []);
      setSelectedIds(res.data.items.map((item: CartItem) => item.id));
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await axiosClient.delete(`/cart/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        const currentQty = typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity;
        const newQty = currentQty + delta;
        return item.id === id ? { ...item, quantity: newQty > 0 ? newQty : 1 } : item;
      })
    );
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  
  // Calculate subtotal based on items only
  const total = selectedItems.reduce(
    (sum, item) => sum + parseFloat(item.price as string) * parseFloat(item.quantity as string),
    0
  );

  const formatPeso = (amount: number) => `₱${amount.toFixed(2)}`;

  useEffect(() => {
    fetchCartItems();
    window.addEventListener("cart-updated", fetchCartItems);
    return () => window.removeEventListener("cart-updated", fetchCartItems);
  }, []);

  if (loading) return null;

  return (
    <GuestNavBarLayout>
      <div className="min-h-screen bg-[#FDFCF8] p-4 pt-28 max-w-[1600px] mx-auto font-sans">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-serif italic transition-all duration-500 ${idx === 0 ? "bg-[#424242] text-white border-[#424242]" : "bg-transparent text-gray-300 border-gray-200"}`}>
                  {idx + 1}
                </div>
                <p className={`text-center text-[10px] font-bold uppercase mt-3 tracking-[0.2em] ${idx === 0 ? "text-[#424242]" : "text-gray-300"}`}>{step}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[1px] mx-4 mb-6 bg-gray-200"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Cart Container */}
          <div className="flex-grow bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#F9F9F4]">
                <tr className="text-[#424242] text-[11px] font-bold uppercase tracking-[0.15em]">
                  <th className="p-6 border-b border-gray-100">Items</th>
                  <th className="p-6 border-b border-gray-100">Options</th>
                  <th className="p-6 border-b border-gray-100">Price</th>
                  <th className="p-6 border-b border-gray-100 text-center">Quantity</th>
                  <th className="p-6 border-b border-gray-100 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-gray-600">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 group hover:bg-[#FDFCF8]/50 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-800 font-bold px-2 transition-colors">×</button>
                        <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all shadow-sm" />
                        <span className="font-serif italic text-base text-[#424242]">{item.product_name}</span>
                      </td>
                      <td className="p-6 text-[11px] text-gray-400 leading-relaxed italic">
                        {item.size || "Small"} / {item.flavor || "No Flavor"} / {item.add_on || "Ice"}
                      </td>
                      <td className="p-6">{formatPeso(parseFloat(item.price as string))}</td>
                      <td className="p-6">
                        <div className="flex items-center justify-center border border-gray-200 rounded-sm p-1 gap-4 w-max mx-auto bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-black px-1 font-bold">-</button>
                          <span className="text-[#424242] font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-black px-1 font-bold">+</button>
                        </div>
                      </td>
                      <td className="p-6 font-bold text-[#424242] text-right">
                        {formatPeso(parseFloat(item.price as string) * parseFloat(item.quantity as string))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center italic text-gray-400">Your cart is empty.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-6 flex justify-between bg-white border-t border-gray-50">
              <Link href="/menu" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                ← Continue Browsing
              </Link>
              <button 
                onClick={() => router.visit("/menu")}
                className="bg-gray-100 hover:bg-gray-200 text-[#424242] px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition"
              >
                Add More Items
              </button>
            </div> 
          </div>

          {/* Order Summary Card */}
          <div className="w-full lg:w-[360px] bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
            <h3 className="font-serif italic text-xl text-[#424242] mb-8 border-b border-gray-50 pb-4">Order Summary</h3>
            
            <div className="space-y-4 text-[12px] font-medium text-gray-500 mb-8">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <span>Subtotal</span>
                <span className="text-[#424242] font-bold">{formatPeso(total)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#424242] text-[13px] font-serif italic">Total Amount:</span>
                <span className="text-xl font-bold text-[#424242]">{formatPeso(total)}</span>
              </div>
            </div>

            <button 
              onClick={() => router.visit("/payment")}
              disabled={items.length === 0}
              className={`w-full py-4 rounded-sm shadow-md font-bold text-[11px] uppercase tracking-[0.2em] transition-all ${
                items.length === 0 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-[#8cb662] hover:bg-[#7aa354] text-white"
              }`}
            >
              Proceed to Details
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </GuestNavBarLayout>
  );
};

export default CustomerCartPage;