import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/payment.css";

const BASE_URL = "https://jyotisika.in/jyotisika_test"; 

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);

  const userId = localStorage.getItem("user_id");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get data passed from Address/Shipping
  const { cartSummary, selectedAddress } = location.state || {};

  // 📅 Delivery date (10 days later)
  const getEstimatedDate = (daysToAdd = 10) => {
    const date = new Date();
    const months = [
      "Jan","Feb","Mar","Apr","May","June",
      "July","Aug","Sept","Oct","Nov","Dec"
    ];
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + daysToAdd);
    return `${futureDate.getDate().toString().padStart(2,"0")} ${
      months[futureDate.getMonth()]
    }, ${futureDate.getFullYear()}`;
  };

  // Dummy fetch payment methods
  const fetchPaymentMethods = async () => {
    setPaymentMethods([]);
  };

  // ✅ Fetch cart/order summary (with ₹40 shipping)
  const fetchOrderSummary = async () => {
    try {
      const payload = new FormData();
      payload.append("session_id", userId);

      const res = await axios.post(
        `${BASE_URL}/User_Api_Controller/GetCartData`,
        payload
      );

      if (res.data.status === "success") {
        const items = res.data.data;

        let totalOriginal = 0;
        let totalDiscount = 0;
        let discountedPrice = 0;

        items.forEach((item) => {
          const qty = parseInt(item.product_quantity) || 1;
          const productPrice = parseFloat(item.product_price) || 0;
          const discountPrice = parseFloat(item.discount_price) || productPrice;

          totalOriginal += qty * productPrice;
          discountedPrice += qty * discountPrice;
          totalDiscount += qty * (productPrice - discountPrice);
        });

        const shipping = 40; // ✅ fixed shipping charge
        const finalTotal = discountedPrice + shipping;

        setOrderSummary({
          totalOriginal,
          totalDiscount,
          discountedPrice,
          shipping,
          total: finalTotal,
          deliveryDate: getEstimatedDate(10),
        });
      }
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  };

  // ✅ Checkout with Razorpay
  const handleCheckout = async () => {
    if (!orderSummary) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/User_Api_Controller/save_razorpay_order`,
        {
          amount: orderSummary.total,
          user_id: userId,
        }
      );

      if (res.data.status === "success") {
        const { order_id, amount, key } = res.data;

        if (!window.Razorpay) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          document.body.appendChild(script);
          script.onload = () => openRazorpay(order_id, amount, key);
        } else {
          openRazorpay(order_id, amount, key);
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  // ✅ Razorpay popup
  const openRazorpay = (order_id, amount, key) => {
    const options = {
      key,
      amount: amount * 100,
      currency: "INR",
      name: "Jyotisika Store",
      description: "Order Payment",
      order_id,
      handler: async (response) => {
        try {
          // ✅ Save order after successful payment
          const saveRes = await axios.post(
            `${BASE_URL}/User_Api_Controller/saveorder`,
            {
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
              addressid: selectedAddress,  // ✅ from AddressPage
              order_id: response.razorpay_order_id,
              user_id: userId,
            }
          );

          if (saveRes.data.status === "success") {
            Swal.fire({
              icon: 'success',
              title: 'Order Placed!',
              text: 'Your order was placed successfully.',
              timer: 2000,
              showConfirmButton: false
            });
            setTimeout(() => navigate("/"), 2000);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Order Failed',
              text: saveRes.data.message || 'Order save failed.',
              timer: 2200,
              showConfirmButton: false
            });
          }
        } catch (err) {
          console.error("Error saving order:", err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while saving the order.',
            timer: 2200,
            showConfirmButton: false
          });
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: { color: "#ff7a00" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    fetchPaymentMethods();
    fetchOrderSummary();
  }, []);

  return (
    <>
      <div className="addresss-header">
        <span className="step-inactive">Address</span>
        <span className="step-arrow">&gt;</span>
        <span className="step-inactive">Shipping</span>
        <span className="step-arrow">&gt;</span>
        <span className="step-active">Payment</span>
      </div>
      <div className="payment-page">
        {/* Payment Methods */}
        

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          {orderSummary ? (
            <div>
              <div className="summary-row">
                <span>Original Price</span>
                <span>₹{orderSummary.totalOriginal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Total Discount</span>
                <span style={{ color: "#28a745" }}>
                  -₹{orderSummary.totalDiscount.toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{orderSummary.shipping.toFixed(2)}</span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row total-row">
                <span>Final Price</span>
                <span className="total-value">₹{orderSummary.total.toFixed(2)}</span>
              </div>

              <div className="summary-row delivery-row">
                <span>Estimated Delivery by</span>
                <span>{orderSummary.deliveryDate}</span>
              </div>

              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          ) : (
            <p>Loading order summary...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
