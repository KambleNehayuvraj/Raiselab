import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './SoftwareProjects.css';

const SoftwareProject = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const navigate = useNavigate();
  const { project_list, url } = useCart();

  const filters = [
    'All Projects',
    'Web Development', 
    'Mobile Apps',
    'Desktop Applications',
    'APIs & Backend',
    'Machine Learning'
  ];

  const projects = project_list
    .filter(p => p.category === 'Software')
    .map(p => ({
      id: p._id,
      title: p.name,
      description: p.description,
      image: `${url}/images/${p.image}`,
      difficulty: (p.difficulty || 'Intermediate').toUpperCase(),
      tags: p.tags || [],
      price: `₹${p.price}`
    }));

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'All Projects') return matchesSearch;
    
    const filterMap = {
      'Web Development': ['React', 'Vue.js', 'JavaScript', 'Django', 'Node.js'],
      'Mobile Apps': ['React Native', 'Mobile'],
      'Desktop Applications': ['Electron', 'Desktop'],
      'APIs & Backend': ['Node.js', 'Flask', 'Django', 'API'],
      'Machine Learning': ['TensorFlow', 'Python', 'ML', 'AI']
    };
    
    const filterTags = filterMap[activeFilter] || [];
    const matchesFilter = project.tags.some(tag => 
      filterTags.some(filterTag => tag.toLowerCase().includes(filterTag.toLowerCase()))
    );
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (projectId) => {
    console.log('Navigating to project:', projectId); // Debug log
    try {
      navigate(`/SoftwareProjectDetail/${projectId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleRequestCustomProject = () => {
    navigate('/request-project');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return '#10B981';
      case 'INTERMEDIATE': return '#F59E0B';
      case 'ADVANCED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="software-projects">
      <div className="software-projects__header">
        <h1 className="software-projects__title">Software Projects</h1>
        <p className="software-projects__subtitle">
          Explore innovative software solutions from web apps to AI systems
        </p>
        
        <div className="software-projects__stats">
          <div className="stat">
            <span className="stat__value">Premium</span>
            <span className="stat__label">QUALITY</span>
          </div>
          <div className="stat">
            <span className="stat__value">6</span>
            <span className="stat__label">CATEGORIES</span>
          </div>
          <div className="stat">
            <span className="stat__value">24/7</span>
            <span className="stat__label">SUPPORT</span>
          </div>
        </div>
      </div>

      <div className="software-projects__search">
        <input
          type="text"
          placeholder="Search projects, technologies, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="software-projects__filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="software-projects__grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-card__image">
              <img src={project.image} alt={project.title} />
              <span 
                className="project-card__difficulty"
                style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
              >
                {project.difficulty}
              </span>
            </div>
            
            <div className="project-card__content">
              <div className="project-card__header">
                <h3 className="project-card__title">{project.title}</h3>
                <span className="project-card__price">{project.price}</span>
              </div>
              
              <p className="project-card__description">{project.description}</p>
              
              <div className="project-card__tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              
              <button 
                className="project-card__btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked for project:', project.id);
                  handleViewDetails(project.id);
                }}
                type="button"
              >
                <span>👁</span> VIEW DETAILS →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="no-projects">
          <p>No projects found matching your criteria.</p>
        </div>
      )}

      {/* Request Custom Project Section */}
      <div className="custom-project-section">
        <div className="custom-project-content">
          <div className="custom-project-info">
            <h2>Need Custom Software?</h2>
            <p>Can't find the perfect software solution? Let our expert developers build a custom application tailored to your specific business needs.</p>
            <div className="features-list">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Custom Development</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Full Source Code</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Modern Technologies</span>
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Ongoing Support</span>
              </div>
            </div>
          </div>
          <div className="custom-project-action">
            <button 
              className="request-custom-btn"
              onClick={handleRequestCustomProject}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10-3.09.304-5.525 2.856-5.525 5.997 0 3.314 2.686 6.003 6 6.003h9.5c4.144 0 7.5-3.356 7.5-7.5s-3.356-7.5-7.5-7.5c-.871 0-1.706.157-2.48.44-.275-4.026-3.617-7.44-7.52-7.44zm3.5 6h-2v4h-4v2h4v4h2v-4h4v-2h-4v-4z"/>
              </svg>
              Request Custom Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7,7 17,7 17,17"></polyline>
              </svg>
            </button>
            <p className="custom-project-subtitle">Get your personalized software solution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareProject;