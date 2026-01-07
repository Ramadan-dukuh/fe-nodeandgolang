import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual user ID from auth context
  const USER_ID = 1;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8000/cart/${USER_ID}`);
      const data = await response.json();
      setCartItems(data.result || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (cartId, newQty) => {
    if (newQty < 1) return;

    try {
      const response = await fetch(`http://localhost:8000/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty }),
      });

      if (response.ok) {
        setCartItems(
          cartItems.map((item) =>
            item.id === cartId ? { ...item, qty: newQty } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      const response = await fetch(`http://localhost:8000/cart/${cartId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== cartId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/cart/clear/${USER_ID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex gap-4 hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.nama_barang}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.nama_barang}</h3>
                  <p className="text-indigo-600 font-bold text-lg mb-4">
                    Rp{item.harga.toLocaleString("id-ID")}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleUpdateQty(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={18} />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-auto text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-gray-600 text-sm mb-2">Subtotal</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    Rp{(item.harga * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="w-full bg-red-100 text-red-600 px-4 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  Rp{totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">
                  Rp{Math.floor(totalPrice * 0.1).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="flex justify-between mb-6 bg-indigo-50 rounded-lg p-4">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-indigo-600">
                Rp{Math.floor(totalPrice * 1.1).toLocaleString("id-ID")}
              </span>
            </div>

            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-indigo-600 hover:text-indigo-700 mt-4 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
