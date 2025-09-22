import React, { useState, useEffect } from "react";
import rakhi from "../assets/rakhi.png";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

// initial form state
const initialFormState = {
  displayName: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const Myaccount = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState("account"); // sidebar tab
  const [form, setForm] = useState(initialFormState); // form state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  // fetch address
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const response = await axios.post(
          "https://jyotisika.in/jyotisika_test/User_Api_Controller/get_delivery_address",
          { user_id: userId }
        );

        if (response.data.status === "success") {
          setAddresses(response.data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await axios.post(
          "https://jyotisika.in/jyotisika_test/User_Api_Controller/showorderedproducts",
          { user_id: userId }
        );

        if (response.data.status === "success" && response.data.data) {
          setOrders(response.data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // fetch session info (instead of getuser_info)
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(
          "https://jyotisika.in/jyotisika_test/User_Api_Controller/getSessionData",
          { withCredentials: true }
        );

        if (response.data.status === "success" && response.data.session_data) {
          const session = response.data.session_data;

          setForm({
            displayName: session.user_name || "",
            email: session.user_email || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("❌ Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  // handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // validate inputs
  const validate = () => {
    const nextErrors = {};
    if (!form.displayName.trim())
      nextErrors.displayName = "Customer name is required";

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (form.newPassword || form.confirmPassword || form.oldPassword) {
      if (!form.oldPassword)
        nextErrors.oldPassword = "Old password is required";
      if (!form.newPassword) nextErrors.newPassword = "New password is required";
      if (form.newPassword && form.newPassword.length < 8) {
        nextErrors.newPassword = "New password must be at least 8 characters";
      }
      if (form.newPassword !== form.confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const payload = { ...form };
      if (!form.oldPassword && !form.newPassword && !form.confirmPassword) {
        delete payload.oldPassword;
        delete payload.newPassword;
        delete payload.confirmPassword;
      }
      if (onSubmit) {
        await onSubmit(payload);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // error renderer
  const renderError = (field) =>
    errors[field] ? (
      <div className="invalid-feedback d-block">{errors[field]}</div>
    ) : null;

  // tab content
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div>
            <div className="p-4 rounded" style={{ backgroundColor: "#fefaea" }}>
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <h5 className="fw-semibold mb-3">Account Details</h5>
                  </div>

                  {/* ✅ Customer Name */}
                  <div className="col-12">
                    <label htmlFor="displayName" className="form-label">
                      Customer Name *
                    </label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      className={`form-control ${
                        errors.displayName ? "is-invalid" : ""
                      }`}
                      placeholder="Customer name"
                      value={form.displayName}
                      onChange={handleChange}
                    />
                    {renderError("displayName")}
                  </div>

                  {/* ✅ Email */}
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {renderError("email")}
                  </div>

                  {/* ✅ Password Section */}
                  <div className="col-12">
                    <hr className="my-4" />
                    <h5 className="fw-semibold mb-3">Password</h5>
                  </div>

                  <div className="col-12">
                    <label htmlFor="oldPassword" className="form-label">
                      Old password
                    </label>
                    <input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      className={`form-control ${
                        errors.oldPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Old password"
                      value={form.oldPassword}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    {renderError("oldPassword")}
                  </div>

                  <div className="col-12">
                    <label htmlFor="newPassword" className="form-label">
                      New password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className={`form-control ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                      placeholder="New password"
                      value={form.newPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {renderError("newPassword")}
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label"
                    >
                      Repeat new password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Repeat new password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {renderError("confirmPassword")}
                  </div>

                  <div className="col-12">
                    <hr className="my-4" />
                    <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3">
                      <button
                        type="submit"
                        className="btn"
                        disabled={submitting}
                        style={{ backgroundColor: "#fd8b07" }}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );

      case "address":
        return (
          <div>
            <h3>Address</h3>
            <div className="row mt-5">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div
                    key={addr.user_info_id}
                    className="col-5 border border-2 border-secondary p-4 m-2"
                    style={{ borderRadius: "1.5rem" }}
                  >
                    <div className="row">
                      <div className="col-8">
                        <h5>{addr.user_name}</h5>
                      </div>
                      <div className="col-4 btn">
                        <i className="bi bi-pencil-square"></i> edit
                      </div>
                    </div>
                    <p>
                      {addr.user_address}, {addr.user_city}, {addr.user_state} -{" "}
                      {addr.user_pincode}
                    </p>
                    <p>
                      Phone: {addr.user_phonenumber} <br />
                      Email: {addr.user_email || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No addresses found.</p>
              )}
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="container mt-4">
            <h3 className="mb-4">Order History</h3>
            {orders.length > 0 ? (
              <table
                className="table table-striped"
                style={{ backgroundColor: "#fefaea" }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order No</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.order_items_id}>
                      <td>{index + 1}</td>
                      <td>{order.order_no}</td>
                      <td>{order.order_date}</td>
                      <td>{order.status}</td>
                      <td>₹{order.total_price}</td>
                      <td>{order.product_name}</td>
                      <td>{order.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        );

      case "wishlist":
        return (
          <div>
            <h3>Your Wishlist</h3>
            <Table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>
                    <Link to="/product" className="btn btn-dark">
                      {" "}
                      Add to cart
                    </Link>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        );

      case "logout":
        return <div><h3>Log out</h3></div>;

      default:
        return <h3>Welcome to My Account</h3>;
    }
  };

  return (
    <div style={{ backgroundColor: "#fefaea" }}>
      <div className="container-fluid px-3 px-md-4 pb-5">
        <div className="row g-4">
          <h1 className="display-4 fw-bold text-center ">My Account</h1>
          {/* Sidebar */}
          <div className="col-12 col-lg-3 ">
            <div
              className="bg-light p-4 rounded"
              style={{ minHeight: "600px" }}
            >
              <div className="text-center">
                <img
                  src={rakhi}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{
                    height: "120px",
                    width: "120px",
                    objectFit: "cover",
                  }}
                />
                <h4 className="mb-4">User</h4>
              </div>
              <div className=" list-group-flush">
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${
                    activeTab === "account" ? "fw-bold" : ""
                  }`}
                  onClick={() => setActiveTab("account")}
                >
                  Account
                </button>
                <hr />
                <button
                  className={`list-group-item bg-transparent border-0 px-0  m-2 ${
                    activeTab === "address" ? "fw-bold" : ""
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  Address
                </button>
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${
                    activeTab === "orders" ? "fw-bold" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders
                </button>
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${
                    activeTab === "wishlist" ? "fw-bold" : ""
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  Wishlist
                </button>
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${
                    activeTab === "logout" ? "fw-bold" : ""
                  }`}
                  onClick={() => setActiveTab("logout")}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-12 col-lg-9">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;
