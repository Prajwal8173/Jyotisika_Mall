import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/ShippingPage.css";
import { Helmet } from "react-helmet";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get data passed from AddressPage
  const { selectedAddress, cartSummary, product } = location.state || {};

  // ✅ Shipping is always ₹40
  const shippingCost = 40;

  // ✅ Helper: get estimated date (always 7 days delivery for example)
  const getEstimatedDate = (daysToAdd) => {
    const date = new Date();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + daysToAdd);
    return `${futureDate.getDate().toString().padStart(2, "0")} ${
      months[futureDate.getMonth()]
    }, ${futureDate.getFullYear()}`;
  };

  // ✅ Calculate summary
  const totalOriginal = cartSummary?.totalOriginal || 0;
  const totalDiscount = cartSummary?.totalDiscount || 0;
  const discountedPrice = totalOriginal - totalDiscount;
  const finalTotal = discountedPrice + shippingCost;

  const estimatedDelivery = getEstimatedDate(7);

  const handleProceedCheckout = () => {
    navigate("/payment", {
      state: {
        selectedAddress,
        cartSummary: {
          ...cartSummary,
          shipping: shippingCost,
          total: finalTotal,
        },
        product,
      },
    });
  };

  return (
    <div className="shipping-container">
    <Helmet>
        <title>Jyotisika | Shipping</title>
    </Helmet>
      <div className="shipping-grid">
        {/* Left Section - Stepper */}
        <div className="shipping-left">
          {/* <div className="shipping-stepper">
            <span className="step-inactive">Address</span>
            <span className="step-arrow">&gt;</span>
            <span className="step-active">Shipping</span>
            <span className="step-arrow">&gt;</span>
            <span className="step-inactive">Payment</span>
          </div> */}
        <div className="address-header">
          <span className="step-inactive">Address</span>
          <span className="step-arrow">&nbsp;&gt;&nbsp;</span>
          <span className="step-active">Shipping</span>
          <span className="step-arrow">&nbsp;&gt;&nbsp;</span>
          <span className="step-inactive">Payment</span>
        </div>

          <div className="shipping-method-title">Shipment Method</div>
          <div className="shipping-method-list">
            <div className="shipping-method-option selected">
              <div className="shipping-method-left">
                <input
                  type="radio"
                  className="shipping-radio"
                  checked
                  readOnly
                />
                <span className="shipping-method-label" style={{ color: "#ff7a00" }}>
                  ₹40
                </span>
                <span className="shipping-method-desc">
                  Standard Delivery (Fixed Shipping)
                </span>
              </div>
              <span className="shipping-method-date">
                {estimatedDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="shipping-summary">
          <div className="shipping-summary-title">Order Summary</div>

          <div className="shipping-summary-row">
            <span>Original Price</span>
            <span style={{ fontWeight: 600 }}>₹{totalOriginal.toFixed(2)}</span>
          </div>
          <div className="shipping-summary-row">
            <span>Total Discount</span>
            <span style={{ color: "#28a745", fontWeight: 600 }}>
              -₹{totalDiscount.toFixed(2)}
            </span>
          </div>
          <div className="shipping-summary-row">
            <span>Shipping</span>
            <span
              className="shipping-summary-free"
              style={{ fontWeight: 600, color: "#ff7a00" }}
            >
              ₹{shippingCost.toFixed(2)}
            </span>
          </div>
          <hr />
          <div className="shipping-summary-total">
            <span>Final Price</span>
            <span style={{ fontWeight: 700 }}>₹{finalTotal.toFixed(2)}</span>
          </div>
          <div className="shipping-summary-delivery">
            Estimated Delivery by <b>{estimatedDelivery}</b>
          </div>

          <button
            className="shipping-summary-checkout-btn"
            onClick={handleProceedCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
