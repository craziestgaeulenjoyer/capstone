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
  const [picture, setPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ address: "", phone: "" });

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem("customer_token");
      if (!token) return router.visit("/signin");
      try {
        const res = await axiosClient.get("/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const customerData = res.data.customer;
        setCustomer({
          full_name: customerData.full_name || "",
          email: customerData.email || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPicture(e.target.files[0]);
  };

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
    router.visit("/loyalty");
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
            <p className="text-[11px] text-gray-400 font-medium">MI-09-091293</p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={customer.full_name}
                readOnly
                className="border border-gray-200 rounded-md p-2 bg-white text-gray-600 focus:outline-none h-10 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter contact number"
                className={`border rounded-md p-2 h-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 ${error.phone ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
                className={`border rounded-md p-2 h-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 ${error.address ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-semibold text-gray-700 mb-1">Email Address (optional)</label>
              <input
                type="email"
                value={customer.email}
                readOnly
                className="border border-gray-200 rounded-md p-2 bg-white text-gray-600 focus:outline-none h-10 text-sm"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="mb-10">
            <h3 className="text-base font-bold text-gray-800 mb-6">Choose your payment method</h3>
            
            <div className="space-y-4">
              {/* Cash Option */}
              <div 
                onClick={() => setPaymentType("cash")}
                className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-all ${paymentType === 'cash' ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'cash' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {paymentType === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Cash</p>
                    <p className="text-[12px] text-gray-400">Pay directly at the counter during store pickup.</p>
                  </div>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                   <span className="text-[10px] text-gray-400">CASH</span>
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
                    <p className="text-[12px] text-gray-400">Securely pay by entering your GCash number online.</p>
                  </div>
                </div>
                <div className="text-[#0055EE] font-black italic text-lg tracking-tighter">GCash</div>
              </div>

              {/* GCash Proof of Payment - Conditional */}
              {paymentType === "gcash" && (
                <div className="ml-9 p-4 border-l-2 border-blue-400 bg-gray-50 rounded-r-md animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    Proof of Payment (Screenshot) *
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  />
                  <p className="text-[11px] text-gray-400 mt-2 italic">Please upload the transaction receipt from your GCash app.</p>
                </div>
              )}

              {/* Pay on Pickup Option */}
              <div 
                onClick={() => setPaymentType("pickup")}
                className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-all ${paymentType === 'pickup' ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'pickup' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {paymentType === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Pay on Pickup</p>
                    <p className="text-[12px] text-gray-400">Pay the delivery rider upon receiving your order.</p>
                  </div>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-orange-500">
                   🚚
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