import React, { useState, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface CartItem {
  id: number;
  image: string;
  productName: string;
  sizeOption: string;
  flavor: string;
  addIns: string;
  unitPrice: number;
  quantity: number;
}

// Example cart with all new fields filled
const initialCart: CartItem[] = [
  {
    id: 201,
    image: 'https://via.placeholder.com/64x64/f3f4f6?text=Iced+Coffee',
    productName: 'Iced Coffee',
    sizeOption: 'Regular',
    flavor: 'Vanilla',
    addIns: 'Milk, Sugar',
    unitPrice: 5.0,
    quantity: 1,
  },
];

const SHIPPING_FEE = 0.0;
const TAX_RATE = 0.1;

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const updateQuantity = useCallback((itemId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const { subtotal, taxes, total } = useMemo(() => {
    const subtotalCalc = cartItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
    const taxesCalc = subtotalCalc * TAX_RATE;
    const totalCalc = subtotalCalc + SHIPPING_FEE + taxesCalc;
    return { subtotal: subtotalCalc, taxes: taxesCalc, total: totalCalc };
  }, [cartItems]);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const cartIsEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#8e674a] h-16 shadow">
        <p className="text-white p-4">Placeholder NavBar</p>
      </nav>

      <div className="max-w-[1350px] mx-auto px-4 py-6">
        <div className="bg-[#e0f7fa] text-gray-700 py-2 px-4 rounded-t-md border border-[#b2ebf2]">
          <p className="text-sm">
            <Link href="/home" className="hover:underline">
              Home
            </Link>{' '}
            / <span className="font-semibold"> Order Cart</span>
          </p>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-b-md">
          <h1 className="text-2xl font-bold text-gray-800 p-4 pb-2">Order Cart</h1>

          {cartIsEmpty ? (
            <div className="text-center py-20 text-gray-500">
              <Trash2 size={48} className="mx-auto mb-4" />
              <p className="text-xl font-semibold">Your cart is currently empty.</p>
              <Link
                href="/menu"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Start shopping here!
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 p-4">
              {/* Table */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-[#e0f7fa] text-gray-700 text-xs uppercase tracking-wide border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left w-1/6">Item</th>
                      <th className="px-3 py-2 text-center w-1/12">Size Option</th>
                      <th className="px-3 py-2 text-center w-1/12">Flavor</th>
                      <th className="px-3 py-2 text-center w-1/6">Add Ins</th>
                      <th className="px-3 py-2 text-center w-1/12">Price</th>
                      <th className="px-3 py-2 text-center w-1/12">Quantity</th>
                      <th className="px-3 py-2 text-right w-1/12">Subtotal</th>
                      <th className="px-3 py-2 text-center w-1/12">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-sm">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="h-20">
                        <td className="px-3 py-2 flex items-center gap-3">
                          <img
                            src={item.image}
                            className="h-16 w-16 rounded object-cover border"
                            alt={item.productName}
                          />
                          <span className="text-gray-800">{item.productName}</span>
                        </td>

                        <td className="px-3 py-2 text-center text-gray-600">
                          {item.sizeOption}
                        </td>

                        <td className="px-3 py-2 text-center text-gray-600">
                          {item.flavor}
                        </td>

                        <td className="px-3 py-2 text-center text-gray-600 whitespace-nowrap">
                          {item.addIns}
                        </td>

                        <td className="px-3 py-2 text-center text-gray-600">
                          {formatCurrency(item.unitPrice)}
                        </td>

                        <td className="px-3 py-2 text-center">
                          <div className="flex justify-center">
                            <button
                              className="px-2 border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>

                            <div className="w-10 border-t border-b border-gray-300 flex items-center justify-center">
                              {item.quantity}
                            </div>

                            <button
                              className="px-2 border border-gray-300 rounded-r hover:bg-gray-100"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-right font-semibold text-gray-700">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </td>

                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4">
                  <Link
                    href="/menu"
                    className="px-5 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-64 h-fit bg-gray-50 border border-gray-200 rounded p-4 text-sm">
                <h3 className="text-lg font-bold border-b pb-2 mb-3 text-gray-800">
                  Order Summary
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>

                  <div className="flex justify-between border-t pt-2">
                    <span>Taxes</span>
                    <span>{formatCurrency(taxes)}</span>
                  </div>

                  <div className="flex justify-between border-t pt-2 font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-[#8e674a]">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block mt-4 w-full text-center bg-[#88B04B] text-white py-2 rounded font-semibold hover:bg-[#7BA642]"
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
