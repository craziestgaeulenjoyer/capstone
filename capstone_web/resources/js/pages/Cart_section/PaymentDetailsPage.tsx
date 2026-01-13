import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import axiosClient from "@/axiosClient";
import GuestNavBarLayout from "@/layouts/navbar_layouts/GuestNavBar_Layout";
import Footer from "@/components/footer/Footer_MiAmore";

interface Customer {
  full_name: string;
  email: string;
}

const PaymentDetailsPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer>({ full_name: "", email: "" });
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ address: "", phone: "" });

  /* ============================
      ✅ FETCH CUSTOMER
     ============================ */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axiosClient.get("/customer/profile");
        const customerData = res.data.customer;

        setCustomer({
          full_name: customerData.full_name || "",
          email: customerData.email || "",
        });
      } catch (err) {
        console.error(err);
        router.visit("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const handleNext = () => {
    let hasError = false;
    const newError = { address: "", phone: "" };
    
    if (!address.trim()) { newError.address = "Address is required."; hasError = true; }
    if (!phone.trim()) { newError.phone = "Phone number is required."; hasError = true; }
    
    setError(newError);
    if (hasError) return;

    localStorage.setItem("address", address);
    localStorage.setItem("phone", phone);
    localStorage.setItem("payment_type", paymentType);
    
    router.visit("/checkout");
  };

  if (loading) return (
    <GuestNavBarLayout>
      <div className="mt-32 text-center text-gray-500 font-medium">Loading customer info...</div>
    </GuestNavBarLayout>
  );

  return (
    <GuestNavBarLayout>
      <div className="min-h-screen bg-white p-6 pt-24 flex justify-center font-sans">
        <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-sm shadow-sm p-10">
          
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Checkout Session</p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={customer.full_name}
                readOnly
                className="border border-gray-200 rounded-md p-2 bg-gray-50 text-black focus:outline-none h-10 text-sm cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 6789"
                className={`border rounded-md p-2 h-10 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-200 ${error.phone ? 'border-red-500' : 'border-gray-200'}`}
              />
              {error.phone && <p className="text-red-500 text-[10px] mt-1">{error.phone}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete delivery address"
                className={`border rounded-md p-2 h-10 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-200 ${error.address ? 'border-red-500' : 'border-gray-200'}`}
              />
              {error.address && <p className="text-red-500 text-[10px] mt-1">{error.address}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={customer.email}
                readOnly
                className="border border-gray-200 rounded-md p-2 bg-gray-50 text-black focus:outline-none h-10 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="mb-10">
            <h3 className="text-base font-bold text-gray-800 mb-6">Choose your payment method</h3>
            
            <div className="space-y-4">
              {/* Cash at Counter Option */}
              <div 
                onClick={() => setPaymentType("cash")}
                className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-all ${paymentType === 'cash' ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'cash' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {paymentType === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Store Pickup (Cash)</p>
                    <p className="text-[12px] text-gray-400">Pay directly at the counter upon picking up your order.</p>
                  </div>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                   <span className="text-[10px] text-gray-400 font-bold">STORE</span>
                </div>
              </div>

              {/* GCash Option */}
              <div 
                onClick={() => setPaymentType("gcash")}
                className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-all ${paymentType === 'gcash' ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'gcash' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {paymentType === 'gcash' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">GCash</p>
                    <p className="text-[12px] text-gray-400">Securely pay using your GCash account.</p>
                  </div>
                </div>
                <div className="text-[#0055EE] font-black italic text-lg tracking-tighter">GCash</div>
              </div>

              {/* Cash on Delivery Option */}
              <div 
                onClick={() => setPaymentType("cod")}
                className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-all ${paymentType === 'cod' ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'cod' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {paymentType === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Cash on Delivery</p>
                    <p className="text-[12px] text-gray-400">Pay the rider in cash once your order arrives at your door.</p>
                  </div>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-blue-600 font-bold text-[10px]">
                    COD
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => router.visit("/cart")}
              className="px-8 py-2 bg-[#E0E0E0] hover:bg-gray-300 text-gray-600 text-sm font-bold rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-[#8CB662] hover:bg-[#7da357] text-white text-sm font-bold rounded-md transition-colors shadow-sm"
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

export default PaymentDetailsPage;