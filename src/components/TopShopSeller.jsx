import React, { useState } from 'react';

const TopShopseller = ({ topProducts, onProductSelect, getImageUrl }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Star Rating Component
  const StarRating = ({ rating = 5 }) => (
    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '8px' }}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={i < rating ? "#fbbf24" : "none"}
          stroke={i < rating ? "#fbbf24" : "#d1d5db"}
          strokeWidth="1"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const styles = {
    container: {
      backgroundColor: '#f8f5f0',
      padding: '60px 20px',
      borderRadius: '12px',
      margin: '40px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: '40px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      border: 'none',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    image: {
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px'
    },
    cardBody: {
      padding: '20px',
      textAlign: 'center'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px',
      lineHeight: '1.4',
      minHeight: '44px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    priceContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    discountPrice: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#ea580c'
    },
    originalPrice: {
      fontSize: '16px',
      color: '#9ca3af',
      textDecoration: 'line-through'
    },
    addToCartBtn: {
      backgroundColor: '#ea580c',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      width: '100%'
    },
    viewAllBtn: {
      backgroundColor: '#fbbf24',
      color: 'white',
      border: 'none',
      padding: '12px 32px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'block',
      margin: '0 auto'
    }
  };

  // Loading state
  if (!topProducts || topProducts.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Top Shopseller</h2>
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Top Shopseller</h2>
      
      <div style={styles.grid}>
        {topProducts.map((product) => (
          getImageUrl(product.product_image) && (
            <div 
              key={product.product_id}
              style={{
                ...styles.card,
                ...(hoveredCard === product.product_id ? styles.cardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(product.product_id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={getImageUrl(product.product_image)}
                alt={product.product_name}
                style={styles.image}
              />
              
              <div style={styles.cardBody}>
                <h5 style={styles.productName}>
                  {product.product_name}
                </h5>
                
                <StarRating rating={5} />
                
                <div style={styles.priceContainer}>
                  <span style={styles.discountPrice}>
                    ₹{Number(product.discount_price).toLocaleString()}
                  </span>
                  {product.product_price && Number(product.product_price) > Number(product.discount_price) && (
                    <span style={styles.originalPrice}>
                      ₹{Number(product.product_price).toLocaleString()}
                    </span>
                  )}
                </div>
                
                <button
                  style={styles.addToCartBtn}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}
                  onClick={() => onProductSelect(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          )
        ))}
      </div>
      
      <button
        style={styles.viewAllBtn}
        onMouseOver={(e) => e.target.style.backgroundColor = '#f59e0b'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#fbbf24'}
        onClick={() => {
          // Handle view all functionality
          if (window.location) {
            window.location.href = '/products';
          }
        }}
      >
        View all
      </button>
    </section>
  );
};

export default TopShopseller;