import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './PopularProjects.css';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'blue';
    case 'Intermediate': return 'orange';
    case 'Advanced': return 'purple';
    case 'Expert': return 'red';
    default: return 'blue';
  }
};

const PopularProjects = () => {
  const { project_list, url } = useCart();
  const navigate = useNavigate();

  // Show all projects across both categories, newest first
  const projects = [...project_list]
    .reverse()
    .map(p => ({
      id: p._id,
      title: p.name,
      description: p.description,
      image: `${url}/images/${p.image}`,
      difficulty: p.difficulty || 'Intermediate',
      difficultyColor: getDifficultyColor(p.difficulty),
      price: `₹${p.price}`,
      priceNote: '+ component cost',
      tags: p.tags || [],
      category: p.category,
      features: [
        { icon: "📄", text: "Abstract" },
        { icon: "📊", text: "PPT" },
        { icon: "📋", text: "Report" },
        { icon: "🎥", text: "Video" }
      ]
    }));

  const handleViewDetails = (project) => {
    if (project.category === 'Hardware') {
      navigate(`/hardware-project/${project.id}`);
    } else {
      navigate(`/SoftwareProjectDetail/${project.id}`);
    }
  };

  return (
    <section id="projects-section" className="popular-projects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Explore Our Projects</h2>
          <p className="section-subtitle">
            Browse hardware and software projects together. All packages include complete documentation and expert guidance.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card" onClick={() => handleViewDetails(project)} style={{ cursor: 'pointer' }}>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className={`difficulty-badge ${project.difficultyColor}`}>
                  {project.difficulty}
                </div>
                <div className={`category-badge ${project.category === 'Hardware' ? 'hardware' : 'software'}`}>
                  {project.category === 'Hardware' ? 'Hardware' : 'Software'}
                </div>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="project-price">
                  <div className="price-info">
                    <span className="price">{project.price}</span>
                    <span className="price-note">{project.priceNote}</span>
                  </div>
                </div>

                <div className="project-features">
                  {project.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-icon">{feature.icon}</span>
                      <span className="feature-text">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>No projects added yet.</p>
        )}
      </div>
    </section>
  );
};

export default PopularProjects;
