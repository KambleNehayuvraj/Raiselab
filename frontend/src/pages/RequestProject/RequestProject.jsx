import React, { useState } from 'react';
import './RequestProject.css';

const RequestProject = () => {
  // Configuration - Replace with your actual contact details
  const contactInfo = {
    whatsapp: '+91-9518731152', // Replace with your WhatsApp number
    email: 'Raiselab68@gmail.com' // Replace with your email
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: '',
    projectTitle: '',
    description: '',
    features: '',
    preferredTech: '',
    deadline: '',
    budget: '',
    file: null,
    additionalServices: {
      documentation: false,
      presentation: false,
      codeExplanation: false,
      videDemo: false,
      onlineSupport: false
    }
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionChoice, setShowSubmissionChoice] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (service) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [service]: !prev.additionalServices[service]
      }
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const formatWhatsAppMessage = (data) => {
    const selectedServices = Object.entries(data.additionalServices)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const serviceNames = {
          documentation: '• Full Report & Documentation',
          presentation: '• PPT Presentation',
          codeExplanation: '• Code Explanation',
          videDemo: '• Video Demonstration',
          onlineSupport: '• Online Support'
        };
        return serviceNames[key];
      })
      .join('\n');

    return `*🚀 New Project Request*

*👤 Contact Information:*
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

*📋 Project Details:*
Type: ${data.projectType}
Title: ${data.projectTitle}
Description: ${data.description}
Features: ${data.features || 'Not specified'}
Preferred Tech: ${data.preferredTech || 'Not specified'}
Deadline: ${data.deadline || 'Not specified'}
Budget: ${data.budget || 'Not specified'}

*🎯 Additional Services:*
${selectedServices || 'None selected'}

*📎 File Attached:* ${data.file ? data.file.name : 'No file attached'}

---
*Sent via Project Request Form*
*Date:* ${new Date().toLocaleString()}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Show choice modal after brief loading
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmissionChoice(true);
    }, 1000);
  };

  const handleWhatsAppSubmit = () => {
    const message = formatWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Close choice modal
    setShowSubmissionChoice(false);
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success state
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        projectType: '',
        projectTitle: '',
        description: '',
        features: '',
        preferredTech: '',
        deadline: '',
        budget: '',
        file: null,
        additionalServices: {
          documentation: false,
          presentation: false,
          codeExplanation: false,
          videDemo: false,
          onlineSupport: false
        }
      });
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
    }, 3000);
  };

  const handleEmailSubmit = () => {
    const selectedServices = Object.entries(formData.additionalServices)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const serviceNames = {
          documentation: '• Full Report & Documentation',
          presentation: '• PPT Presentation',
          codeExplanation: '• Code Explanation',
          videDemo: '• Video Demonstration',
          onlineSupport: '• Online Support'
        };
        return serviceNames[key];
      })
      .join('\n');

    const subject = encodeURIComponent(`Project Request: ${formData.projectTitle}`);
    const body = encodeURIComponent(`Hello,

I would like to request a custom project with the following details:

CONTACT INFORMATION:
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

PROJECT DETAILS:
Type: ${formData.projectType}
Title: ${formData.projectTitle}
Description: ${formData.description}
Features: ${formData.features || 'Not specified'}
Preferred Technology: ${formData.preferredTech || 'Not specified'}
Expected Deadline: ${formData.deadline || 'Not specified'}
Budget Range: ${formData.budget || 'Not specified'}

ADDITIONAL SERVICES:
${selectedServices || 'None selected'}

ATTACHMENTS:
${formData.file ? `File attached: ${formData.file.name}` : 'No files attached'}

Please let me know the next steps and provide a detailed proposal.

Thank you!

---
Sent via Project Request Form
Date: ${new Date().toLocaleString()}`);

    // Close choice modal
    setShowSubmissionChoice(false);
    
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    
    // Show success state
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        projectType: '',
        projectTitle: '',
        description: '',
        features: '',
        preferredTech: '',
        deadline: '',
        budget: '',
        file: null,
        additionalServices: {
          documentation: false,
          presentation: false,
          codeExplanation: false,
          videDemo: false,
          onlineSupport: false
        }
      });
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="request-project-page">
        <div className="success-message">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2>Request Submitted Successfully!</h2>
          <p>Thanks! We'll get back to you shortly with a detailed proposal.</p>
          <div className="success-animation"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-project-page">
      <div className="request-container">
        {/* Header Section */}
        <div className="request-header">
          <h1 className="request-title">
            Request a <span className="highlight">Custom Project</span>
          </h1>
          <p className="request-subtitle">
            Tell us your idea or requirement and our team will build a tailored software or hardware project 
            with complete documentation and support.
          </p>
        </div>

        {/* Form Section */}
        <form className="request-form" onSubmit={handleSubmit}>
          {/* Basic Contact Information */}
          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="form-section">
            <h3 className="section-title">Project Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="projectType">Project Type *</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select project type</option>
                  <option value="software">Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="both">Both (Software + Hardware)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="projectTitle">Project Title / Topic *</label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief title for your project"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Brief Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Describe your project requirements, goals, and expected functionality..."
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="features">Features Needed</label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows="3"
                placeholder="List specific features or functionalities you need (optional)"
              ></textarea>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="preferredTech">Preferred Programming Language / Tools</label>
                <input
                  type="text"
                  id="preferredTech"
                  name="preferredTech"
                  value={formData.preferredTech}
                  onChange={handleInputChange}
                  placeholder="e.g., Python, JavaScript, Arduino, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="deadline">Expected Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="budget">Budget Range</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="">Select budget range</option>
                  <option value="under-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1,000</option>
                  <option value="1000-2500">₹1,000 - ₹2,500</option>
                  <option value="2500-5000">₹2,500 - ₹5,000</option>
                  <option value="5000-plus">₹5,000+</option>
                  <option value="discuss">Let's Discuss</option>
                </select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="form-section">
            <h3 className="section-title">Reference Documents</h3>
            <div className="file-upload-area">
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                className="file-input"
              />
              <label htmlFor="file" className="file-upload-label">
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <span>Upload Reference Files</span>
                <small>PDF, DOC, Images (Max 10MB)</small>
              </label>
              {formData.file && (
                <div className="file-selected">
                  <span>Selected: {formData.file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Services */}
          <div className="form-section">
            <h3 className="section-title">Additional Services</h3>
            <div className="checkbox-grid">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.additionalServices.documentation}
                  onChange={() => handleCheckboxChange('documentation')}
                />
                <span className="checkmark"></span>
                <div className="checkbox-content">
                  <strong>Full Report & Documentation</strong>
                  <small>Comprehensive project documentation with technical details</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.additionalServices.presentation}
                  onChange={() => handleCheckboxChange('presentation')}
                />
                <span className="checkmark"></span>
                <div className="checkbox-content">
                  <strong>PPT Presentation</strong>
                  <small>Professional presentation explaining the project</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.additionalServices.codeExplanation}
                  onChange={() => handleCheckboxChange('codeExplanation')}
                />
                <span className="checkmark"></span>
                <div className="checkbox-content">
                  <strong>Code Explanation</strong>
                  <small>Detailed explanation of code structure and logic</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.additionalServices.videDemo}
                  onChange={() => handleCheckboxChange('videDemo')}
                />
                <span className="checkmark"></span>
                <div className="checkbox-content">
                  <strong>Video Demonstration</strong>
                  <small>Video walkthrough of the project functionality</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.additionalServices.onlineSupport}
                  onChange={() => handleCheckboxChange('onlineSupport')}
                />
                <span className="checkmark"></span>
                <div className="checkbox-content">
                  <strong>Online Support</strong>
                  <small>Post-delivery support and maintenance assistance</small>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-section">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Submitting Request...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>

        {/* Submission Choice Modal */}
        {showSubmissionChoice && (
          <div className="modal-overlay">
            <div className="choice-modal">
              <h3>Choose your preferred contact method:</h3>
              <p>How would you like to send your project request?</p>
              
              <div className="choice-buttons">
                <button 
                  className="choice-btn whatsapp-btn"
                  onClick={handleWhatsAppSubmit}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.75"/>
                  </svg>
                  Send via WhatsApp
                </button>
                
                <button 
                  className="choice-btn email-btn"
                  onClick={handleEmailSubmit}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Send via Email
                </button>
              </div>
              
              <button 
                className="close-modal-btn"
                onClick={() => setShowSubmissionChoice(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestProject;