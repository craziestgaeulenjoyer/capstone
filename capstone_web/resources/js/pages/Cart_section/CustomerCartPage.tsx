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

const steps = ["Cart", "Payment", "Loyalty", "Confirm", "Success"];

const CustomerCartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("customer_token");
    if (!token) return router.visit("/signin");
    try {
      const res = await axiosClient.get("/api/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    const token = localStorage.getItem("customer_token");
    if (!token) return;
    try {
      await axiosClient.delete(`/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + parseFloat(item.price as string) * parseFloat(item.quantity as string),
    0
  );
  const taxes = 25.00; 
  const total = subtotal + taxes;
  const formatPeso = (amount: number) => `₱${amount.toFixed(2)}`;

  useEffect(() => {
    fetchCartItems();
    window.addEventListener("cart-updated", fetchCartItems);
    return () => window.removeEventListener("cart-updated", fetchCartItems);
  }, []);

  if (loading) return null;

  return (
    <GuestNavBarLayout>
      <div className="min-h-screen bg-white p-4 pt-28 max-w-[1600px] mx-auto font-sans">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-10 max-w-3xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${idx === 0 ? "bg-[#8cb662] text-white" : "bg-gray-100 text-gray-400"}`}>
                  {idx + 1}
                </div>
                <p className={`text-center text-[10px] font-bold uppercase mt-2 tracking-tighter ${idx === 0 ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 mb-4 bg-gray-100"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* Main Cart Container */}
          <div className="flex-grow bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#E3F2FD]/60">
                <tr className="text-[#546E7A] text-[12px] font-bold uppercase tracking-wider">
                  <th className="p-4 border-b border-gray-100">Items</th>
                  <th className="p-4 border-b border-gray-100">Size options</th>
                  <th className="p-4 border-b border-gray-100">Flavor</th>
                  <th className="p-4 border-b border-gray-100">Add-ins</th>
                  <th className="p-4 border-b border-gray-100">Price</th>
                  <th className="p-4 border-b border-gray-100 text-center">Quantity</th>
                  <th className="p-4 border-b border-gray-100">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-gray-600 font-medium">
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 group">
                    <td className="p-4 flex items-center gap-4">
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 font-bold px-2">x</button>
                      <img src={item.image} alt="" className="w-14 h-14 object-cover rounded shadow-sm bg-gray-100" />
                      <span>{item.product_name}</span>
                    </td>
                    <td className="p-4 text-gray-400">{item.size || "Small"}</td>
                    <td className="p-4 text-gray-400">{item.flavor || "No Flavor"}</td>
                    <td className="p-4 text-gray-400">{item.add_on || "Ice"}</td>
                    <td className="p-4">{formatPeso(parseFloat(item.price as string))}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center border border-gray-200 rounded p-1 gap-2 w-max mx-auto bg-white">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-black px-1 font-bold">-</button>
                        <span className="text-gray-800 font-bold min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-black px-1 font-bold">+</button>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      {formatPeso(parseFloat(item.price as string) * parseFloat(item.quantity as string))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-end bg-white">
              {/* Changed from Update Cart to Add to Cart and redirected to /menu */}
              <button 
                onClick={() => router.visit("/menu")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-1.5 rounded text-[11px] font-bold uppercase transition shadow-sm"
              >
                Add More
              </button>
            </div> 
          </div>

          {/* Order Summary Card */}
          <div className="w-full lg:w-[320px] bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
            <h3 className="text-center font-bold text-gray-800 mb-8 text-[13px] uppercase tracking-widest">Order Summary</h3>
            
            <div className="space-y-4 text-[12px] font-medium text-gray-500 mb-8">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-gray-900 font-black">{formatPeso(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <span className="text-gray-900 font-black">0.00</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span>Shipping Charge</span>
                <span className="text-gray-900 font-black">₱25.00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 text-[13px]">Total:</span>
                <span className="text-[16px] font-black text-gray-900">{formatPeso(subtotal + 25)}</span>
              </div>
            </div>

            {/* Changed from Proceed to Checkout to Proceed and redirected to /menu */}
            <button 
              onClick={() => router.visit("/menu")}
              className="w-full bg-[#8cb662] hover:bg-[#7aa354] text-white py-2.5 rounded shadow-md font-bold text-[12px] transition"
            >
              Proceed
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </GuestNavBarLayout>
  );
};

export default CustomerCartPage;