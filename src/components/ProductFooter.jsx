import React from 'react';
import '../styles/ProductFooter.css';

const ProductFooter = () => {
  return (
    <footer className="jyotisika-footer">
      <div className="footer-container">
        {/* Left Section - Logo and Description */}
        <div className="footer-left">
          <div className="footer-logo">
            <img 
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/WqsbpufRVU/bxn4s0bj_expires_30_days.png" 
              className="brand-logo" 
              alt="Jyotisika Logo" 
            />
          </div>
          <p className="footer-description">
            Explore our range of astrological services tailored to your needs.
          </p>
          <div className="social-icons">
            <a href="#" className="social-link facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-link youtube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Footer Links Sections */}
        <div className="footer-links">
          {/* Categories */}
          <div className="footer-column">
            <h3 className="footer-heading">Categories</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Panchang</a></li>
              <li><a href="#" className="footer-link">Horoscope</a></li>
              <li><a href="#" className="footer-link">Festivals</a></li>
              <li><a href="#" className="footer-link">Why us</a></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="footer-column">
            <h3 className="footer-heading">Our Services</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Free kundli</a></li>
              <li><a href="#" className="footer-link">Kundli Milan</a></li>
              <li><a href="#" className="footer-link">Jyotisika Mall</a></li>
              <li><a href="#" className="footer-link">Bookpooja</a></li>
              <li><a href="#" className="footer-link">Mob pooja</a></li>
            </ul>
          </div>

          {/* Astrological Services */}
          <div className="footer-column">
            <h3 className="footer-heading">Astrological Services</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Finance</a></li>
              <li><a href="#" className="footer-link">Ask a question</a></li>
              <li><a href="#" className="footer-link">Career & Job</a></li>
              <li><a href="#" className="footer-link">Counselling</a></li>
              <li><a href="#" className="footer-link">Yearbook</a></li>
            </ul>
          </div>

          {/* Get Free Kundli */}
          <div className="footer-column">
            <h3 className="footer-heading">Get Free Kundli</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Basic Astrology</a></li>
              <li><a href="#" className="footer-link">Birth Chart</a></li>
              <li><a href="#" className="footer-link">Planetary Position</a></li>
              <li><a href="#" className="footer-link">Bhava Kundli</a></li>
              <li><a href="#" className="footer-link">Manglik dosha</a></li>
            </ul>
          </div>

          {/* General Links */}
          <div className="footer-column">
            <h3 className="footer-heading">General Links</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Getting started</a></li>
              <li><a href="#" className="footer-link">Help center</a></li>
              <li><a href="#" className="footer-link">Server status</a></li>
              <li><a href="#" className="footer-link">Report a bug</a></li>
              <li><a href="#" className="footer-link">Chat support</a></li>
            </ul>
          </div>

          {/* Online Consultation */}
          <div className="footer-column">
            <h3 className="footer-heading">Online Consultation</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Kundli Matching</a></li>
              <li><a href="#" className="footer-link">Horoscope Reading</a></li>
              <li><a href="#" className="footer-link">Numerology Consultation</a></li>
              <li><a href="#" className="footer-link">Tarot Card Reading</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="footer-contact">
        <h3 className="contact-heading">Contacts us</h3>
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>contact@jyotisika.in</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Nashik, Gangapur road</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>(414) 687 - 5892</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <span>Copyright © 2025 jyotisika</span>
          </div>
          <div className="footer-legal">
            <span>All Rights Reserved | </span>
            <a href="#" className="legal-link">Terms and Conditions</a>
            <span> | </span>
            <a href="#" className="legal-link">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProductFooter;