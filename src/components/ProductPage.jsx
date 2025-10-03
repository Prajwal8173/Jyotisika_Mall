import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, Eye, Target, Clock, Package, ArrowLeftRight, CheckIcon } from "lucide-react";
import "../styles/ProductPage.css";
import ReviewsPage from "./Reviewspage";
import des1 from '../assets/img1.png'
import des2 from '../assets/img2.png'
import des3 from '../assets/img3.png'
import des4 from '../assets/img4.png'
import { FaLeaf, FaTree } from "react-icons/fa";

const BASE_URL = "https://jyotisika.in/jyotisika_test";

// Star Rating Component
const StarRating = ({ rating = 5 }) => (
  <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "8px" }}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? "#fbbf24" : "none"}
        color={i < rating ? "#fbbf24" : "#d1d5db"}
      />
    ))}
  </div>
);

// Top Shopseller Carousel
const TopShopseller = ({ topProducts, onProductSelect, getImageUrl }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const carouselRef = useRef(null);

  const scrollTo = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = 304;
    container.scrollBy({ left: direction === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  };

  const styles = {
    container: { padding: "60px 20px", borderRadius: "12px", margin: "40px 0", position: "relative" },
    title: { fontSize: "32px", fontWeight: 700, color: "#1f2937", textAlign: "center", marginBottom: "40px" },
    carouselWrapper: { overflow: "hidden", position: "relative", padding: "0 25px" },
    carousel: { display: "flex", gap: "24px", overflowX: "auto", scrollBehavior: "smooth", paddingBottom: "10px", scrollbarWidth: "none", msOverflowStyle: "none" },
    card: { backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.07)", cursor: "pointer", minWidth: "280px", maxWidth: "280px", flexShrink: 0, transition: "transform 0.3s ease, box-shadow 0.3s ease" },
    cardHover: { transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(0,0,0,0.15)" },
    image: { width: "100%", height: "220px", objectFit: "cover" },
    cardBody: { padding: "20px", textAlign: "center" },
    productName: { fontSize: "16px", fontWeight: 600, color: "#1f2937", marginBottom: "12px", lineHeight: "1.4", minHeight: "44px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
    priceContainer: { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "16px" },
    discountPrice: { fontSize: "20px", fontWeight: 700, color: "#ea580c" },
    originalPrice: { fontSize: "16px", color: "#9ca3af", textDecoration: "line-through" },
    addToCartBtn: { backgroundColor: "#ea580c", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%" },
    navButton: { position: "absolute", top: "50%", transform: "translateY(-50%)", backgroundColor: "white", border: "none", borderRadius: "50%", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 10 },
    navButtonLeft: { left: "-25px" },
    navButtonRight: { right: "-25px" },
    viewAllBtn: { backgroundColor: "#fbbf24", color: "white", border: "none", padding: "12px 32px", borderRadius: "8px", fontSize: "16px", fontWeight: 600, cursor: "pointer", display: "block", margin: "0 auto" },
  };

  console.log("TopShopseller received products:", topProducts);

  if (!topProducts || topProducts.length === 0) {
    return (
      <section style={styles.container}>
        <h2 style={styles.title}>Top Shopseller</h2>
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading products...</p>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Top Shopseller</h2>
      <div style={styles.carouselWrapper}>
        <button style={{ ...styles.navButton, ...styles.navButtonLeft }} onClick={() => scrollTo("left")}>
          <ChevronLeft size={24} />
        </button>
        <div ref={carouselRef} style={styles.carousel}>
          {topProducts.map((product) => {
            console.log("Processing product in carousel:", product);

            // Handle product image - it's now an array from the filtered data
            const imageArray = product.product_image || [];

            if (!imageArray || imageArray.length === 0) {
              return null;
            }

            return (
              <div
                key={product.product_id}
                style={{ ...styles.card, ...(hoveredCard === product.product_id ? styles.cardHover : {}) }}
                onMouseEnter={() => setHoveredCard(product.product_id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onProductSelect(product)}
              >
                <img
                  src={getImageUrl(imageArray[0])}
                  alt={product.product_name}
                  style={styles.image}
                  onError={(e) => {
                    console.log("Image load error for:", e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
                <div style={styles.cardBody}>
                  <h5 style={styles.productName}>{product.product_name}</h5>
                  <StarRating rating={parseFloat(product.average_rating) || 5} />
                  <div style={styles.priceContainer}>
                    <span style={styles.discountPrice}>
                      ₹{Number(product.discount_price || product.product_price || 0).toLocaleString()}
                    </span>
                    {product.product_price && Number(product.product_price) > Number(product.discount_price || 0) && (
                      <span style={styles.originalPrice}>₹{Number(product.product_price).toLocaleString()}</span>
                    )}
                  </div>
                  <button style={styles.addToCartBtn}>View</button>
                </div>
              </div>
            );
          })}
        </div>
        <button style={{ ...styles.navButton, ...styles.navButtonRight }} onClick={() => scrollTo("right")}>
          <ChevronRight size={24} />
        </button>
      </div>
      <button style={styles.viewAllBtn} onClick={() => window.location.href = "/products"}>
        View All
      </button>
    </section>
  );
};

// Main Product Page Component
export default function ProductPage({ setCartCount, cartCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [cartQty, setCartQty] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedBeadOption, setSelectedBeadOption] = useState("54");
  const [quantity, setQuantity] = useState(1);
  const [watchingCount, setWatchingCount] = useState(1942);
  const [inCart, setInCart] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (img) => img ? `${BASE_URL}/uploads/products/${img}` : null;

  // Initialize bead options with default prices
  const [beadOptions, setBeadOptions] = useState([
    { id: "54", label: "54 BEADS", price: 0, selected: true },
    { id: "72", label: "72 BEADS", price: 0, selected: false },
    { id: "108", label: "108 BEADS", price: 0, selected: false }
  ]);

  const [selectedOption, setSelectedOption] = useState(beadOptions[0]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      console.log("Starting to fetch data for product ID:", id);

      try {
        // 1. Fetch specific product
        console.log("Fetching specific product...");
        const productFormData = new FormData();
        productFormData.append("product_id", id);

        const productResponse = await axios.post(`${BASE_URL}/User_Api_Controller/get_specific_product`, productFormData);
        console.log("Product API response:", productResponse.data);

        if (productResponse.data.status === "success" && productResponse.data.data && productResponse.data.data.length > 0) {
          const prod = productResponse.data.data[0];
          console.log("Product data:", prod);

          // Handle product images - they come as JSON string from API
          if (prod.product_image) {
            try {
              prod.product_image = JSON.parse(prod.product_image);
            } catch (e) {
              console.log("Product image is not JSON, treating as string:", prod.product_image);
              prod.product_image = [prod.product_image];
            }
          } else {
            prod.product_image = [];
          }

          setProduct(prod);

          // Update bead options with actual product prices
          const basePrice = Number(prod.discount_price) || Number(prod.product_price) || 0;
          const updatedBeadOptions = [
            { id: "54", label: "54 BEADS", price: basePrice, selected: true },
            { id: "72", label: "72 BEADS", price: Math.round(basePrice * 1.35), selected: false },
            { id: "108", label: "108 BEADS", price: Math.round(basePrice * 1.68), selected: false }
          ];

          setBeadOptions(updatedBeadOptions);
          setSelectedOption(updatedBeadOptions[0]);

          // Check if product is in cart
          const userId = localStorage.getItem("user_id");
          if (userId) {
            await checkProductInCart(prod.product_id, userId);
          }
        } else {
          console.log("No product data received");
        }

        // 2. Fetch top products
        console.log("Fetching top products...");
        try {
          const topProductsResponse = await axios.get(`${BASE_URL}/User_Api_Controller/Get_top_products`);
          console.log("Top products API response:", topProductsResponse.data);

          if (topProductsResponse.data.status === "success" && topProductsResponse.data.data) {
            // Filter out null products and handle product_image parsing
            const validProducts = topProductsResponse.data.data
              .filter(product => product.product_id !== null && product.product_name !== null)
              .map(product => {
                // Parse product_image JSON string
                if (product.product_image && typeof product.product_image === 'string') {
                  try {
                    product.product_image = JSON.parse(product.product_image);
                  } catch (e) {
                    console.log("Could not parse product_image as JSON:", product.product_image);
                    product.product_image = [product.product_image];
                  }
                }
                return product;
              });

            console.log("Setting filtered top products:", validProducts);
            setTopProducts(validProducts);
          } else {
            console.log("No top products data");
            setTopProducts([]);
          }
        } catch (topProductsError) {
          console.error("Error fetching top products:", topProductsError);
          setTopProducts([]);
        }

        // 3. Skip general feedback for now due to API error
        console.log("Skipping general product feedback due to API category error");
        setReviews([]);
        setTotalReviews(0);
        setAverageRating(0);

        // 4. Fetch specific product feedback
        console.log("Fetching specific product feedback...");
        try {
          const specificFeedbackResponse = await axios.post(`${BASE_URL}/User_Api_Controller/show_product_feedback`, productFormData);
          console.log("Specific feedback API response:", specificFeedbackResponse.data);

          if (specificFeedbackResponse.data.status === "success" && specificFeedbackResponse.data.data) {
            setProductReviews(specificFeedbackResponse.data.data);
            // Use specific product reviews for the main reviews display
            setReviews(specificFeedbackResponse.data.data);
            setTotalReviews(specificFeedbackResponse.data.data.length);

            if (specificFeedbackResponse.data.data.length > 0) {
              const avg = specificFeedbackResponse.data.data.reduce((sum, review) => sum + parseInt(review.productrating || 0), 0) / specificFeedbackResponse.data.data.length;
              setAverageRating(avg.toFixed(1));
            }
          }
        } catch (specificFeedbackError) {
          console.error("Error fetching specific feedback:", specificFeedbackError);
        }

        // 5. Get average rating for this specific product
        console.log("Fetching product average rating...");
        try {
          const avgRatingResponse = await axios.post(`${BASE_URL}/User_Api_Controller/get_avg_rating_of_product`, productFormData);
          console.log("Average rating API response:", avgRatingResponse.data);

          if (avgRatingResponse.data.status === "success" && avgRatingResponse.data.data && avgRatingResponse.data.data.length > 0) {
            const avgRating = parseFloat(avgRatingResponse.data.data[0].average_product_rating || 0);
            setAverageRating(avgRating.toFixed(1));
          }
        } catch (avgRatingError) {
          console.error("Error fetching average rating:", avgRatingError);
        }

      } catch (error) {
        console.error("Error in fetchData:", error);
        setMessage("Error loading product data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 190,
      behavior: "smooth"
    });
  }, []);


  const checkProductInCart = async (productId, userId) => {
    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("session_id", userId);

      const res = await axios.post(`${BASE_URL}/User_Api_Controller/VerifyProductInTheCart`, formData);
      console.log("Cart verification response:", res.data);

      if (res.data.message === "products found in cart") {
        setInCart(true);
        if (res.data.data && res.data.data.quantity) {
          setCartQty(parseInt(res.data.data.quantity) || 1);
        }
      }
    } catch (err) {
      console.error("Error checking cart:", err);
    }
  };

  const handleCartUpdate = async (qty) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const payload = new FormData();
    payload.append("product_id", product.product_id);
    payload.append("session_id", userId);
    payload.append("quantity", qty);

    try {
      const res = await axios.post(`${BASE_URL}/User_Api_Controller/updateQuantity`, payload);
      console.log("Update quantity response:", res.data);

      if (res.data.status === "success") {
        setMessage("Cart updated!");
      } else {
        setMessage(res.data.message || "Failed to update cart.");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating cart:", err);
      setMessage("Error updating cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const addToCart = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/user/login");
      return;
    }

    const payload = new FormData();
    payload.append("product_id", product.product_id);
    payload.append("product_price", selectedOption.price);
    payload.append("session_id", userId);
    payload.append("quantity", quantity);

    try {
      const res = await axios.post(`${BASE_URL}/User_Api_Controller/AddToCart`, payload);
      console.log("Add to cart response:", res.data);

      if (res.data.status === "success") {
        setInCart(true);
        setCartQty(quantity);
        setCartCount(cartCount+1)
        setMessage("Added to cart successfully!");
      } else {
        setMessage(res.data.message || "Failed to add to cart");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage("Error adding to cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleIncrement = () => {
    if (inCart) {
      const newQty = cartQty + 1;
      setCartQty(newQty);
      handleCartUpdate(newQty);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (inCart) {
      if (cartQty > 1) {
        const newQty = cartQty - 1;
        setCartQty(newQty);
        handleCartUpdate(newQty);
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handleBeadOptionChange = (option) => {
    setSelectedOption(option);
    setSelectedBeadOption(option.id);
  };

  const handlePrev = () => {
    if (reviews.length > 0) {
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const handleNext = () => {
    if (reviews.length > 0) {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <p className="text-center py-5">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <p className="text-center py-5">Product not found</p>
      </div>
    );
  }

  const productImages = product.product_image || [];

  return (
    <div className="product-page">
      {/* Discount Banner */}
      <hr />
      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* Product Info */}
      <div className="product-container">
        {/* Left Side - Images */}
        <div className="product-images-section">
          <div className="main-image-container">
            {productImages[selectedImage] && (
              <img
                src={getImageUrl(productImages[selectedImage])}
                alt={product.product_name}
                className="main-product-image"
                style={{ borderRadius: "8px" }}
              />
            )}
          </div>
          <div className="thumbnail-images">
            {productImages.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt="thumb"
                className={`thumbnail-img ${selectedImage === i ? "active" : ""}`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.product_name}</h1>


          {/* Bead Selection Images */}
          <div className="bead-selection">
            <div className="bead-images">
              {beadOptions.map((option, index) => (
                <div key={option.id} className="bead-image-container">
                  <img
                    src={productImages[0] ? getImageUrl(productImages[0]) : '/placeholder-image.jpg'}
                    alt={`${option.label} option`}
                    className="bead-option-image"
                  />
                  <div className="bead-label">{option.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bead Options Selection */}
          <div className="bead-options-container">
            {beadOptions.map((option) => (
              <div
                key={option.id}
                className={`bead-option ${selectedOption.id === option.id ? 'selected' : ''}`}
                onClick={() => handleBeadOptionChange(option)}
              >
                <span className="bead-count">{option.label}</span>
              </div>
            ))}
          </div>

          {/* Quantity Section */}
          

          {/* Price with Discount % */}
          <div className="price-section" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {product.product_price && Number(product.product_price) > Number(selectedOption.price) && (
              <span style={{ textDecoration: "line-through", color: "#888", fontSize: "26px", marginRight: "8px" }}>
                ₹{Number(product.product_price).toLocaleString()}
              </span>
            )}
            <div className="current-price">₹{selectedOption.price.toLocaleString()}</div>
            {product.product_price && Number(product.product_price) > Number(selectedOption.price) && (
              <span style={{ color: "green", fontWeight: 600, fontSize: "16px" }}>
                {`(${Math.round(((Number(product.product_price) - Number(selectedOption.price)) / Number(product.product_price)) * 100)}% OFF)`}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`add-to-cart-button ${inCart ? 'in-cart' : ''}`}
            onClick={addToCart}
            disabled={inCart}
          >
            {inCart ? '✓ ADDED TO CART' : `ADD TO CART ₹${selectedOption.price.toLocaleString()}`}
          </button>

          {/* Shipping Info */}
          <div className="shipping-info">
            <div className="shipping-timer">
              <Clock size={16} /> Order within <span className="timer">1h 49m</span> for Next Day Shipping
            </div>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <div className="feature-icon"><Package size={20} /></div>
              <span>Free Shipping</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ height: "38px", width: "38px" }}>🇮🇳</div>
              <span>100% Made in INDIA</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><ArrowLeftRight size={20} /></div>
              <span>Return & Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <section className="description">
        <h2>Description</h2>
        <h6>Genuine & Original</h6>
        <div className="product-description-text">
          <p>{product.product_description}</p>
        </div>
        <div className="description-grid">
          {[
            { title: "100% Made in India", desc: "Your purchase supports fulfilling employment and financial independence in India", bg: des1 },
            { title: "Return & Exchange", desc: "We're not relaxed until you are - your satisfaction is our priority. If your divine positive energy is not right for you, We offer returns & exchanges policy.", bg: des2 },
            { title: "Small Actions, Big Changes", desc: "At Divine Hindu, every purchase welcomes divine energy into your life and supports our efforts to care for our cows", bg: des3 },
            { title: "Care Guidelines", desc: "Protect your divine spiritual accessories from dishwashing soap, lotions, perfumes, silver cleaner, and other harsh chemicals.", bg: des4 }
          ].map((item, i) => (
            <div className="desc-item" key={i} style={{ backgroundImage: `url(${item.bg})` }}>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="customer-reviews">
        <div className="reviews-badges">
          <div className="badge">
            <FaLeaf className="leaf-icon" />
            <span>Southern part of India</span>
          </div>
          <div className="badge">
            <CheckIcon className="check-icon" />
            <span>Lab Certified</span>
          </div>
          <div className="badge">
            <FaTree className="wood-icon" />
            <span>Premium Ebony wood</span>
          </div>
        </div>
      </section>

      {/* Reviews Section - Jyotisika Promise */}
      <section className="text-center py-5 rounded mb-5">
        <div className="reviews-content">
          <h3 className="reviews-header">
            <span className="reviews-count">{totalReviews}+ REVIEWS</span>
            <span className="reviews-action"> HAVE SWITCHED TO </span>
            <span className="brand-name">JYOTISIKA</span>
          </h3>

          <h2 className="reviews-title">Jyotisika Promise</h2>

          <p className="reviews-subtitle">
            Hear from the customers who have elevated their<br />
            confidence & health by switching to jyotisika.
          </p>

          <div className="reviews-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={i < Math.floor(averageRating) ? "#fbbf24" : "none"}
                  color={i < Math.floor(averageRating) ? "#fbbf24" : "#d1d5db"}
                />
              ))}
            </div>
            <span className="rating-text">{averageRating} Rating ({totalReviews} Reviews)</span>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button className="btn btn-outline-secondary btn-sm" onClick={handlePrev}>←</button>
            <div className="card shadow-sm border-0 p-3" style={{ width: "320px" }}>
              {reviews[currentReview]?.user_image && (
                <img
                  src={`${BASE_URL}/${reviews[currentReview].user_image}`}
                  alt={reviews[currentReview].user_name}
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              )}
              <div className="stars mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < parseInt(reviews[currentReview]?.productrating || 0) ? "#fbbf24" : "none"}
                    color={i < parseInt(reviews[currentReview]?.productrating || 0) ? "#fbbf24" : "#d1d5db"}
                  />
                ))}
              </div>
              <h5 className="fw-bold">{reviews[currentReview]?.product_name || "Customer Review"}</h5>
              <p className="fst-italic">"{reviews[currentReview]?.message}"</p>
              <span className="fw-semibold">- {reviews[currentReview]?.user_name}</span>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleNext}>→</button>
          </div>
        )}
      </section>

      {/* Top Shopseller Carousel */}
      <TopShopseller
        topProducts={topProducts}
        onProductSelect={(product) => navigate(`/product/${product.product_id}`)}
        getImageUrl={getImageUrl}
      />

      {/* Reviews Page Component */}
      <ReviewsPage />
    </div>
  );
}