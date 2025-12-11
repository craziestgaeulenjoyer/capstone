import React, { useState } from 'react';

const PaymentMethodPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'GCash' | 'PayOnPickup'>('GCash');
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  // Navigation function example (React Router or Inertia)
  const handleProceed = () => {
    // Validate fields if needed
    // Then navigate to next step - Loyalty Points page or wherever
    window.location.href = '/loyalty-points'; // Replace with actual route
  };

  return (
    <div className="min-h-screen bg-[#D6F0FF] p-6 font-sans">
      {/* Breadcrumb */}
      <nav className="text-gray-600 mb-4 text-sm">
        Home &gt; Order Cart &gt; <span className="font-semibold">Checkout Details</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Checkout Details</h1>

      {/* Stepper */}
      <div className="flex items-center space-x-6 mb-8 text-sm">
        {[
          'Order Summary',
          'Payment Method',
          'Loyalty Points',
          'Confirm & Place Order',
          'Payment Confirmation',
        ].map((step, idx) => {
          const activeIndex = 1; // Payment Method step active
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex;

          return (
            <div key={idx} className="flex items-center space-x-2">
              <div
                className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : isCompleted
                    ? 'bg-green-400 text-white'
                    : 'border border-gray-400 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`whitespace-nowrap ${
                  isActive || isCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
              {idx !== 4 && <div className="border-t border-gray-300 w-12"></div>}
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto text-sm">
        <h3 className="font-semibold mb-2 border-b border-gray-300 pb-2">Customer Details</h3>
        <p className="mb-4 text-xs text-gray-500">#BUSS-001203</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProceed();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="contactNumber">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email Address (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full text-xs"
              />
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Choose your payment method</h3>

          {/* Payment Methods */}
          <div className="space-y-3">
            <label
              htmlFor="cash"
              className={`flex items-center border rounded p-3 cursor-pointer ${
                paymentMethod === 'Cash' ? 'border-green-600' : 'border-gray-300'
              }`}
            >
              <input
                id="cash"
                type="radio"
                name="paymentMethod"
                value="Cash"
                checked={paymentMethod === 'Cash'}
                onChange={() => setPaymentMethod('Cash')}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold">Cash</div>
                <div className="text-xs text-gray-600">Pay directly at the counter during order pickup.</div>
              </div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/70/Money_icon_green.svg"
                alt="Cash"
                className="w-8 h-8"
              />
            </label>

            <label
              htmlFor="gcash"
              className={`flex items-center border rounded p-3 cursor-pointer ${
                paymentMethod === 'GCash' ? 'border-blue-600' : 'border-gray-300'
              }`}
            >
              <input
                id="gcash"
                type="radio"
                name="paymentMethod"
                value="GCash"
                checked={paymentMethod === 'GCash'}
                onChange={() => setPaymentMethod('GCash')}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold">GCash</div>
                <div className="text-xs text-gray-600">
                  Seamlessly pay by entering your GCash number or online.
                </div>
              </div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7f/GCash_logo.svg"
                alt="GCash"
                className="w-16 h-8"
              />
            </label>

            <label
              htmlFor="payOnPickup"
              className={`flex items-center border rounded p-3 cursor-pointer ${
                paymentMethod === 'PayOnPickup' ? 'border-orange-600' : 'border-gray-300'
              }`}
            >
              <input
                id="payOnPickup"
                type="radio"
                name="paymentMethod"
                value="PayOnPickup"
                checked={paymentMethod === 'PayOnPickup'}
                onChange={() => setPaymentMethod('PayOnPickup')}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold">Pay on Pickup</div>
                <div className="text-xs text-gray-600">
                  Pay the delivery rider upon receiving your order (cash or GCash accepted).
                </div>
              </div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Motorcycle_delivery_icon.svg"
                alt="Pay on Pickup"
                className="w-8 h-8"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-4 py-1 rounded bg-gray-400 text-white hover:bg-gray-500"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
