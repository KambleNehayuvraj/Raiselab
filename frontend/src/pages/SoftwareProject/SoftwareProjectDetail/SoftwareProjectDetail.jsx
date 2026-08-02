import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import styles from './SoftwareProjectDetail.module.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, project_list, url } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectInterest: ''
  });

  // Contact information - Update these with your actual details
  const contactInfo = {
    whatsapp: '+91-9518731152', // Replace with your WhatsApp number
    email: 'Raiselab68@gmail.com', // Replace with your email
    responseTime: 'Within 2-4 hours'
  };

  // Build the project shape this component expects from the raw DB record
  const dbProject = project_list.find(p => p._id === id && p.category === 'Software');

  const project = dbProject ? {
    id: dbProject._id,
    title: dbProject.name,
    description: dbProject.description,
    longDescription: dbProject.longDescription || dbProject.description,
    difficulty: dbProject.difficulty || 'Intermediate',
    image: dbProject.image,
    tags: dbProject.tags || [],
    price: `₹${dbProject.price}`,
    numericPrice: dbProject.price,
    category: dbProject.category,
    features: dbProject.features || [],
    specifications: dbProject.specifications || {},
    github: dbProject.github || '#',
    demo: dbProject.demo || '#'
  } : null;


  if (!project) {
    return (
      <div className={styles.projectDetail}>
        <div className={styles.errorContainer}>
          <h2>Project Not Found</h2>
          <button onClick={() => navigate('/software-projects')} className={styles.backBtn}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      case 'Expert': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${project.title} project. Could you please provide more details about pricing and availability?`
    );
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Inquiry about ${project.title}`);
    const body = encodeURIComponent(
      `Hello,\n\nI'm interested in the ${project.title} project.\n\nCould you please provide more information about:\n- Pricing and packages\n- Customization options\n- Delivery timeline\n- Technical support\n\nThank you!`
    );
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Create WhatsApp message from form data
    const message = `*New Project Inquiry*
  
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Project Interest: ${formData.projectInterest}

Message:
${formData.message}

---
*Sent via Software Projects Website Contact Form*`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    alert('Redirecting to WhatsApp with your message!');
    
    // Close modal and reset form
    setShowContactModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      projectInterest: project.title
    });
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      
      // Convert price to numeric value
      const numericPrice = project.numericPrice || 
        parseFloat(project.price.replace(/[₹,\s]/g, ''));
      
      // Create cart item object
      const cartItem = {
        id: project.id,
        name: project.title,
        description: project.description,
        price: numericPrice,
        image: project.image,
        category: project.category,
        difficulty: project.difficulty,
        tags: project.tags,
        quantity: 1,
        type: 'software' // Add type to distinguish from hardware projects
      };

      // Add to cart (synchronous call)
      addToCart(cartItem);
      
      // Optional: Show success message
      console.log('Added to cart:', cartItem);
      
      // Reset loading state immediately after adding to cart
      // The "Added to Cart" state will be handled by isProjectInCart
      setIsAdding(false);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart. Please try again.');
      setIsAdding(false);
    }
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const isProjectInCart = isInCart && isInCart(project.id);

  return (
    <div className={styles.projectDetail}>
      <div className={styles.projectHeader}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        
        <div className={styles.projectHero}>
          <div className={styles.projectHeroContent}>
            <h1 className={styles.projectTitle}>{project.title}</h1>
            <p className={styles.projectSubtitle}>{project.description}</p>
            
            <div className={styles.projectMeta}>
              <span 
                className={styles.difficultyBadge} 
                style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
              >
                {project.difficulty}
              </span>
              <span className={styles.priceTag}>{project.price}</span>
            </div>

            <div className={styles.projectTags}>
              {project.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            
          </div>
          
          <div className={styles.projectImage}>
            <img src={project.image} alt={project.title} />
          </div>
        </div>
      </div>

      <div className={styles.projectContent}>
        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <section className={styles.projectOverview}>
              <h2>Project Overview</h2>
              <p>{project.longDescription}</p>
            </section>

            <section className={styles.projectFeatures}>
              <h2>Key Features</h2>
              <ul className={styles.featuresList}>
                {project.features.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.specificationsCard}>
              <h3>Technical Stack</h3>
              <div className={styles.specsList}>
                {Object.entries(project.specifications).map(([key, value]) => (
                  <div key={key} className={styles.specItem}>
                    <span className={styles.specLabel}>{key}:</span>
                    <span className={styles.specValue}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.purchaseCard}>
              <div className={styles.priceSection}>
                <span className={styles.price}>{project.price}</span>
                <span className={styles.priceNote}>Source Code + Documentation</span>
              </div>
              
              
              <div className={styles.contactSection}>
                <h4 className={styles.contactTitle}>Get in Touch</h4>
                
                <button 
                  className={styles.whatsappBtn}
                  onClick={handleWhatsAppClick}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                  </svg>
                  Message on WhatsApp
                </button>

                <button 
                  className={styles.emailBtn}
                  onClick={handleEmailClick}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email for Inquiry
                </button>

                <button 
                  className={styles.contactFormBtn}
                  onClick={() => setShowContactModal(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Contact Form
                </button>

                <div className={styles.contactInfo}>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactLabel}>📱 WhatsApp:</span>
                    <span className={styles.contactValue}>{contactInfo.whatsapp}</span>
                  </div>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactLabel}>📧 Email:</span>
                    <span className={styles.contactValue}>{contactInfo.email}</span>
                  </div>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactLabel}>⏱️ Response Time:</span>
                    <span className={styles.contactValue}>{contactInfo.responseTime}</span>
                  </div>
                  <div className={styles.supportNote}>
                    💬 Free consultation & technical support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactModal && (
        <div className={styles.modalOverlay} onClick={() => setShowContactModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Contact Us</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowContactModal(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="projectInterest">Project Interest</label>
                <input
                  type="text"
                  id="projectInterest"
                  name="projectInterest"
                  value={project.title}
                  readOnly
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Please describe your requirements, timeline, and any specific questions you have..."
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowContactModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;