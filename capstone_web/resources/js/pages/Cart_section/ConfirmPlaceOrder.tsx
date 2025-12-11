import React, { useState } from "react";

const ConfirmPlaceOrder: React.FC = () => {
  const [agree, setAgree] = useState(false);

  const handlePlaceOrder = () => {
    if (!agree) return alert("You must agree to the terms before placing your order.");

    window.location.href = "/payment-confirmation"; // FINAL STEP
  };

  return (
    <div className="min-h-screen bg-[#D6F0FF] p-6 font-sans">

      {/* Breadcrumb */}
      <nav className="text-gray-600 mb-4 text-sm">
        Home &gt; Order Cart &gt; Checkout Details
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Checkout Details</h1>

      {/* Stepper */}
      <div className="flex items-center space-x-6 mb-8 text-sm">
        {[
          "Order Summary",
          "Payment Method",
          "Loyalty Points",
          "Confirm & Place Order",
          "Payment Confirmation",
        ].map((step, idx) => {
          const activeIndex = 3; // Step 4 active
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex;

          return (
            <div key={idx} className="flex items-center space-x-2">
              <div
                className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold ${
                  isActive
                    ? "bg-green-600 text-white"
                    : isCompleted
                    ? "bg-green-400 text-white"
                    : "border border-gray-400 text-gray-400"
                }`}
              >
                {idx + 1}
              </div>

              <span
                className={`whitespace-nowrap ${
                  isActive || isCompleted
                    ? "text-green-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>

              {idx !== 4 && <div className="border-t border-gray-300 w-12"></div>}
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto text-sm">

        <h3 className="font-semibold mb-4">Confirm and Place Order</h3>
        <p className="text-xs text-gray-500 mb-4">
          Review your order details before placing it.
        </p>

        <div className="border p-4 rounded mb-6">

          <p className="font-semibold mb-2">Order Overview</p>

          <div className="text-sm mb-2">
            <p>Vanilla Cold Brew</p>
            <p className="text-blue-600 font-semibold">₱90.00</p>
          </div>

          <div className="text-xs text-gray-600 mb-4">
            Payment Method: <span className="font-semibold text-gray-800">Pay via GCash</span>
          </div>

          <div className="text-xs text-gray-600">
            Total Amount: <span className="font-semibold text-blue-600 text-sm">₱90.00</span>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span className="text-xs">I accept the terms and condition</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!agree}
            className={`mt-4 px-4 py-2 rounded text-white text-xs font-semibold 
              ${agree ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Place Order
          </button>

          <p className="text-xs text-blue-600 mt-2 underline cursor-pointer">
            View Terms and Conditions
          </p>

        </div>
      </div>
    </div>
  );
};

export default ConfirmPlaceOrder;
