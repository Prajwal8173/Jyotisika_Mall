import React, { useState, useEffect } from 'react';

const ProductFooter = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Simulate API call for services - replace with your actual API endpoint
    const fetchServices = async () => {
      try {
        // Mock data - replace with actual API call
        const mockServices = [
          { id: 1, name: 'Kundli Matching' },
          { id: 2, name: 'Horoscope Reading' },
          { id: 3, name: 'Numerology Consultation' },
          { id: 4, name: 'Tarot Card Reading' },
        ];
        setServices(mockServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const footerStyle = {
    backgroundColor: '#FEBF31',
    color: 'black',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif"
  };

  const footerGridStyle = {
    display: 'flex',
    gap: '20px'
  };

  const footerColStyle = {
    minWidth: '140px'
  };

  const footerLinksStyle = {
    color: 'black',
    textDecoration: 'none'
  };

  const footerBottomStyle = {
    borderTop: '1px solid rgba(0,0,0,0.2)',
    marginTop: '20px',
    paddingTop: '10px',
    textAlign: 'center',
    fontSize: '13px'
  };

  return (
    <>
      {/* Bootstrap Icons CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      
      <footer style={footerStyle}>
        <div className="container-fluid" style={{ padding: '50px' }}>
          <div 
            style={footerGridStyle}
            className="footer-grid-responsive"
          >
            {/* Column 1: Logo + Desc + Social */}
            <div style={footerColStyle}>
              <a 
                href="#" 
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100px',
                  height: '80px',
                  marginBottom: '12px'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  zIndex: 1
                }}>
                  <img 
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/bxn4s0bj_expires_30_days.png" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                    alt="Jyotisika Logo"
                  />
                </div>
              </a>

              <p style={{ marginBottom: '16px' }}>
                Explore our range of astrological services tailored to your needs.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '16px' }}>
                <a href="https://www.facebook.com/profile.php?id=61578103586317" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook" style={{ color: 'black', fontSize: '22px' }}></i>
                </a>
                <a href="https://www.instagram.com/jyotisikaa?igsh=Z2hmOWtlM3RhMXVu" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram" style={{ color: 'black', fontSize: '22px' }}></i>
                </a>
                <a href="http://www.youtube.com/@Jyotisikaa" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-youtube" style={{ color: 'black', fontSize: '22px' }}></i>
                </a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div style={footerColStyle}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Categories</h5>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Panchang
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Horoscope
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Festivals
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Why us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Our Services */}
            <div style={footerColStyle}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Our Services</h5>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Free kundli
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Kundli Milan
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Jyotisika Mall
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Bookpooja
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Mob pooja
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Astrological Services */}
            <div style={footerColStyle}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Astrological Services</h5>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Finance
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Ask a question
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Career & Job
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Counselling
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Get Free Kundli */}
            <div style={footerColStyle}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Get Free Kundli</h5>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Basic Astrology
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Birth Chart
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Planetary Position
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Bhava Kundli
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Manglik dosha
                  </a>
                </li>
              </ul>
            </div>

            {/* General Links */}
            <div style={footerColStyle}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>General Links</h5>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Getting Started
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Help Center
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Report a bug
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={footerLinksStyle} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                    Chat Support
                  </a>
                </li>
                
              </ul>
            </div>

            {/* Column 6: Online Consultation */}
            <div style={footerColStyle}>
              <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Online Consultation</h5>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                {services.map((service) => (
                  <li key={service.id} style={{ marginBottom: '8px' }}>
                    <a 
                      href="#" 
                      style={footerLinksStyle}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
                {services.length === 0 && (
                  <li style={{ marginBottom: '8px' }}>Loading services...</li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginTop: '12px' 
          }}>
            <div>
              <h6 style={{ fontWeight: 'bold' }}>Contact us:</h6>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: '12px' 
            }}>
              <p style={{ marginBottom: '4px' }}>
                <a 
                  href="mailto:contact@jyotisika.in" 
                  style={{ ...footerLinksStyle, textDecoration: 'none' }}
                >
                  <i className="bi bi-envelope" style={{ marginRight: '8px' }}></i> 
                  contact@jyotisika.in
                </a>
              </p>

              <p style={{ marginBottom: '4px' }}>
                <i className="bi bi-geo-alt" style={{ marginRight: '8px' }}></i> 
                Nashik, Gangapur road
              </p>
            </div>

            <p style={{ marginBottom: 0 }}>
              <i className="bi bi-telephone" style={{ marginRight: '8px' }}></i> 
              8080750079
            </p>
          </div>

          {/* Footer Bottom */}
          <div style={footerBottomStyle}>
            <p>
              Copyright © 2025 jyotisika | 
              <a 
                href="/terms" 
                style={footerLinksStyle}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              > Terms and Conditions</a> | 
              <a 
                href="/privacy-policy" 
                style={footerLinksStyle}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              > Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Responsive CSS */}
        <style jsx>{`
          @media (max-width: 768px) {
            .footer-grid-responsive {
              flex-wrap: wrap !important;
              display: flex !important;
            }
          }
        `}</style>
      </footer>
    </>
  );
};

export default ProductFooter;