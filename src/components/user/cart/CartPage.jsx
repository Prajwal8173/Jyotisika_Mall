import React, { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/CartPage.css";

const BASE_URL = "https://jyotisika.in/jyotisika_test/User_Api_Controller";

// ✅ Utility to safely parse integers
const safeInt = (val, fallback = 0) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
};

// ✅ Utility to safely parse floats
const safeFloat = (val, fallback = 0.0) => {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
};

const CartPage = ({ setCartCount, cartCount }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  // ✅ Fetch cart data
  const fetchCart = async () => {
    if (!userId) return;

    const payload = new FormData();
    payload.append("session_id", userId);

    try {
      const res = await axios.post(`${BASE_URL}/GetCartData`, payload);
      if (res.data.status === "success") {
        const cleaned = (res.data.data || []).map((item) => ({
          ...item,
          quantity: safeInt(item.product_quantity, 1),
          product_price: safeFloat(item.product_price, 0),
          discount_price: safeFloat(item.discount_price, 0),
        }));
        setCartItems(cleaned);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("GetCartData error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Increment quantity
  const handleIncrement = async (item) => {
    const newQty = safeInt(item.quantity, 0) + 1;

    // Update UI immediately
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.product_id === item.product_id ? { ...ci, quantity: newQty } : ci
      )
    );

    const payload = new FormData();
    payload.append("session_id", userId);
    payload.append("product_id", item.product_id);
    payload.append("quantity", String(newQty));

    try {
      await axios.post(`${BASE_URL}/updatequantity`, payload);
    } catch (error) {
      console.error("Increment error:", error);
      fetchCart(); // fallback
    }
  };

  // ✅ Decrement quantity
  const handleDecrement = async (item) => {
    const newQty = safeInt(item.quantity, 1) - 1;

    if (newQty > 0) {
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.product_id === item.product_id ? { ...ci, quantity: newQty } : ci
        )
      );

      const payload = new FormData();
      payload.append("session_id", userId);
      payload.append("product_id", item.product_id);
      payload.append("quantity", String(newQty));

      try {
        await axios.post(`${BASE_URL}/updatequantity`, payload);
      } catch (error) {
        console.error("Decrement error:", error);
        fetchCart(); // fallback
      }
    } else {
      handleRemove(item);
      setCartCount(cartCount - 1);
    }
  };

  // ✅ Remove product from cart
  const handleRemove = async (item) => {
    setCartItems((prev) => prev.filter((ci) => ci.product_id !== item.product_id));

    const payload = new FormData();
    payload.append("session_id", userId);
    payload.append("product_id", item.product_id);

    try {
      await axios.post(`${BASE_URL}/deleteproductfromcart`, payload);
    } catch (error) {
      console.error("Delete error:", error);
      fetchCart(); // fallback
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculate totals
  const totalOriginalPrice = cartItems.reduce(
    (sum, item) =>
      sum + safeFloat(item.product_price, 0) * safeInt(item.quantity, 1),
    0
  );

  const totalDiscountedPrice = cartItems.reduce(
    (sum, item) =>
      sum + safeFloat(item.discount_price, 0) * safeInt(item.quantity, 1),
    0
  );

  const totalDiscount = totalOriginalPrice - totalDiscountedPrice;

  // ✅ Estimated delivery after 10 days
  const date = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  const futureDate = new Date(date);
  futureDate.setDate(date.getDate() + 10);
  const EstimatedDeliveryBy = `${futureDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${months[futureDate.getMonth()]}, ${futureDate.getFullYear()}`;

  if (loading) {
    return <p style={{ minHeight: "80vh" }} className="text-center">Loading cart...</p>;
  }

  return (
    <div className="cart-container">
      <div className="Inner-container">
        {/* Left: Cart Items */}
        <div style={{ flex: 2 }}>
          <h2>
            Cart{" "}
            <span style={{ color: "#a3a3a3", fontWeight: 500, fontSize: 16, marginLeft: 8 }}>
              {cartItems.length} ITEMS
            </span>
          </h2>
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map((item) => {
              const imageArray = JSON.parse(item.product_image);
              const firstImage =
                imageArray && imageArray.length > 0 ? imageArray[0] : null;

              return (
                <div key={item.product_id} className="cart-item">
                  <img
                    src={
                      firstImage
                        ? `https://jyotisika.in/jyotisika_test/uploads/products/${firstImage}`
                        : ""
                    }
                    alt={item.product_name}
                  />
                  <div>
                    <h3>{item.product_name}</h3>
                    <p>
                      Category{" "}
                      <span style={{ fontWeight: 600, color: "#222" }}>
                        {item.category || "N/A"}
                      </span>
                    </p>
                    <p className="price">
                      <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                        ₹{safeFloat(item.product_price, 0).toFixed(2)}
                      </span>
                      <span style={{ color: "#e53935", fontWeight: 600 }}>
                        ₹{safeFloat(item.discount_price, 0).toFixed(2)}
                      </span>
                    </p>
                    <div className="qty-controls">
                      <button onClick={() => handleDecrement(item)}>-</button>
                      <span>{safeInt(item.quantity, 1)}</span>
                      <button onClick={() => handleIncrement(item)}>+</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/* Discount Banner */}
          <div className="discount-banner">
            <FaTag style={{ color: "#ff7a00" }} />
            10% Instant Discount with Federal Bank Debit Cards on a min spend of ₹150. T&C Apply
          </div>
        </div>

        {/* Right: Order Summary */}
        <div style={{ flex: 1 }}>
          <div className="order-summarys">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Original Price</span>
              <span>₹{totalOriginalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Total Discount</span>
              <span style={{ color: "#28a745" }}>-₹{totalDiscount.toFixed(2)}</span>
            </div>

            <div className="total-row">
              <span>Price</span>
              <span>₹{totalDiscountedPrice.toFixed(2)}</span>
            </div>
            <div className="delivery-date">
              Estimated Delivery by <b>{EstimatedDeliveryBy}</b>
            </div>
            <button className="checkout-btn" style={{ padding: "1px" }} onClick={() => navigate("/address")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
