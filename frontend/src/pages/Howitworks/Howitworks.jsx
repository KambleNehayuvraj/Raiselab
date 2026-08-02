import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Howitworks.module.css';

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleRequestProject = () => {
    navigate('/request-project');
  };
  const handleViewProjects = () => {
    navigate('/');
  };

  const steps = [
    {
      number: "01",
      title: "Consultation & Planning",
      description: "We start with a detailed consultation to understand your project requirements, timeline, and budget. Our team analyzes your needs and creates a comprehensive project plan.",
      icon: "💡"
    },
    {
      number: "02",
      title: "Custom Design & Development",
      description: "Our expert developers create custom solutions tailored to your specifications. We use cutting-edge technologies and best practices to build your hardware and software projects.",
      icon: "🔧"
    },
    {
      number: "03",
      title: "Testing & Quality Assurance",
      description: "Every project undergoes rigorous testing to ensure optimal performance and reliability. We conduct comprehensive quality checks before delivery.",
      icon: "✅"
    },
    {
      number: "04",
      title: "Delivery & Support",
      description: "We deliver your completed project with full documentation and provide ongoing support. Our team ensures smooth implementation and addresses any questions you may have.",
      icon: "🚀"
    }
  ];

  const features = [
    {
      title: "Expert Team",
      description: "Skilled professionals with years of experience in hardware and software development.",
      icon: "👥"
    },
    {
      title: "Latest Technology",
      description: "We use cutting-edge tools and technologies to deliver modern, efficient solutions.",
      icon: "💻"
    },
    {
      title: "Agile Process",
      description: "Our flexible development process ensures quick iterations and timely delivery.",
      icon: "⚡"
    },
    {
      title: "Complete Solutions",
      description: "From concept to deployment, we handle every aspect of your project.",
      icon: "🎯"
    }
  ];

  return (
    <div className={styles.howItWorks}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              How It <span className={styles.highlight}>Works</span>
            </h1>
            <p className={styles.heroDescription}>
              Our streamlined process ensures your project is delivered on time, within budget, 
              and exceeds your expectations. Here's how we make it happen.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Process</h2>
            <p className={styles.sectionSubtitle}>
              A proven methodology that delivers results
            </p>
          </div>
          
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className={styles.stepConnector}></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Our Process</h2>
            <p className={styles.sectionSubtitle}>
              What makes our approach different and effective
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Project Timeline</h2>
            <p className={styles.sectionSubtitle}>
              Typical project phases and duration
            </p>
          </div>
          
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4>Week 1-2</h4>
                <h3>Project Initiation</h3>
                <p>Requirements gathering, planning, and resource allocation</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4>Week 3-8</h4>
                <h3>Development Phase</h3>
                <p>Core development work with regular progress updates</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4>Week 9-10</h4>
                <h3>Testing & Refinement</h3>
                <p>Comprehensive testing and final adjustments</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4>Week 11</h4>
                <h3>Delivery & Support</h3>
                <p>Final delivery with documentation and ongoing support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Project?</h2>
            <p className={styles.ctaDescription}>
              Let's discuss your requirements and create something amazing together.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary} onClick={handleRequestProject}>
                Request Custom Project
              </button>
              <button className={styles.btnSecondary} onClick={handleViewProjects}>View Our Projects</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;