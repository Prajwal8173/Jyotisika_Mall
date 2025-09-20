import React, { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const BASE_URL = "https://jyotisika.in/jyotisika_test";
const API_URL = `${BASE_URL}/User_Api_Controller`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    price: 0,
    discount: 0,
    shipping: "Free",
    couponApplied: 0,
    total: 0,
    deliveryDate: "01 Feb, 2023",
  });

  const userId = localStorage.getItem("user_id");
  console.log("User ID:", userId);

  // ✅ Proper image builder
  const getFirstImageUrl = (imageJson) => {
    try {
      const images = JSON.parse(imageJson);
      if (images.length > 0) {
        return `${BASE_URL}/uploads/products/${images[0]}`;
      }
      return "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  };

  // 🔹 Fetch cart items
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/GetCartData?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const items = data.data.map((item) => ({
            ...item,
            quantity: parseInt(item.product_quantity),
            price: parseFloat(item.discount_price),
            image: getFirstImageUrl(item.product_image),
          }));
          setCartItems(items);
          calculateSummary(items);
        }
      })
      .catch((err) => console.error("Cart fetch error:", err));
  }, [userId]);

  // 🔹 Calculate totals
  const calculateSummary = (items) => {
    const price = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = 40; // static for now
    const total = price - discount;
    setSummary((prev) => ({ ...prev, price, discount, total }));
  };

  // 🔹 Update quantity
  const updateQuantity = (cartId, qty) => {
    if (qty < 1) return;

    const formData = new FormData();
    formData.append("cart_id", cartId);
    formData.append("quantity", qty);

    fetch(`${API_URL}/updateQuantity`, { method: "POST", body: formData })
      .then(() => {
        const updated = cartItems.map((item) =>
          item.cart_id === cartId ? { ...item, quantity: qty } : item
        );
        setCartItems(updated);
        calculateSummary(updated);
      })
      .catch((err) => console.error("Update quantity error:", err));
  };

  // 🔹 Remove item
  const removeItem = (cartId) => {
    const formData = new FormData();
    formData.append("cart_id", cartId);

    fetch(`${API_URL}/deleteproductfromcart`, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        const updated = cartItems.filter((item) => item.cart_id !== cartId);
        setCartItems(updated);
        calculateSummary(updated);
      })
      .catch((err) => console.error("Remove item error:", err));
  };

  return (
    <div className="bg-[#fdf6e3] min-h-screen p-6 flex flex-col lg:flex-row gap-6">
      {/* 🛒 Cart Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800">
          Cart{" "}
          <span className="text-sm text-gray-500">
            {cartItems.length} ITEMS
          </span>
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.cart_id}
              className="flex items-start gap-4 py-4 border-b border-gray-200"
            >
              {/* ✅ First Image Only */}
              <img
                src={item.image}
                alt={item.product_name}
                className="w-28 h-28 object-cover rounded-lg"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.product_name}
                </h3>
                <p className="text-gray-500">
                  Category:{" "}
                  <span className="font-semibold">{item.category}</span>
                </p>
                <p className="font-bold mt-1">₹{item.price}</p>

                {/* 🔹 Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_id, item.quantity - 1)
                    }
                    className="px-2 border rounded"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_id, item.quantity + 1)
                    }
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.cart_id)}
                    className="text-red-500 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* 🔹 Discount Banner */}
        <div className="mt-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 flex items-center gap-2 text-yellow-800">
          <FaTag />
          <p className="text-sm">
            10% Instant Discount with Federal Bank Debit Cards on a min spend of
            ₹1500. TCA
          </p>
        </div>
      </div>

      {/* 📦 Summary Section */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Price</span>
            <span>₹{summary.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- ₹{summary.discount}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-orange-500">{summary.shipping}</span>
          </div>
          <div className="flex justify-between">
            <span>Coupon Applied</span>
            <span>₹{summary.couponApplied}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>₹{summary.total.toFixed(2)}</span>
          </div>
          <div className="text-sm mt-2">
            Estimated Delivery by{" "}
            <span className="font-semibold">{summary.deliveryDate}</span>
          </div>
        </div>

        
        {/* ✅ Checkout Button */}
        <Button className="w-full bg-orange-500 text-white font-semibold text-lg rounded-xl mt-4 py-2">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
