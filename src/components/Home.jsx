import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import { ArrowLeft } from "lucide-react";

const CI_LOGIN_URL =
  "https://jyotisika.in/jyotisika_test/UserLoginSignup/Login";
const GET_SESSION_URL =
  "https://jyotisika.in/jyotisika_test/User_Api_Controller/getSessionData";
const LOGOUT_URL =
  "https://jyotisika.in/jyotisika_test/User_Api_Controller/logout";
const GET_CART_URL =
  "https://jyotisika.in/jyotisika_test/User_Api_Controller/GetCartData";

const Home = ({ setCartCount, cartCount }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(GET_SESSION_URL, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data?.status === "success" && data.session_data?.user_id) {
          const { user_id, mobile_number } = data.session_data;

          localStorage.setItem("user_id", user_id);
          localStorage.setItem("mobile_number", mobile_number);

          setSessionData({ user_id, mobile_number });
          fetchCartData(user_id);
        } else {
          setSessionData(null);
          setCartCount(0);
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
        setSessionData(null);
      } finally {
        setLoadingSession(false);
      }
    };

    fetchSession();
  }, []);

  // ✅ Fetch cart count
  const fetchCartData = async (userId) => {
    try {
      const formData = new FormData();
      formData.append("session_id", userId);

      const res = await fetch(GET_CART_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data?.status === "success") {
        setCartCount(data.data.length);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Cart fetch failed:", err);
      setCartCount(0);
    }
  };

  // ✅ Close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await fetch(LOGOUT_URL, { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user_id");
    localStorage.removeItem("mobile_number");
    sessionStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
    });

    setSessionData(null);
    setShowDropdown(false);
    setCartCount(0);

    window.location.href = CI_LOGIN_URL;
  };

  // ✅ Cart handler
  const handleCartClick = () => {
    if (loadingSession) {
      alert("Please wait...");
      return;
    }
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate(`/cart/${userId}`);
    } else {
      window.location.href = CI_LOGIN_URL;
    }
  };

  // ✅ Profile handler
  const handleProfileClick = () => {
    if (loadingSession) {
      alert("Please wait...");
      return;
    }
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setShowDropdown(!showDropdown);
    } else {
      window.location.href = CI_LOGIN_URL;
    }
  };

  return (
    <header className="home-header">
      {/* Top Bar */}
      <div className="top-bar d-flex align-items-center justify-content-between px-3 px-md-4 py-1">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="flex-grow-1 d-none d-md-flex justify-content-center">
          <h6 className="m-0 fw-semibold top-bar-text tube-text text-center">
            Checkout Our Exciting New Launches 🚀
          </h6>
        </div>

        <div className="d-flex justify-content-end gap-2 gap-md-3 social-icons">
          <i className="bi bi-facebook"></i>
          <i className="bi bi-instagram"></i>
          <i className="bi bi-youtube"></i>
        </div>
      </div>

      {/* Navigation */}
      <div
        className="nav-row row align-items-center py-2 px-3 px-md-4"
        style={{ backgroundColor: "#fefaea" }}
      >
        {/* Logo */}
        <div className="col-6 col-md-2 d-flex justify-content-start">
          <Link to="/">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/bxn4s0bj_expires_30_days.png"
              className="brand-logo img-fluid"
              alt="Logo"
              style={{ maxHeight: "50px" }}
            />
          </Link>
        </div>

        {/* Nav links */}
        <div className="col-md-8 d-none d-md-flex justify-content-center flex-wrap nav-links">
          {[
            "Products",
            "Shop by purpose",
            "Siddh collection",
            "Sawan Sale",
            "Astro Stone",
            "Festival",
          ].map((item, idx) => (
            <span
              key={idx}
              className="nav-item mx-2"
              style={{ fontSize: "14px", whiteSpace: "nowrap" }}
            >
              {item}
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/2eksad0c_expires_30_days.png"
                alt="Arrow"
                className="arrow-icon ms-1"
                style={{ width: "10px", height: "10px" }}
              />
            </span>
          ))}
        </div>

        {/* Right icons */}
        <div className="col-6 col-md-2 d-flex justify-content-end gap-3 action-icons">
          {/* Search */}
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/usti218l_expires_30_days.png"
            className="icon-img"
            alt="Search"
            onClick={() => setShowSearch(!showSearch)}
            style={{ cursor: "pointer" }}
          />

          {/* Profile */}
          <div className="profile-wrapper position-relative" ref={dropdownRef}>
            {sessionData?.user_id ? (
              <>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                  className="icon-img"
                  alt="Profile"
                  onClick={handleProfileClick}
                  style={{ cursor: "pointer" }}
                />
                {showDropdown && (
                  <div
                    className="account-popup text-center shadow-sm"
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      backgroundColor: "white",
                      color: "#212529",
                      padding: "15px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      width: "270px",
                      zIndex: 1000,
                    }}
                  >
                    <h6 className="mb-3">Account</h6>

                    <button
                      className="btn mb-2 w-100"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        window.location.href =
                          "https://jyotisika.in/jyotisika_test/UserProfile";
                        setShowDropdown(false);
                      }}
                    >
                      <i className="bi bi-person-circle me-2"></i>My Account
                    </button>

                    <button
                      className="btn mb-2 w-100"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        window.location.href =
                          "https://jyotisika.in/jyotisika_test/Notification";
                        setShowDropdown(false);
                      }}
                    >
                      <i className="bi bi-bell me-2"></i>Notifications
                    </button>

                    <button
                      className="btn mb-2 w-100"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        window.location.href =
                          "https://jyotisika.in/jyotisika_test/Orders";
                        setShowDropdown(false);
                      }}
                    >
                      <i className="bi bi-bag me-2"></i>My Orders
                    </button>

                    <button
                      className="btn mb-2 w-100"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        window.location.href =
                          "https://jyotisika.in/jyotisika_test/Cart";
                        setShowDropdown(false);
                      }}
                    >
                      <i className="bi bi-cart me-2"></i>Your Cart
                    </button>

                    <button
                      className="btn mb-2 w-100"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        window.location.href =
                          "https://jyotisika.in/jyotisika_test/Following";
                        setShowDropdown(false);
                      }}
                    >
                      <i className="bi bi-heart me-2"></i>Following
                    </button>

                    <button
                      className="btn mb-2 w-100"
                      style={{ fontSize: "18px" }}
                      onClick={() => {
                        window.location.href =
                          "https://jyotisika.in/jyotisika_test/CustomerSupport";
                        setShowDropdown(false);
                      }}
                    >
                      <i className="bi bi-gear me-2"></i>Customer Support
                    </button>

                    <button
                      className="btn w-100 text-danger"
                      style={{ fontSize: "18px" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                className="icon-img"
                alt="Profile"
                onClick={handleProfileClick}
                style={{ cursor: "pointer", opacity: loadingSession ? 0.5 : 1 }}
              />
            )}
          </div>

          {/* Cart */}
          <div
            className="cart-wrapper position-relative"
            style={{ cursor: "pointer" }}
            onClick={handleCartClick}
          >
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/206cicc1_expires_30_days.png"
              className="icon-img"
              alt="Cart"
              style={{ opacity: loadingSession ? 0.5 : 1 }}
            />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className={`search-box-wrapper ${showSearch ? "open" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          className="form-control search-input"
        />
        <button
          className="btn-close-search"
          onClick={() => setShowSearch(false)}
        >
          ✕
        </button>
      </div>
    </header>
  );
};

export default Home;
