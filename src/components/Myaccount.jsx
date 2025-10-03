import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";


// initial form state
const initialFormState = {
  firstName: "",
  lastName: "",
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
        // ✅ Get user_id from localStorage and treat it as session_id
        const userId = localStorage.getItem("user_id");
        console.log("User ID (used as session_id):", userId);

        if (!userId) {
          console.warn("⚠️ No user_id found in localStorage");
          return;
        }

        const formData = new FormData();
        formData.append("session_id", userId); // 👈 send userId as session_id

        const response = await axios.post(
          "https://jyotisika.in/jyotisika_test/User_Api_Controller/get_delivery_address",
          formData
        );

        console.log("Account address response:", response.data);

        if (response.data.status === "success") {
          setAddresses(response.data.data); // ✅ update state with addresses
        } else {
          setAddresses([]);
          console.warn("⚠️ Address fetch failed:", response.data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching addresses:", error);
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, []);


  //  Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.warn("⚠️ No user_id found in localStorage");
        return; // user not logged in
      }

      try {
        // ✅ Send user_id inside FormData
        const formData = new FormData();
        formData.append("user_id", userId);

        const response = await axios.post(
          "https://Jyotisika.in/jyotisika_test/User_Api_Controller/showorderedproducts",
          formData
        );

        console.log("Orders response:", response.data);

        if (response.data.status === "success" && response.data.data) {
          setOrders(response.data.data); // ✅ update orders state
        } else {
          setOrders([]);
          console.warn("⚠️ Orders fetch failed:", response.data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
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
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.displayName.trim()) nextErrors.displayName = "Display name is required";

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    // password validation
    if (form.newPassword || form.confirmPassword || form.oldPassword) {
      if (!form.oldPassword) nextErrors.oldPassword = "Old password is required";
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

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not logged in!");
        return;
      }

      // Create form-data
      const formData = new FormData();
      formData.append("session_id", userId);
      formData.append("user_name", form.firstName + " " + form.lastName); // required
      formData.append("user_gender", form.gender || ""); // required, you may add gender input in form
      formData.append("user_dob", form.dob || ""); // required, you may add DOB input in form
      formData.append("user_TimeofBirth", form.timeOfBirth || "");
      formData.append("user_PlaceofBirth", form.placeOfBirth || "");
      formData.append("user_CurrentAddress", form.address || "");
      formData.append("user_City", form.city || "");
      formData.append("user_Pincode", form.pincode || "");
      formData.append("current_image_name", form.currentImage || ""); // old image path

      if (form.newImage) {
        formData.append("user_image", form.newImage); // new image file
      }

      // Send POST request to backend
      const response = await axios.post(
        "https://hpclsparesportal.in/jyotisika_test/User_Api_Controller/update_userprofile",
        formData
      );

      console.log("Update response:", response.data);

      if (response.data.status === "success") {
        alert("✅ Profile updated successfully!");
      } else {
        alert("⚠️ " + (response.data.message || "Failed to update profile"));
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };



  // fetch user details
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("user_id"); // frontend stores user_id
        if (!userId) {
          console.warn("⚠️ No user_id found in localStorage");
          return;
        }

        // ✅ Create form-data with session_id = userId
        const formData = new FormData();
        formData.append("session_id", userId);

        const response = await axios.post(
          "https://Jyotisika.in/jyotisika_test/User_Api_Controller/getuser_info",
          formData
        );

        console.log("User info API response:", response.data);

        if (response.data.status === "success" && response.data.data) {
          const user = response.data.data;

          // ✅ Map API fields to your form structure
          setForm({
            firstName: user.user_name?.split(" ")[0] || "",   // take first word from full name
            lastName: user.user_name?.split(" ")[1] || "",    // second word if available
            displayName: user.user_name || "",                // full name as displayName
            email: user.user_email || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          console.warn("⚠️ User info fetch failed:", response.data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);




  //Update profile and username
  const [profile, setProfile] = useState({
    image: rakhi,   // default image
    name: "User",
  });
  const [newImage, setNewImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file); // store new image
      setProfile((prev) => ({
        ...prev,
        image: URL.createObjectURL(file), // preview
      }));
    }
  };

  // When saving/updating profile
  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId || !newImage) return;

    const formData = new FormData();
    formData.append("session_id", userId);
    formData.append("user_image", newImage);

    try {
      const response = await axios.post(
        "https://Jyotisika.in/jyotisika_test/User_Api_Controller/update_user_info",
        formData
      );

      if (response.data.status === "success") {
        alert("Profile updated successfully!");
        setNewImage(null); // ✅ this hides the save button
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const formData = new FormData();
        formData.append("session_id", userId);

        const response = await axios.post(
          "https://Jyotisika.in/jyotisika_test/User_Api_Controller/getuser_info",
          formData
        );

        if (response.data.status === "success" && response.data.data) {
          const user = response.data.data;

          setProfile({
            name: user.user_name || "User",
            image: user.user_image || rakhi,
          });

          // Optional: prefill form fields as well
          setForm((prev) => ({
            ...prev,
            firstName: user.user_name?.split(" ")[0] || "",
            lastName: user.user_name?.split(" ")[1] || "",
            displayName: user.user_name || "",
            email: user.user_email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);



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
          <div >
            <div className="p-4 rounded" style={{ backgroundColor: "#fefaea" }}>
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <h5 className="fw-semibold mb-3">Account Details</h5>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="firstName" className="form-label">First name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                      placeholder="First name"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                    {renderError("firstName")}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                    {renderError("lastName")}
                  </div>

                  <div className="col-12">
                    <label htmlFor="displayName" className="form-label">Display name *</label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
                      placeholder="Display name"
                      value={form.displayName}
                      onChange={handleChange}
                    />
                    <div className="form-text">
                      This will be how your name will be displayed in the account section and in reviews
                    </div>
                    {renderError("displayName")}
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {renderError("email")}
                  </div>

                  <div className="col-12">
                    <hr className="my-4" />
                    <h5 className="fw-semibold mb-3">Password</h5>
                  </div>

                  <div className="col-12">
                    <label htmlFor="oldPassword" className="form-label">Old password</label>
                    <input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      className={`form-control ${errors.oldPassword ? "is-invalid" : ""}`}
                      placeholder="Old password"
                      value={form.oldPassword}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    {renderError("oldPassword")}
                  </div>

                  <div className="col-12">
                    <label htmlFor="newPassword" className="form-label">New password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                      placeholder="New password"
                      value={form.newPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {renderError("newPassword")}
                  </div>

                  <div className="col-12">
                    <label htmlFor="confirmPassword" className="form-label">Repeat new password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
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
                      <button type="submit" className="btn" disabled={submitting} style={{ backgroundColor: "#fd8b07" }}>
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
              <table className="table table-striped" style={{ backgroundColor: "#fefaea" }}>
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
        return <div><h3>Your Wishlist</h3>
          <Table
          >
            <thead>
              <tr>
                <th>
                  Product
                </th>
                <th>
                  Price
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>

                <td>
                  Mark
                </td>
                <td>
                  Otto
                </td>
                <td>
                  <Link to="/product" className="btn btn-dark" > Add to cart</Link>
                </td>
              </tr>

            </tbody>
          </Table></div>;
      case "logout":
        return <div><h3>log out</h3>
        <button className="btn btn-secondary">Log Out</button></div>;
      default:
        return <h3>Welcome to My Account</h3>;
    }
  };

  return (
    <div style={{ backgroundColor: "#fefaea" }}>
      <div className="container-fluid px-3 px-md-4 pb-5 ">
        <div className="row g-4">
          <h1 className="display-4 fw-bold text-center ">My Account</h1>
          {/* Sidebar */}
          <div className="col-12 col-lg-3 text-center">
            <div className="bg-light p-4 rounded" style={{ minHeight: "600px" }}>
              <div className="position-relative d-inline-block">
                <img
                  src={profile.image}
                  alt="Profile"
                  className="rounded-circle mb-2"
                  style={{ height: "120px", width: "120px", objectFit: "cover" }}
                />

                <label
                  htmlFor="profileImageInput"
                  className="position-absolute d-flex justify-content-center align-items-center"
                  style={{
                    top: "0",
                    right: "0",
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    cursor: "pointer",
                    border: "2px solid #fff",
                    marginTop:"90px",
                    marginRight:"45px",
                    transform: "translate(50%, -50%)",
                  }}
                >
                  <i className="bi bi-camera"></i>
                </label>

                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <h4 className="mt-2">{profile.name}</h4>

                {/* Save button to upload the new image */}
                {newImage && (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSaveProfile}  // triggers upload
                  >
                    Save Profile Image
                  </button>
                )}
              </div>


              <div className=" list-group-flush">
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${activeTab === "account" ? "fw-bold" : ""}`}
                  onClick={() => setActiveTab("account")}
                >
                  Account
                </button>
                <hr />
                <button
                  className={`list-group-item bg-transparent border-0 px-0  m-2 ${activeTab === "address" ? "fw-bold" : ""}`}
                  onClick={() => setActiveTab("address")}
                >
                  Address
                </button>
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${activeTab === "orders" ? "fw-bold" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders
                </button>
                <button
                  className={`list-group-item bg-transparent border-0 px-0 m-2 ${activeTab === "wishlist" ? "fw-bold" : ""}`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  Wishlist
                </button>
                <button className={`list-group-item bg-transparent border-0 px-0 m-2 ${activeTab === "logout" ? "fw-bold" : ""}`}
                  onClick={() => setActiveTab("logout")}>Log out

                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-12 col-lg-9">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;


