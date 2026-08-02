import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Projects.css'; 

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'hardware', 'software'
  const { url, token, addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  // Fetch projects function
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${url}/api/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.projects || data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, [url, token]);

  // Filter projects based on selected filter
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.category?.toLowerCase() === filter;
  });

  // Handle project detail navigation
  const handleProjectDetail = (project) => {
    if (project.category?.toLowerCase() === 'hardware') {
      navigate(`/hardware-project/${project.id}`);
    } else if (project.category?.toLowerCase() === 'software') {
      navigate(`/SoftwareProjectDetail/${project.id}`);
    }
  };

  if (loading) {
    return (
      <div className="projects-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-error">
        <h2>Error Loading Projects</h2>
        <p>{error}</p>
        <button onClick={fetchProjects} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Our Projects</h1>
        <p>Discover amazing hardware and software projects</p>
        
        {/* Filter buttons */}
        <div className="projects-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Projects
          </button>
          <button 
            className={filter === 'hardware' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('hardware')}
          >
            Hardware
          </button>
          <button 
            className={filter === 'software' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('software')}
          >
            Software
          </button>
        </div>

        <button onClick={fetchProjects} className="refresh-btn">
          Refresh Projects
        </button>
      </div>
      
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <h3>No projects found</h3>
            <p>No projects available for the selected category.</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              {project.image && (
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
              )}
              
              <div className="project-content">
                <div className="project-category">
                  {project.category}
                </div>
                
                <h3 className="project-title">{project.title}</h3>
                
                <p className="project-description">
                  {project.description?.length > 150 
                    ? `${project.description.substring(0, 150)}...` 
                    : project.description}
                </p>
                
                <div className="project-price">
                  <span className="price">₹{project.price}</span>
                  {project.originalPrice && (
                    <span className="original-price">₹{project.originalPrice}</span>
                  )}
                </div>

                {project.technologies && (
                  <div className="project-technologies">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="tech-more">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="project-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleProjectDetail(project)}
                >
                  View Details
                </button>
                
                <button 
                  className={isInCart(project.id) ? 'add-to-cart-btn in-cart' : 'add-to-cart-btn'}
                  onClick={() => (isInCart(project.id) ? navigate('/cart') : addToCart(project))}
                >
                  {isInCart(project.id) ? 'Go to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;