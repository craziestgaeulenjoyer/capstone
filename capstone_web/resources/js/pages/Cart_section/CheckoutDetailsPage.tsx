import React, { useState } from 'react';

interface CartItem {
  id: number;
  productName: string;
  sizeOption: string;
  flavor: string;
  addIns: string;
  addInsQty: string;
  quantity: number;
  price: number;
}

const sampleCart: CartItem[] = [
  {
    id: 1,
    productName: 'Iced Coffee',
    sizeOption: 'Small',
    flavor: 'No Vanilla Syrup',
    addIns: 'No Vanilla',
    addInsQty: 'Sweet Cream',
    quantity: 1,
    price: 85.00,
  },
];

const CheckoutDetailsPage: React.FC = () => {
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeout' | 'Delivery'>('Delivery');

  const subtotal = sampleCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const shippingCharge = 25;
  const total = subtotal - discount + shippingCharge;

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
          const isActive = idx === 0;
          return (
            <div key={idx} className="flex items-center space-x-2">
              <div
                className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold ${
                  isActive ? 'bg-green-600 text-white' : 'border border-gray-400 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`whitespace-nowrap ${
                  isActive ? 'text-green-600 font-semibold' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
              {idx !== 4 && <div className="border-t border-gray-300 w-12"></div>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Left - Order Summary Table */}
        <div className="flex-1 bg-white rounded shadow p-6">
          <div className="border border-gray-300 rounded overflow-x-auto">
            <table className="min-w-full table-fixed text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 w-1/5 text-left">Items</th>
                  <th className="p-2 w-1/6 text-left">Size options</th>
                  <th className="p-2 w-1/6 text-left">Flavors</th>
                  <th className="p-2 w-1/6 text-left">Add-ins</th>
                  <th className="p-2 w-1/12 text-left">Add-ins Qty</th>
                  <th className="p-2 w-1/12 text-center">Quantity</th>
                  <th className="p-2 w-1/12 text-right">Price</th>
                  <th className="p-2 w-1/12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleCart.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="p-2">{item.productName}</td>
                    <td className="p-2">{item.sizeOption}</td>
                    <td className="p-2">{item.flavor}</td>
                    <td className="p-2">{item.addIns}</td>
                    <td className="p-2">{item.addInsQty}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">₱{item.price.toFixed(2)}</td>
                    <td className="p-2 text-center">
                      <button className="text-blue-500 hover:underline">...</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Type */}
          <div className="mt-6 space-x-6 text-sm text-gray-700">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="orderType"
                value="Dine-in"
                checked={orderType === 'Dine-in'}
                onChange={() => setOrderType('Dine-in')}
                className="mr-2"
              />
              Dine-in
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="orderType"
                value="Takeout"
                checked={orderType === 'Takeout'}
                onChange={() => setOrderType('Takeout')}
                className="mr-2"
              />
              Takeout
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="orderType"
                value="Delivery"
                checked={orderType === 'Delivery'}
                onChange={() => setOrderType('Delivery')}
                className="mr-2"
              />
              Delivery
            </label>
          </div>
        </div>

        {/* Right - Order Summary Sidebar */}
        <div className="w-64 bg-white rounded shadow p-6 text-xs">
          <h3 className="font-semibold mb-4 border-b border-gray-300 pb-2">
            Order Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>₱{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span>₱{shippingCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-400 pt-2 font-semibold">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-1 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
              onClick={() => alert('Cancel clicked')}
            >
              Cancel
            </button>

            <button
              className="px-6 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
              onClick={() => alert('Proceed clicked')}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
