import React from "react";
import { useState, useEffect } from "react";

// SOLUTION 1: Proper ES6 imports (recommended)
import rightFlower from '../assets/rightside.png';
import leftFlower from '../assets/leftside.png';
import axios from "axios";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(12); // Initial number of reviews to show
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Handle window resize for responsive columns
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Get responsive column count
  const getColumnCount = () => {
    if (windowWidth > 1200) return '4';
    if (windowWidth > 992) return '3';
    if (windowWidth > 768) return '2';
    if (windowWidth > 480) return '2';
    return '1';
  };

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://jyotisika.in/jyotisika_test/User_Api_Controller/show_product_feedback_data");
      
      if (res.data?.status && res.data?.data) {
        // Map API data to component format
        const mappedReviews = res.data.data.map((review, index) => ({
          id: review.product_feedback_id || index,
          name: review.user_name || 'Anonymous',
          verified: true, // Since these come from your API, treat as verified
          date: review.created_at ? new Date(review.created_at).toLocaleDateString() : '',
          text: review.message || 'No review text',
          itemType: review.product_name || review.category,
          rating: parseInt(review.productrating) || 5,
          image: review.product_feedback_image ? `https://jyotisika.in/jyotisika_test/${review.product_feedback_image}` : null,
          hasVideo: false // Add logic here if you have video indicators in your data
        }));
        
        setReviews(mappedReviews);
        setError(null);
      } else {
        setError('No reviews found');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const handleShowMore = () => {
    setDisplayCount(reviews.length); // Show all reviews
  };

  const handleShowLess = () => {
    setDisplayCount(12); // Show only 12 reviews
  };

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  );

  const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill={i < rating ? "#fbbf24" : "#e5e7eb"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FFF2D6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: windowWidth <= 480 ? '20px' : '40px 20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: windowWidth <= 480 ? '16px' : '18px', 
            color: '#6b7280' 
          }}>
            Loading reviews...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FFF2D6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: windowWidth <= 480 ? '20px' : '40px 20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: windowWidth <= 480 ? '16px' : '18px', 
            color: '#ef4444', 
            marginBottom: '16px' 
          }}>
            {error}
          </div>
          <button 
            onClick={fetchReviewsData}
            style={{
              background: '#ea580c',
              color: 'white',
              padding: windowWidth <= 480 ? '10px 20px' : '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: windowWidth <= 480 ? '12px' : '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get the reviews to display based on the displayCount
  const displayedReviews = reviews.slice(0, displayCount);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFF2D6',
      padding: windowWidth <= 480 ? '20px 12px' : windowWidth <= 768 ? '30px 16px' : '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      marginTop: windowWidth <= 480 ? '20px' : '40px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: windowWidth <= 480 ? '24px' : windowWidth <= 768 ? '32px' : '40px',
        }}>
          <h1 style={{
            fontSize: windowWidth <= 480 ? '24px' : windowWidth <= 768 ? '32px' : windowWidth <= 992 ? '36px' : '42px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '12px',
            position: 'relative',
            display: 'inline-block',
            margin: '0 0 12px 0',
            lineHeight: '1.2',
          }}>
            {windowWidth > 768 && (
              <img
                src={leftFlower}
                alt="Left Flower"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: windowWidth <= 992 ? '30px' : '40px',
                  height: windowWidth <= 992 ? '38px' : '50px',
                  objectFit: 'contain',
                  left: windowWidth <= 992 ? '-40px' : '-50px',
                }}
              />
            )}
            {reviews.length}+ Honest Reviews
            {windowWidth > 768 && (
              <img
                src={rightFlower}
                alt="Right Flower"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: windowWidth <= 992 ? '30px' : '40px',
                  height: windowWidth <= 992 ? '38px' : '50px',
                  objectFit: 'contain',
                  right: windowWidth <= 992 ? '-40px' : '-50px',
                }}
              />
            )}
          </h1>
          <div style={{
            fontSize: windowWidth <= 480 ? '13px' : windowWidth <= 768 ? '14px' : '16px',
            color: '#6b7280',
            marginBottom: windowWidth <= 480 ? '24px' : '40px',
            lineHeight: '1.4',
            padding: windowWidth <= 480 ? '0 10px' : '0',
          }}>
            Here is why 1,500,000+ men switched to <strong>BASED</strong>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: windowWidth <= 480 ? '20px' : '30px',
          flexDirection: windowWidth <= 480 ? 'column' : 'row',
          gap: windowWidth <= 480 ? '12px' : '0',
        }}>
          <div style={{
            fontSize: windowWidth <= 480 ? '14px' : '16px',
            fontWeight: '500',
            color: '#6b7280',
          }}>
            {reviews.length} Reviews
          </div>
          <button style={{
            background: '#ea580c',
            color: 'white',
            padding: windowWidth <= 480 ? '10px 20px' : '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: windowWidth <= 480 ? '12px' : '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}>
            Write a review
          </button>
        </div>

        {/* Reviews Masonry Grid */}
        <div style={{
          columns: getColumnCount(),
          columnGap: windowWidth <= 480 ? '8px' : windowWidth <= 768 ? '12px' : '16px',
          columnFill: 'balance',
        }}>
          {displayedReviews.map((review) => (
            <div key={review.id} style={{
              backgroundColor: 'white',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              breakInside: 'avoid',
              marginBottom: windowWidth <= 480 ? '12px' : '16px',
              display: 'inline-block',
              width: '100%',
              borderRadius: '8px',
            }}>
              {/* Review Image */}
              {review.image && (
                <div style={{ position: 'relative' }}>
                  <img
                    src={review.image}
                    alt="Product review"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      minHeight: windowWidth <= 480 ? '120px' : '150px',
                      maxHeight: windowWidth <= 480 ? '200px' : windowWidth <= 768 ? '250px' : '300px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {review.hasVideo && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      width: windowWidth <= 480 ? '40px' : '50px',
                      height: windowWidth <= 480 ? '40px' : '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}>
                      <PlayIcon />
                    </div>
                  )}
                </div>
              )}

              <div style={{ 
                padding: windowWidth <= 480 ? '12px' : '16px' 
              }}>
                {/* User Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: windowWidth <= 480 ? '6px' : '8px',
                      marginBottom: '4px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontSize: windowWidth <= 480 ? '13px' : '15px',
                        fontWeight: '600',
                        color: '#111827',
                        wordBreak: 'break-word',
                      }}>
                        {review.name}
                      </span>
                      {review.verified && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          backgroundColor: '#dcfce7',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          flexShrink: 0,
                        }}>
                          <CheckIcon />
                          <span style={{
                            fontSize: windowWidth <= 480 ? '9px' : '11px',
                            color: '#16a34a',
                            fontWeight: '500',
                          }}>
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontSize: windowWidth <= 480 ? '11px' : '13px',
                      color: '#6b7280',
                    }}>
                      {review.date}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div style={{ marginBottom: '8px' }}>
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Text */}
                <p style={{
                  fontSize: windowWidth <= 480 ? '12px' : '14px',
                  lineHeight: '1.4',
                  color: '#374151',
                  marginBottom: '12px',
                  margin: '0 0 12px 0',
                  wordBreak: 'break-word',
                }}>
                  {review.text}
                </p>

                {/* Item Type */}
                {review.itemType && (
                  <div style={{
                    fontSize: windowWidth <= 480 ? '10px' : '12px',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    padding: windowWidth <= 480 ? '3px 8px' : '4px 10px',
                    borderRadius: '14px',
                    display: 'inline-block',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                  }}>
                    Item type: {review.itemType}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {reviews.length > 12 && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: windowWidth <= 480 ? '30px' : '40px' 
          }}>
            <button 
              onClick={displayCount === 12 ? handleShowMore : handleShowLess}
              style={{
                background: '#ea580c',
                color: 'white',
                padding: windowWidth <= 480 ? '12px 24px' : '14px 32px',
                border: 'none',
                borderRadius: '8px',
                fontSize: windowWidth <= 480 ? '14px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {displayCount === 12 ? 'Show more reviews' : 'View less reviews'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;