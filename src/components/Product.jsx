import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, Shield, ArrowLeft, ArrowRight } from "lucide-react";
import "../styles/ProductPage.css";

// Star Rating Component
const StarRating = ({ rating = 5, size = 14, showNumber = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: showNumber ? "flex-start" : "center", marginBottom: showNumber ? "0" : "8px" }}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? "#fbbf24" : "none"}
        color={i < rating ? "#fbbf24" : "#d1d5db"}
      />
    ))}
    {showNumber && <span style={{ marginLeft: "8px", fontSize: "14px", color: "#6b7280" }}>({rating})</span>}
  </div>
);

// Discount Banner Component
const DiscountBanner = () => (
  <div style={{
    backgroundColor: "#f59e0b",
    color: "white",
    padding: "12px 20px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  }}>
    🏷️ ADD 3 ITEMS TO CART TO UNLOCK DISCOUNT
  </div>
);

// Bead Size Selector Component
const BeadSizeSelector = ({ sizes, selectedSize, onSizeSelect }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
      {sizes.map((size, index) => (
        <button
          key={index}
          onClick={() => onSizeSelect(size)}
          style={{
            padding: "10px 20px",
            border: "2px solid",
            borderColor: selectedSize === size ? "#ea580c" : "#e5e7eb",
            backgroundColor: selectedSize === size ? "#ea580c" : "white",
            color: selectedSize === size ? "white" : "#374151",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

// Top Shopseller Carousel
const TopShopseller = ({ topProducts, onProductSelect, getImageUrl }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const carouselRef = useRef(null);

  const scrollTo = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = 280;
    container.scrollBy({ left: direction === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  };

  const styles = {
    container: { 
      backgroundColor: "#fef3e2", 
      padding: "60px 20px", 
      borderRadius: "12px", 
      margin: "40px 0", 
      position: "relative" 
    },
    title: { 
      fontSize: "36px", 
      fontWeight: "700", 
      color: "#1f2937", 
      textAlign: "center", 
      marginBottom: "40px" 
    },
    carouselWrapper: { 
      overflow: "hidden", 
      position: "relative", 
      padding: "0 25px" 
    },
    carousel: { 
      display: "flex", 
      gap: "20px", 
      overflowX: "auto", 
      scrollBehavior: "smooth", 
      paddingBottom: "10px", 
      scrollbarWidth: "none", 
      msOverflowStyle: "none" 
    },
    card: { 
      backgroundColor: "white", 
      borderRadius: "12px", 
      overflow: "hidden", 
      boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
      cursor: "pointer", 
      minWidth: "260px", 
      maxWidth: "260px", 
      flexShrink: 0, 
      transition: "transform 0.3s ease, box-shadow 0.3s ease" 
    },
    cardHover: { 
      transform: "translateY(-8px)", 
      boxShadow: "0 12px 30px rgba(0,0,0,0.15)" 
    },
    image: { 
      width: "100%", 
      height: "200px", 
      objectFit: "cover" 
    },
    cardBody: { 
      padding: "16px", 
      textAlign: "center" 
    },
    productName: { 
      fontSize: "14px", 
      fontWeight: "600", 
      color: "#1f2937", 
      marginBottom: "8px", 
      lineHeight: "1.4", 
      minHeight: "40px", 
      display: "-webkit-box", 
      WebkitLineClamp: 2, 
      WebkitBoxOrient: "vertical", 
      overflow: "hidden" 
    },
    priceContainer: { 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      gap: "8px", 
      marginBottom: "12px" 
    },
    discountPrice: { 
      fontSize: "18px", 
      fontWeight: "700", 
      color: "#ea580c" 
    },
    originalPrice: { 
      fontSize: "14px", 
      color: "#9ca3af", 
      textDecoration: "line-through" 
    },
    addToCartBtn: { 
      backgroundColor: "#ea580c", 
      color: "white", 
      border: "none", 
      padding: "8px 16px", 
      borderRadius: "6px", 
      fontSize: "12px", 
      fontWeight: "600", 
      cursor: "pointer", 
      width: "100%" 
    },
    navButton: { 
      position: "absolute", 
      top: "50%", 
      transform: "translateY(-50%)", 
      backgroundColor: "white", 
      border: "none", 
      borderRadius: "50%", 
      width: "45px", 
      height: "45px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      cursor: "pointer", 
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)", 
      zIndex: 10 
    },
    navButtonLeft: { left: "-22px" },
    navButtonRight: { right: "-22px" },
    viewAllBtn: { 
      backgroundColor: "#fbbf24", 
      color: "white", 
      border: "none", 
      padding: "12px 32px", 
      borderRadius: "8px", 
      fontSize: "16px", 
      fontWeight: "600", 
      cursor: "pointer", 
      display: "block", 
      margin: "30px auto 0" 
    },
  };

  if (!topProducts || topProducts.length === 0) return null;

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Top Shopseller</h2>
      <div style={styles.carouselWrapper}>
        <button style={{ ...styles.navButton, ...styles.navButtonLeft }} onClick={() => scrollTo("left")}>
          <ChevronLeft size={20} />
        </button>
        <div ref={carouselRef} style={styles.carousel}>
          {topProducts.map((product) => {
            const images = product.product_image || [];
            return images.length > 0 && (
              <div
                key={product.product_id}
                style={{ ...styles.card, ...(hoveredCard === product.product_id ? styles.cardHover : {}) }}
                onMouseEnter={() => setHoveredCard(product.product_id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onProductSelect(product)}
              >
                <img src={getImageUrl(images[0])} alt={product.product_name} style={styles.image} />
                <div style={styles.cardBody}>
                  <h5 style={styles.productName}>{product.product_name}</h5>
                  <StarRating rating={5} size={12} />
                  <div style={styles.priceContainer}>
                    <span style={styles.discountPrice}>₹{Number(product.discount_price).toLocaleString()}</span>
                    {product.product_price && Number(product.product_price) > Number(product.discount_price) && (
                      <span style={styles.originalPrice}>₹{Number(product.product_price).toLocaleString()}</span>
                    )}
                  </div>
                  <button style={styles.addToCartBtn}>Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
        <button style={{ ...styles.navButton, ...styles.navButtonRight }} onClick={() => scrollTo("right")}>
          <ChevronRight size={20} />
        </button>
      </div>
      <button style={styles.viewAllBtn} onClick={() => window.location.href = "/products"}>
        View all
      </button>
    </section>
  );
};

// Reviews Carousel Component
const ReviewsCarousel = ({ reviews, getImageUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (!reviews || reviews.length === 0) return null;

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3).concat(
    reviews.slice(0, Math.max(0, (currentIndex + 3) - reviews.length))
  );

  return (
    <div style={{ 
      backgroundColor: "#fef9f3", 
      padding: "50px 20px", 
      borderRadius: "12px", 
      textAlign: "center" 
    }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "10px", 
          marginBottom: "10px" 
        }}>
          <span style={{ fontSize: "24px" }}>🌾</span>
          <h2 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
            1218+ REVIEWS HAVE SWITCHED TO JYOTISIKA
          </h2>
          <span style={{ fontSize: "24px" }}>🌾</span>
        </div>
        <h3 style={{ fontSize: "32px", fontWeight: "700", margin: "10px 0" }}>
          Jyotisika Promise
        </h3>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Hear from the actors who have elevated their confidence & health by switching to jyotisika.
        </p>
        <StarRating rating={5} size={16} showNumber={false} />
        <span style={{ fontSize: "16px", fontWeight: "600" }}>1000+ Reviews</span>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={prevReview}
          style={{
            backgroundColor: "#fbbf24",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
          }}
        >
          <ArrowLeft size={20} color="white" />
        </button>

        <div style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
          {visibleReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                minWidth: "280px",
                maxWidth: "280px"
              }}
            >
              <StarRating rating={review.productrating || 5} size={14} />
              <h4 style={{ fontWeight: "700", margin: "10px 0", fontSize: "16px" }}>
                {review.title || "Great Product"}
              </h4>
              <p style={{ 
                color: "#6b7280", 
                fontSize: "14px", 
                lineHeight: "1.4",
                fontStyle: "italic",
                margin: "10px 0"
              }}>
                "{review.message}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "15px" }}>
                {review.user_image && (
                  <img
                    src={getImageUrl(review.user_image)}
                    alt={review.user_name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                )}
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>{review.user_name}</div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#6b7280",
                    backgroundColor: "#1f2937",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    display: "inline-block"
                  }}>
                    3.5M+ Followers
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={nextReview}
          style={{
            backgroundColor: "#fbbf24",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
          }}
        >
          <ArrowRight size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

// Main Product Page Component
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartQty, setCartQty] = useState(0);
  const [selectedBeadSize, setSelectedBeadSize] = useState("54 BEADS");
  const [message, setMessage] = useState("");
  const [productInCart, setProductInCart] = useState(false);
  const [avgRating, setAvgRating] = useState(5);

  const BASE_URL = "https://jyotisika.in/jyotisika_test";
  const getImageUrl = (img) => img ? `${BASE_URL}/uploads/products/${img}` : null;

  const beadSizes = ["54 BEADS", "72 BEADS", "108 BEADS"];

  useEffect(() => {
    fetchProductData();
    fetchTopProducts();
    fetchReviews();
    fetchCategories();
    checkProductInCart();
    fetchAvgRating();
  }, [id]);

  const fetchProductData = async () => {
    try {
      const formData = new FormData();
      formData.append("product_id", id);
      
      const response = await axios.post(`${BASE_URL}/User_Api_Controller/get_specific_product`, formData);
      if (response.data.status === "success") {
        const prod = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        prod.product_image = prod.product_image ? JSON.parse(prod.product_image) : [];
        setProduct(prod);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/User_Api_Controller/Get_top_products`);
      if (response.data.status === "success") {
        const products = response.data.data.map(p => ({
          ...p,
          product_image: p.product_image ? JSON.parse(p.product_image) : []
        }));
        setTopProducts(products);
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/User_Api_Controller/show_product_feedback_data`);
      if (response.data.status === "success") {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/User_Api_Controller/show_category`);
      if (response.data.status === "success") {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const checkProductInCart = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const formData = new FormData();
      formData.append("session_id", userId);
      formData.append("product_id", id);

      const response = await axios.post(`${BASE_URL}/User_Api_Controller/VerifyProductInTheCart`, formData);
      if (response.data.status === "success") {
        setProductInCart(true);
        setCartQty(response.data.quantity || 1);
      }
    } catch (error) {
      console.error("Error checking cart:", error);
    }
  };

  const fetchAvgRating = async () => {
    try {
      const formData = new FormData();
      formData.append("product_id", id);

      const response = await axios.post(`${BASE_URL}/User_Api_Controller/get_avg_rating_of_product`, formData);
      if (response.data.status === "success") {
        setAvgRating(response.data.average_rating || 5);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const addToCart = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/user/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", product.product_id);
      formData.append("product_price", product.discount_price);
      formData.append("session_id", userId);

      const response = await axios.post(`${BASE_URL}/User_Api_Controller/AddToCart`, formData);
      if (response.data.status === "success") {
        setCartQty(1);
        setProductInCart(true);
        setMessage("Added to cart successfully!");
      } else {
        setMessage(response.data.message || "Failed to add to cart");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("Error adding to cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateQuantity = async (newQty) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const formData = new FormData();
      formData.append("quantity", newQty);
      formData.append("session_id", userId);
      formData.append("product_id", product.product_id);

      const response = await axios.post(`${BASE_URL}/User_Api_Controller/updateQuantity`, formData);
      if (response.data.status === "success") {
        setCartQty(newQty);
        setMessage("Cart updated successfully!");
      } else {
        setMessage(response.data.message || "Failed to update cart");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleIncrement = () => updateQuantity(cartQty + 1);
  const handleDecrement = () => {
    if (cartQty > 1) {
      updateQuantity(cartQty - 1);
    } else {
      removeFromCart();
    }
  };

  const removeFromCart = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const formData = new FormData();
      formData.append("product_id", product.product_id);
      formData.append("session_id", userId);

      const response = await axios.post(`${BASE_URL}/User_Api_Controller/deleteproductfromcart`, formData);
      if (response.data.status === "success") {
        setCartQty(0);
        setProductInCart(false);
        setMessage("Removed from cart");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleProductSelect = (selectedProduct) => {
    navigate(`/product/${selectedProduct.product_id}`);
  };

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <div>Loading product...</div>
      </div>
    );
  }

  const productImages = product.product_image || [];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <DiscountBanner />
      {message && (
        <div style={{
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "20px"
        }}>
          {message}
        </div>
      )}

      {/* Product Info Section */}
      <div style={{ display: "flex", gap: "40px", marginBottom: "60px", alignItems: "flex-start" }}>
        {/* Left - Images */}
        <div style={{ flex: "1", maxWidth: "500px" }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginBottom: "20px"
          }}>
            {productImages[selectedImage] && (
              <img
                src={getImageUrl(productImages[selectedImage])}
                alt={product.product_name}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover"
                }}
              />
            )}
          </div>
          
          {/* Thumbnail Images */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {productImages.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt="thumbnail"
                onClick={() => setSelectedImage(i)}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: selectedImage === i ? "3px solid #ea580c" : "2px solid #e5e7eb"
                }}
              />
            ))}
          </div>
        </div>

        {/* Right - Product Details */}
        <div style={{ flex: "1", paddingLeft: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              👁️ {Math.floor(Math.random() * 2000) + 1000} + watching now — 
              🔥 Freedom Sale! Extra 25% OFF included*
            </span>
          </div>

          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "15px",
            lineHeight: "1.3"
          }}>
            {product.product_name}
          </h1>

          {/* Certification Images */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <img src="/api/placeholder/120/120" alt="Benefits" style={{ width: "80px", height: "80px", borderRadius: "8px" }} />
            <img src="/api/placeholder/120/120" alt="Certificate" style={{ width: "80px", height: "80px", borderRadius: "8px" }} />
            <img src="/api/placeholder/120/120" alt="Guarantee" style={{ width: "80px", height: "80px", borderRadius: "8px" }} />
          </div>

          {/* Bead Size Selector */}
          <BeadSizeSelector
            sizes={beadSizes}
            selectedSize={selectedBeadSize}
            onSizeSelect={setSelectedBeadSize}
          />

          {/* Quantity Selector */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: "600", 
              marginBottom: "8px" 
            }}>
              QUANTITY
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={handleDecrement}
                disabled={cartQty <= 0}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "18px",
                  cursor: cartQty > 0 ? "pointer" : "not-allowed",
                  opacity: cartQty > 0 ? 1 : 0.5
                }}
              >
                -
              </button>
              <span style={{
                fontSize: "16px",
                fontWeight: "600",
                minWidth: "40px",
                textAlign: "center"
              }}>
                {cartQty}
              </span>
              <button
                onClick={handleIncrement}
                disabled={cartQty <= 0}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "18px",
                  cursor: cartQty > 0 ? "pointer" : "not-allowed",
                  opacity: cartQty > 0 ? 1 : 0.5
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={productInCart}
            style={{
              width: "100%",
              backgroundColor: productInCart ? "#9ca3af" : "#ea580c",
              color: "white",
              border: "none",
              padding: "15px 0",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: productInCart ? "not-allowed" : "pointer",
              marginBottom: "15px"
            }}
          >
            {productInCart ? `IN CART (${cartQty})` : `ADD TO CART ₹${Number(product.discount_price).toLocaleString()}`}
          </button>

          <div style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
            Order within 1h 49m for Next Day Shipping
          </div>

          {/* Features */}
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "30px" }}>
            {[
              { icon: "🚚", text: "Free Shipping" },
              { icon: "🇮🇳", text: "100% Made in INDIA" },
              { icon: "↩️", text: "Return & Exchange" }
            ].map((feature, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "5px" }}>{feature.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: "600" }}>{feature.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <section style={{ marginBottom: "60px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>Description</h2>
          <p style={{ color: "#f59e0b", fontSize: "18px", fontWeight: "600" }}>Genuine & Original</p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "20px",
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          {[
            {
              title: "100% Made in India",
              desc: "Your purchase supports fulfilling employment and financial independence in India.",
              bg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            },
            {
              title: "Return & Exchange",
              desc: "We're not relaxed until you are - your satisfaction is our priority. If your divine positive energy is not right for you, We offer returns & exchanges policy.",
              bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            },
            {
              title: "Small Actions, Big Changes",
              desc: "At Divine Hindu, every purchase welcomes divine energy into your life and supports our efforts to care for our cows",
              bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            },
            {
              title: "Care Guidelines",
              desc: "Protect your divine spiritual accessories from dishwashing soap, lotions, perfumes, silver cleaner, and other harsh chemicals.",
              bg: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
            }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: item.bg,
                color: "white",
                padding: "30px 20px",
                borderRadius: "12px",
                textAlign: "left"
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px", lineHeight: "1.5", opacity: 0.9 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "40px", 
          marginTop: "40px",
          flexWrap: "wrap"
        }}>
          {[
            { icon: "🏠", text: "Southern part of India" },
            { icon: "✅", text: "Lab Certified" },
            { icon: "🌿", text: "Premium Ebony wood" }
          ].map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsCarousel reviews={reviews} getImageUrl={getImageUrl} />

      {/* Top Shopseller Section */}
      <TopShopseller 
        topProducts={topProducts} 
        onProductSelect={handleProductSelect} 
        getImageUrl={getImageUrl} 
      />

      {/* Honest Reviews Section */}
      <section style={{
        backgroundColor: "#fef9f3",
        padding: "50px 20px",
        borderRadius: "12px",
        marginTop: "60px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "30px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "10px", 
            marginBottom: "10px" 
          }}>
            <span style={{ fontSize: "24px" }}>🌾</span>
            <h2 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              150+ Honest Reviews
            </h2>
            <span style={{ fontSize: "24px" }}>🌾</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Here is why 1,500,000+ men switched to BASED
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {reviews.slice(0, 6).map((review, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>
                    {review.user_name} ✅
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <StarRating rating={review.productrating || 5} size={14} showNumber={false} />
              
              <p style={{
                fontSize: "14px",
                color: "#374151",
                lineHeight: "1.5",
                margin: "10px 0"
              }}>
                {review.message}
              </p>

              <div style={{
                fontSize: "12px",
                color: "#6b7280",
                fontStyle: "italic"
              }}>
                Item type: Just One
              </div>
            </div>
          ))}
        </div>

        <button
          style={{
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "30px"
          }}
          onClick={() => window.location.href = "/reviews"}
        >
          Write a review
        </button>
      </section>

      {/* Product Description Text */}
      {product.product_description && (
        <section style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          marginTop: "40px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}>
            Product Details
          </h3>
          <p style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#4b5563"
          }}>
            {product.product_description}
          </p>
        </section>
      )}

      {/* Floating Cart Summary */}
      {productInCart && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#ea580c",
          color: "white",
          padding: "15px 20px",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>
            {cartQty} item{cartQty > 1 ? 's' : ''} in cart
          </span>
          <button
            onClick={() => navigate("/cart")}
            style={{
              backgroundColor: "white",
              color: "#ea580c",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}