import React, { useState } from "react";

const LoyaltyPointsPage: React.FC = () => {
  const [promoCode, setPromoCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);

  const handleProceed = () => {
    window.location.href = "/confirm-order"; // next step
  };

  return (
    <div className="min-h-screen bg-[#D6F0FF] p-6 font-sans">

      {/* Breadcrumb */}
      <nav className="text-gray-600 mb-4 text-sm">
        Home &gt; Order Cart &gt; Checkout Details
      </nav>

      {/* Page title */}
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
          const activeIndex = 2; // NOW Loyalty Points step
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

      {/* CONTENT BOX */}
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto text-sm">
        <h3 className="font-semibold mb-4 border-b pb-2">
          Apply Promo or Loyalty Points (Optional)
        </h3>

        {/* Promo Code Input */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="border border-gray-300 rounded p-2 text-xs flex-1"
          />
          <button className="ml-2 px-4 py-2 bg-green-600 text-white rounded text-xs">
            Apply
          </button>
        </div>

        {/* Loyalty Points checkbox */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={usePoints}
            onChange={(e) => setUsePoints(e.target.checked)}
          />
          <span className="text-sm">Use My Loyalty Points</span>
        </label>

        <p className="text-xs text-gray-500 mt-2">
          You have <b>150 points</b> — Equivalent to <b>₱15 discount</b>
        </p>

        {/* NEW PROCEED BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleProceed}
            className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPointsPage;
