import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './HardwareProjects.css';

const HardwareProjects = () => {
  const navigate = useNavigate();
  const { project_list, url } = useCart();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const projects = project_list
    .filter(p => p.category === 'Hardware')
    .map(p => ({
      id: p._id,
      title: p.name,
      description: p.description,
      image: `${url}/images/${p.image}`,
      difficulty: p.difficulty,
      tags: p.tags || [],
      price: `₹${p.price}`,
      demo: p.demo || '#'
    }));

  const handleViewDetails = (projectId) => {
    navigate(`/hardware-project/${projectId}`);
  };

  const handleRequestCustomProject = () => {
    navigate('/request-project');
  };

  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'iot', label: 'IoT Solutions' },
    { key: 'embedded', label: 'Embedded Systems' },
    { key: 'circuit', label: 'Circuit Design' },
    { key: 'robot', label: 'Robotics' },
    { key: 'ai', label: 'AI & Data Analytics' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory =
      activeFilter === 'all' ||
      project.tags.some(tag => tag.toLowerCase().includes(activeFilter));
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4ade80';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#f97316';
      case 'Expert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="hardware-projects">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Hardware Projects</h1>
          <p className="hero-subtitle">
            Explore cutting-edge hardware solutions from circuit designs to IoT systems
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">Premium</span>
              <span className="stat-label">Quality</span>
            </div>
            <div className="stat">
              <span className="stat-number">5</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="circuit-pattern"></div>
        </div>
      </div>

      <div className="projects-container">
        <div className="controls-section">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search projects, technologies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {categories.map(category => (
              <button
                key={category.key}
                className={`filter-tab ${activeFilter === category.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-actions">
                    <a href={project.demo} className="action-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"></polygon>
                      </svg>
                      Demo
                    </a>
                    <button
                      className="action-btn primary"
                      onClick={() => handleViewDetails(project.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-meta">
                    <span
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
                    >
                      {project.difficulty}
                    </span>
                    <span className="price-badge">{project.price}</span>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="project-footer">
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(project.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7,7 17,7 17,17"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="custom-project-section">
          <div className="custom-project-content">
            <div className="custom-project-info">
              <h2>Need Something Unique?</h2>
              <p>Can't find exactly what you're looking for? Let us build a custom hardware solution tailored to your specific requirements.</p>
              <div className="features-list">
                <div className="feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Tailored Solutions</span>
                </div>
                <div className="feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Complete Documentation</span>
                </div>
                <div className="feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>24/7 Support</span>
                </div>
                <div className="feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
            <div className="custom-project-action">
              <button
                className="request-custom-btn"
                onClick={handleRequestCustomProject}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Request Custom Project
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7,7 17,7 17,17"></polyline>
                </svg>
              </button>
              <p className="custom-project-subtitle">Get a personalized quote in 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareProjects;
