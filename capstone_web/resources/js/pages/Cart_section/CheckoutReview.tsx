import React, { useState } from "react";

// Renamed component from ConfirmPlaceOrder to CheckoutReview
const CheckoutReview: React.FC = () => {
// Note: The image shows the layout for the 'Confirm & Place Order' step (step 4),
// but the content fields are labeled 'Payment Confirmation' in the screenshot.
// I will follow the image's visual structure exactly.

// State for terms agreement is set to true to enable the Place Order button as shown
const [agree, setAgree] = useState(true); 

const handlePlaceOrder = () => {
// In a real app, you would submit the order details here.
if (!agree) return alert("You must agree to the terms before placing your order.");

// Navigation to the final step (Payment Confirmation Page)
window.location.href = "/payment-confirmation";
};

// The active index for the stepper is 3 (Confirm & Place Order)
const activeStepIndex = 3;

return (
<div className="min-h-screen p-6 font-sans"> 
      {/* Removed bg-[#D6F0FF] since the image background is white/light gray */}

{/* Breadcrumb */}
<nav className="text-gray-600 mb-4 text-sm">
Home &gt; Order Cart &gt; Checkout Details
</nav>

{/* Page Title */}
<h1 className="text-2xl font-semibold mb-6">Checkout Details</h1>

{/* Stepper - Replicating the image's stepper style */}
<div className="flex justify-center items-center space-x-0 mb-8 text-sm">
{[
"Order Summary",
"Payment Method",
"Loyalty Points",
"Confirm & Place Order",
"Payment Confirmation",
].map((step, idx) => {
const isActive = idx === activeStepIndex;
const isCompleted = idx < activeStepIndex;
          // Use green for active/completed text and gray for inactive
          const textColor = isActive || isCompleted ? "text-green-600 font-semibold" : "text-gray-500";
          
return (
<React.Fragment key={idx}>
              {/* Connector line (if not the first step) */}
              {idx !== 0 && (
                <div 
                  className={`flex-1 h-0.5 ${isCompleted ? "bg-green-600" : "bg-gray-300"} w-8 md:w-16`}
                />
              )}

              {/* Step Circle and Text */}
<div className="flex flex-col items-center">
                <div
className={`rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold border-2 ${
isCompleted
? "bg-green-600 border-green-600 text-white"
: isActive
? "bg-white border-green-600 text-green-600"
: "bg-white border-gray-400 text-gray-400"
}`}
>
{isCompleted ? "✓" : (idx + 1)}
</div>
                {/* Step Text (hidden in the image but good for accessibility) */}
<span className={`absolute mt-8 whitespace-nowrap hidden md:block text-xs ${textColor}`}>
                  {step}
                </span>
</div>
</React.Fragment>
);
})}
</div>
      {/* Stepper END */}

{/* CONTENT CARD */}
<div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto border-t-4 border-green-500">
        
        {/* Order Total and Place Order Button Row */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm mb-1">Payment Confirmation</h3>
            <p className="text-xs text-gray-500">JJSF-903450</p>
          </div>

          <div className="flex items-center space-x-4">
            <p className="font-semibold text-lg text-black">
              Order Total: <span className="text-green-600">₱80.00</span>
            </p>
            <button
              onClick={handlePlaceOrder}
              disabled={!agree}
              className={`px-6 py-2 rounded text-white text-sm font-semibold 
              ${agree ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Place Order
            </button>
          </div>
        </div>

        {/* Details Grid: Your Information & Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          
          {/* 1. Your Information */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Your Information</h4>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Edit
              </a>
            </div>
            <div className="border-b border-gray-300 mb-4"></div> {/* Divider */}
            <p className="font-medium text-gray-800">John Doe</p>
            <p className="text-gray-600">john.doe143@example.com</p>
          </div>

          {/* 2. Shipping Address */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Shipping Address</h4>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Edit
              </a>
            </div>
            <div className="border-b border-gray-300 mb-4"></div> {/* Divider */}
            <p className="font-medium text-gray-800">John Doe</p>
            <p className="text-gray-600">Unit 1, Flr. 2, Gabby Pando Street</p>
            <p className="text-gray-600">4040 LiwagVillage</p>
            <p className="text-gray-600">Brgy. Talipay-Salipay, Dippavilla</p>
            <p className="text-gray-600">+(53)-907-706-1234</p>
          </div>

          {/* 3. Payment Method (Full width row) */}
          <div className="md:col-span-2 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Payment</h4>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Edit
              </a>
            </div>
            <div className="border-b border-gray-300 mb-4"></div> {/* Divider */}
            
            {/* Payment Box (GCash Mockup) */}
            <div className="border border-gray-300 rounded-lg p-3 w-full md:w-1/2">
                <div className="flex items-center space-x-2">
                    {/* Placeholder for GCash logo (use an actual image source if available) */}
                    <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-xs text-white font-bold">GCASH</div>
                    <p className="text-xs text-gray-600">
                        You will be securely redirected to GCash to enter your information.
                    </p>
                </div>
            </div>
          </div>

        </div> {/* End Details Grid */}

</div> {/* End CONTENT CARD */}
</div>
);
};

// Export the component with the new name
export default CheckoutReview;