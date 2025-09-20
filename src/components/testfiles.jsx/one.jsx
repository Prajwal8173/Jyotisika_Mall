import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FilterSection from "./FilterSection";

const BASE_URL = "https://jyotisika.in/jyotisika_test/User_Api_Controller";

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState({}); // product_id -> quantity
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("best");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch products
  useEffect(() => {
    let apiUrl = `${BASE_URL}/getproduct`;

    if (categoryFilter === "rudraksha") {
      apiUrl = `${BASE_URL}/show_rudraksh`;
    } else if (categoryFilter === "stone") {
      apiUrl = `${BASE_URL}/show_energy_stones`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        if (
          response.data.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [categoryFilter]);

  // ✅ Apply filters
  useEffect(() => {
    let updated = [...products];

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

    if (sortBy === "price-asc") {
      updated.sort((a, b) => a.discount_price - b.discount_price);
    } else if (sortBy === "price-desc") {
      updated.sort((a, b) => b.discount_price - a.discount_price);
    } else if (sortBy === "new") {
      updated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredProducts(updated);
  }, [priceFilter, availabilityFilter, sortBy, products]);

  // ✅ Add to Cart API (first time only)
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

  // ✅ Update Quantity API
  const updateQuantity = async (product, quantity) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const payload = new FormData();
      payload.append("product_id", product.product_id);
      payload.append("session_id", userId);
      payload.append("quantity", quantity);

      const res = await axios.post(`${BASE_URL}/updatequantity`, payload);

      if (res.data.status === "success") {
        setStatus("info");
        setMessage("🔄 Cart quantity updated!");
      } else {
        setStatus("danger");
        setMessage(res.data.message || "❌ Failed to update quantity.");
      }
    } catch (error) {
      console.error("UpdateQuantity error:", error);
      setStatus("danger");
      setMessage("❌ Server error while updating quantity.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Delete from Cart API
  const deleteFromCart = async (product) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const payload = new FormData();
      payload.append("product_id", product.product_id);
      payload.append("session_id", userId);

      const res = await axios.post(
        `${BASE_URL}/deleteproductfromcart`,
        payload
      );

      if (res.data.status === "success") {
        setStatus("success");
        setMessage("🗑️ Product removed from cart!");
      } else {
        setStatus("danger");
        setMessage(res.data.message || "❌ Failed to remove product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("danger");
      setMessage("❌ Server error while removing product.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Handlers
  const handleAdd = (product) => {
    setCart((prev) => ({ ...prev, [product.product_id]: 1 }));
    addToCart(product);
  };

  const handleIncrement = (product) => {
    const newQty = (cart[product.product_id] || 0) + 1;
    setCart((prev) => ({ ...prev, [product.product_id]: newQty }));
    updateQuantity(product, newQty);
  };

  const handleDecrement = (product) => {
    const currentQty = cart[product.product_id] || 0;
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      setCart((prev) => ({ ...prev, [product.product_id]: newQty }));
      updateQuantity(product, newQty);
    } else {
      setCart((prev) => {
        const updated = { ...prev };
        delete updated[product.product_id];
        return updated;
      });
      deleteFromCart(product);
    }
  };

  return (
    <div
      className="pt-5"
      style={{
        backgroundColor: "#fefaea",
        borderRadius: "12px",
        color: "#6D1D11",
      }}
    >
      <div className="container">
        {/* ✅ Filters */}
        <FilterSection
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onPriceChange={setPriceFilter}
          onSortChange={setSortBy}
          onAvailabilityChange={setAvailabilityFilter}
          onClearFilters={() => {
            setCategoryFilter("all");
            setPriceFilter("all");
            setSortBy("best");
            setAvailabilityFilter("all");
          }}
        />

        {/* ✅ Heading */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ letterSpacing: "1px" }}>
            ✨ Shop Our Best Sellers ✨
          </h1>
          <p className="text-muted small">
            Discover handpicked items curated specially for you
          </p>
        </div>

        {/* ✅ Messages */}
        {message && (
          <div className={`alert alert-${status} text-center`}>{message}</div>
        )}

        {/* ✅ Product Grid */}
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const qty = cart[product.product_id] || 0;
              return (
                <div
                  key={product.product_id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                >
                  <div
                    className="card h-100 border-0 shadow-sm w-100"
                    style={{
                      backgroundColor: "rgb(254, 250, 234)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-6px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {/* ✅ Clickable link */}
                    <Link
                      to={`/product/${product.product_id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        className="position-relative"
                        style={{
                          aspectRatio: "303/406",
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: "8px 8px 0 0",
                        }}
                      >
                        <img
                          src={`https://jyotisika.in/jyotisika_test/uploads/products/${product.product_image}`}
                          className="card-img-top"
                          alt={product.product_name}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            transition: "0.4s ease",
                          }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column text-center">
                        <h5 className="card-title">{product.product_name}</h5>
                        <p className="small text-muted">
                          {product.product_description?.substring(0, 50)}...
                        </p>

                        <div className="mb-3">
                          <span className="fw-bold fs-6">
                            ₹{product.discount_price}
                          </span>
                          {product.product_price !==
                            product.discount_price && (
                              <del className="ms-2 text-muted small">
                                ₹{product.product_price}
                              </del>
                            )}
                        </div>
                      </div>
                    </Link>

                    {/* ✅ Cart Buttons */}
                    <div className="card-footer bg-transparent border-0 d-flex justify-content-center">
                      {qty === 0 ? (
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#E17100",
                            color: "#fff",
                            borderRadius: "20px",
                          }}
                          onClick={() => handleAdd(product)}
                        >
                          🛒 Add
                        </button>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleDecrement(product)}
                          >
                            -
                          </button>
                          <span className="fw-bold">{qty}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleIncrement(product)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>

        {/* View More */}
        <div className="text-center mt-5">
          <Link
            to="/shop"
            className="btn border border-2 border-dark px-4 py-2"
            style={{
              backgroundColor: "#E17100",
              color: "#fff",
              borderRadius: "30px",
              fontWeight: "500",
            }}
          >
            View More Products →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopSection;