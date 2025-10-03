import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FilterSection from "./FilterSection";
import "../styles/shoppingpage.css";
import { Helmet } from "react-helmet";
import { useApiData } from "../ApiContext";

const BASE_URL = "https://jyotisika.in/jyotisika_test/User_Api_Controller";

const ShopSection = ({ setCartCount, cartCount }) => {
    const { latestApiData } = useApiData();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState({}); // ✅ Track added products
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("best");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  // ✅ Fetch products
  useEffect(() => {
    let apiUrl = `${BASE_URL}/getproduct`;

    if (selectedCategory === "rudraksha") {
      apiUrl = `${BASE_URL}/show_rudraksh`;
    } else if (selectedCategory === "stone") {
      apiUrl = `${BASE_URL}/show_energy_stones`;
    }

    setLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        if (res.data.status === "success") {
          setProducts(res.data.data);
          setFiltered(res.data.data);
          setCurrentPage(1); // reset to first page when category changes
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);
useEffect(() => {
    const apiUrl = `${BASE_URL}/getproduct`;
    if (latestApiData[apiUrl]?.status === "success") {
      setProducts(latestApiData[apiUrl].data);
    }
  }, [latestApiData]);
  // ✅ Apply filters
  useEffect(() => {
    let updated = [...products];

    if (selectedCategory !== "all") {
      updated = updated.filter((p) => p.category === selectedCategory);
    }

    if (priceFilter !== "all") {
      updated = updated.filter((p) => {
        const price = parseFloat(p.discount_price);
        if (priceFilter === "0-499") return price >= 0 && price <= 499;
        if (priceFilter === "500-999") return price >= 500 && price <= 999;
        if (priceFilter === "1000-1999") return price >= 1000 && price <= 1999;
        if (priceFilter === "2000+") return price >= 2000;
        return true;
      });
    }

    if (availabilityFilter !== "all") {
      updated = updated.filter((p) => {
        const stock = parseInt(p.stock || p.quantity || 0);
        if (availabilityFilter === "in") return stock > 0;
        if (availabilityFilter === "out") return stock === 0;
        return true;
      });
    }

    // Always sort by newest first (latest products first)
    updated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // If user selects price sort, override
    if (sortBy === "price-asc") {
      updated.sort((a, b) => a.discount_price - b.discount_price);
    } else if (sortBy === "price-desc") {
      updated.sort((a, b) => b.discount_price - a.discount_price);
    }

    setFiltered(updated);
    setCurrentPage(1); // reset page on filter change
  }, [selectedCategory, priceFilter, availabilityFilter, sortBy, products]);

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Add to Cart API (now updates button state)
  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setStatus("danger");
        setMessage("⚠️ Please login first to add products.");
        navigate("/user/login");
        return;
      }

      const payload = new FormData();
      payload.append("product_id", product.product_id);
      payload.append("product_price", product.discount_price);
      payload.append("session_id", userId);
      payload.append("quantity", 1);

      const res = await axios.post(`${BASE_URL}/AddToCart`, payload);

      if (res.data.status === "success") {
        setStatus("success");
        setMessage("✅ Product added to cart!");
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Product successfully added to cart.",
          timer: 1800,
          showConfirmButton: false,
        });

        // ✅ update cart count dynamically
        window.dispatchEvent(new Event("cartUpdated"));
        setCartCount(cartCount + 1)

        // ✅ mark product as added
        setCart((prev) => ({ ...prev, [product.product_id]: true }));
      } else {
        setStatus("danger");
        setMessage(res.data.message || "❌ Failed to add product.");
      }
    } catch (error) {
      console.error("AddToCart error:", error);
      setStatus("danger");
      setMessage("❌ Server error while adding to cart.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div
      className="pt-5"
      style={{
        width: "94%",
        margin: "0 auto",
        borderRadius: "12px",
        color: "#6D1D11",
      }}
    >
    <Helmet>
        <title>Jyotisika Mall | Shop</title>
    </Helmet>
      <div className="w-100">
        {/* ✅ Filters */}
        <FilterSection
          onCategoryChange={setSelectedCategory}
          onPriceChange={setPriceFilter}
          onSortChange={setSortBy}
          onAvailabilityChange={setAvailabilityFilter}
          onClearFilters={() => {
            setSelectedCategory("all");
            setPriceFilter("all");
            setSortBy("best");
            setAvailabilityFilter("all");
          }}
        />

        {/* ✅ Heading */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold"
            style={{ letterSpacing: "1px", fontSize: "36px", fontWeight: "500" }}
          >
            Shop Our Best Sellers
          </h1>
        </div>

        {/* ✅ Messages */}
        {message && (
          <div className={`alert alert-${status} text-center`}>{message}</div>
        )}

        {/* ✅ Product Grid */}
        <div className="row g-4" style={{ marginTop: "20px" }}>
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-warning"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading...</p>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((product) => {
              let images = [];
              try {
                images = Array.isArray(product.product_image)
                  ? product.product_image
                  : JSON.parse(product.product_image || "[]");
              } catch {
                images = [];
              }

              const isAdded = cart[product.product_id];

              return (
                <div
                  key={product.product_id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mt-4"
                >
                  <div
                    className="card"
                    style={{
                      width: "303px",
                      height: "415.93px",
                      borderRadius: "12px",
                      transition: "transform 0.3s ease",
                      backgroundColor: "transparent",
                      gap: "20px",
                    }}
                  >
                    {/* ✅ Image */}
                    <Link
                      to={`/product/${product.product_id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        className="position-relative"
                        style={{
                          width: "100%",
                          height: "298px",
                          overflow: "hidden",
                          borderRadius: "8px",
                        }}
                      >
                        {images.length > 0 ? (
                          <img
                            src={`https://jyotisika.in/jyotisika_test/uploads/products/${images[0]}`}
                            alt={product.product_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "0.4s ease",
                              objectPosition: "center",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "304px",
                              background: "#eee",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#999",
                              fontSize: "14px",
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* ✅ Card Body */}
                    <div className="card-body px-1 py-1">
                      <h6 className="fw-semibold" style={{ fontSize: "16px" }}>
                        {product.product_name.length > 25
                          ? `${product.product_name.substring(0, 28)}...`
                          : product.product_name}
                      </h6>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: "14px", color: "#000" }}>
                          {product.category}
                        </span>
                        <span style={{ color: "#FF9800", fontSize: "16px" }}>
                          ★★★★★
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#E17100",
                            }}
                          >
                            ₹{product.discount_price}
                          </span>
                          {product.product_price !== product.discount_price && (
                            <del className="ms-2" style={{ fontSize: "12px" }}>
                              ₹{product.product_price}
                            </del>
                          )}
                          {product.product_price && Number(product.product_price) > Number(product.discount_price) && (
                            <span style={{ color: "green", fontWeight: 600, fontSize: "12px", marginLeft: "6px" }}>
                              {`(${Math.round(((Number(product.product_price) - Number(product.discount_price)) / Number(product.product_price)) * 100)}% OFF)`}
                            </span>
                          )}
                        </div>

                        {isAdded ? (
                          <button
                            className="fw-semibold"
                            style={{
                              backgroundColor: "#4CAF50",
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "5px 13px",
                              fontSize: "12px",
                              border: "none",
                              cursor: "default",
                            }}
                            disabled
                          >
                            ✓ Added
                          </button>
                        ) : (
                          <button
                            className="fw-semibold"
                            style={{
                              backgroundColor: "#E17100",
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "5px 13px",
                              fontSize: "12px",
                              border: "none",
                            }}
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>

        {/* ✅ Pagination Controls */}
        {totalPages > 1 && (
          <div className="custom-pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ‹ Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-btn ${currentPage === index + 1 ? "active" : ""
                  }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSection;
