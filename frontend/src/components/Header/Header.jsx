import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleRequestProject = () => {
    navigate('/Requestpro'); // This matches your route path
  };

  const handleBrowseProjects = () => {
    // Scroll to the projects section
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            Tailored or Prebuilt – Your Engineering <span className="highlight">Project Starts Here</span>
          </h1>
          <p className="hero-description">
            We deliver ready-made and custom-built <span className="highlight-text">hardware</span> and software projects with
            complete documentation and support.
          </p>
          
          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button className="btn-primary" onClick={handleRequestProject}>
              Request Custom Project
            </button>
            <button className="btn-secondary" onClick={handleBrowseProjects}>
              Browse Projects
            </button>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
              </svg>
            </div>
            <h3 className="feature-title">Quality Assured</h3>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M15.31 16.5L13 14.19V8H14.5V13.44L16.31 15.25L15.31 16.5Z"/>
              </svg>
            </div>
            <h3 className="feature-title">On-time Delivery</h3>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3 className="feature-title">Full Documentation</h3>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L6.66 7L5.25 8.41L10.08 13.25L15.5 7.83L17.83 10.17L19.5 8.5L22 11V9H21M12.5 12L9 15.5V18H11.5L15 14.5L12.5 12Z"/>
              </svg>
            </div>
            <h3 className="feature-title">24/7 Support</h3>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;