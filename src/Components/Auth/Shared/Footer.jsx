import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Send, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-section">
          <div className="logo-wrapper">
            <Send className="logo-icon" />
            <h3 className="footer-logo">
              Ready<span>2</span>Go
            </h3>
          </div>
          <p className="tagline">
            Revolutionizing delivery with seamless, instant solutions
          </p>
        </div>

        <div className="footer-contact-section">
          <div className="contact-group">
            <h4>Contact</h4>
            <div className="contact-details">
              <div className="contact-item">
                <Phone className="contact-icon" size={18} />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="contact-item">
                <Mail className="contact-icon" size={18} />
                <p>support@ready2go.com</p>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" size={18} />
                <p>123 Delivery Street, Tech City</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-social-section">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#" className="social-icon-link">
              <Facebook className="social-icon" />
            </a>
            <a href="#" className="social-icon-link">
              <Instagram className="social-icon" />
            </a>
            <a href="#" className="social-icon-link">
              <Twitter className="social-icon" />
            </a>
            <a href="#" className="social-icon-link">
              <Linkedin className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Ready2Go. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;