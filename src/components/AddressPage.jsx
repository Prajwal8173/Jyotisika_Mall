import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddressPage.css";

const BASE_URL = "https://jyotisika.in/jyotisika_test";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartSummary, setCartSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [newAddress, setNewAddress] = useState({
    user_fullname: "",
    user_Address: "",
    user_city: "",
    user_state: "",
    user_pincode: "",
    user_phonenumber: "",
    user_email: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  // ✅ Fetch saved addresses
  const fetchAddresses = async () => {
    if (!userId) return;

    try {
      const payload = new FormData();
      payload.append("session_id", userId);

      const res = await axios.post(
        `${BASE_URL}/User_Api_Controller/get_delivery_address`,
        payload
      );

      if (res.data.status === "success") {
        setAddresses(res.data.data);
        setSelectedAddress(res.data.data[0]?.user_info_id || null);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // ✅ Save new address
  const saveAddress = async () => {
    try {
      const payload = new FormData();
      Object.keys(newAddress).forEach((key) => {
        payload.append(key, newAddress[key]);
      });
      payload.append("session_id", userId);

      const res = await axios.post(
        `${BASE_URL}/User_Api_Controller/save_delivery_address`,
        payload
      );

      if (res.data.status === "success") {
        alert("Address added successfully");
        setShowForm(false);
        fetchAddresses();
      } else {
        alert(res.data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Dummy remove handler
  const removeAddress = async (id) => {
    alert(`Remove API not provided yet. Removing ID: ${id}`);
    fetchAddresses();
  };

  // ✅ Fetch cart data (dynamic summary)
  const fetchCartSummary = async () => {
    if (!userId) return;

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
        let totalDiscounted = 0;

        items.forEach((item) => {
          const qty = parseInt(item.product_quantity) || 1;
          const original = parseFloat(item.product_price) || 0;
          const discounted = parseFloat(item.discount_price) || original;

          totalOriginal += original * qty;
          totalDiscounted += discounted * qty;
        });

        const totalDiscount = totalOriginal - totalDiscounted;
        const shipping = totalDiscounted >= 500 ? 0 : 40;
        const total = totalDiscounted ;

        setCartSummary({
          items,
          totalOriginal,
          totalDiscount,
          shipping,
          total,
        });
      }
    } catch (error) {
      console.error("Error fetching cart summary:", error);
    }
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Please select an address before proceeding.");
      return;
    }
    navigate("/shipping", { state: { selectedAddress, cartSummary } });
  };

  // ✅ Estimated delivery after 10 days
  const date = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  const futureDate = new Date(date);
  futureDate.setDate(date.getDate() + 10);
  const EstimatedDeliveryBy = `${futureDate.getDate().toString().padStart(2, "0")} ${months[futureDate.getMonth()]}, ${futureDate.getFullYear()}`;

  useEffect(() => {
    fetchAddresses();
    fetchCartSummary();
  }, []);

  return (
    <div className="page-container">
      {/* -------- Left Section - Addresses -------- */}
      <div className="address-section">
        {/* Stepper */}
        <div className="address-header">
          <span className="step-active">Address</span>
          <span className="step-arrow">&nbsp;&gt;&nbsp;</span>
          <span className="step-inactive">Shipping</span>
          <span className="step-arrow">&nbsp;&gt;&nbsp;</span>
          <span className="step-inactive">Payment</span>
        </div>

        {addresses.length > 0 ? (
          addresses.map((addr, idx) => (
            <div
              key={addr.user_info_id}
              className={`address-card${selectedAddress === addr.user_info_id ? " active" : ""}`}
            >
              <input
                type="radio"
                checked={selectedAddress === addr.user_info_id}
                onChange={() => setSelectedAddress(addr.user_info_id)}
                style={{
                  accentColor: selectedAddress === addr.user_info_id ? "#ff7a00" : "#ccc",
                  marginRight: 12,
                  width: 18,
                  height: 18
                }}
              />
              <div className="address-left">
                <div className="address-title">
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      color: selectedAddress === addr.user_info_id ? "#222" : "#444"
                    }}
                  >
                    {addr.user_name}
                  </span>
                  <span
                    className="address-type"
                    style={{
                      background: "#fff8ef",
                      color: "#ff7a00",
                      border: "1px solid #ff7a00",
                      fontWeight: 500,
                      fontSize: 13,
                      marginLeft: 8,
                      padding: "2px 10px"
                    }}
                  >
                    {idx === 0 ? "HOME" : "OFFICE"}
                  </span>
                </div>
                <div style={{ fontSize: 15, color: "#222", margin: "6px 0 0 0" }}>
                  {addr.user_address}, {addr.user_city}, {addr.user_state}, {addr.user_pincode}
                </div>
                <div style={{ fontSize: 15, color: "#222", margin: "2px 0 0 0" }}>
                  Contact - {addr.user_phonenumber}
                </div>
              </div>
              
            </div>
          ))
        ) : (
          <p>No saved addresses found.</p>
        )}

        <button className="add-address-btn" onClick={() => setShowForm(!showForm)}>
          <span style={{ fontSize: 22, color: "#ff7a00", fontWeight: 600, marginRight: 6 }}>+</span> Add New Address
        </button>

        {/* Add Address Form */}
        {showForm && (
          <div className="address-form">
            <input
              type="text"
              placeholder="Full Name"
              value={newAddress.user_fullname}
              onChange={(e) => setNewAddress({ ...newAddress, user_fullname: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              value={newAddress.user_Address}
              onChange={(e) => setNewAddress({ ...newAddress, user_Address: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.user_city}
              onChange={(e) => setNewAddress({ ...newAddress, user_city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.user_state}
              onChange={(e) => setNewAddress({ ...newAddress, user_state: e.target.value })}
            />
            <input
              type="text"
              placeholder="Pincode"
              value={newAddress.user_pincode}
              onChange={(e) => setNewAddress({ ...newAddress, user_pincode: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newAddress.user_phonenumber}
              onChange={(e) => setNewAddress({ ...newAddress, user_phonenumber: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newAddress.user_email}
              onChange={(e) => setNewAddress({ ...newAddress, user_email: e.target.value })}
            />
            <button onClick={saveAddress}>Save Address</button>
          </div>
        )}
      </div>

      {/* -------- Right Section - Order Summary -------- */}
      <div className="summary-section">
        <h3 style={{ fontSize: 26, fontWeight: 500, marginBottom: 24 }}>Order Summary</h3>

        {cartSummary && (
          <>
            <div className="summary-row">
              <span>Original Price</span>
              <span style={{ fontWeight: 600 }}>₹{cartSummary.totalOriginal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Total Discount</span>
              <span style={{ color: "#28a745", fontWeight: 600 }}>-₹{cartSummary.totalDiscount.toFixed(2)}</span>
            </div>
            
            <hr />
            <div className="summary-total">
              <span> Price </span>
              <span style={{ fontWeight: 700 }}>₹{cartSummary.total.toFixed(2)}</span>
            </div>

            <div style={{ fontSize: 15, margin: "18px 0 0 0", color: "#222" }}>
              Estimated Delivery by <b>{EstimatedDeliveryBy}</b>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
