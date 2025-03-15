import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import EyeVisualization from './EyeVisualizationPage';
import styles from '../styles/components/IntegratedHeroSection.module.css';

const IntegratedHeroSection = ({ scrollProgress }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const isZoomedIn = scrollProgress > 300;
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized mouse position
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Calculate zoom effect based on scroll
  const zoomProgress = Math.min(1, scrollProgress / 800);
  
  // Pupil zoom effect - starts small and centered, zooms to fill screen
  const zoomScale = 1 + (zoomProgress * 15); // Scale up to 16x original size
  const pupilOpacity = 1 - (zoomProgress * 0.5); // Fade slightly for depth effect
  
  // Mouse parallax for subtle eye movement (reduce effect as we zoom in)
  const eyeParallax = {
    x: (mousePosition.x - 0.5) * -10 * (1 - zoomProgress),
    y: (mousePosition.y - 0.5) * -10 * (1 - zoomProgress)
  };
  
  // Calculate title effects
  const titleOpacity = Math.max(0, 1 - (zoomProgress * 2)); // Title fades out faster
  const titleScale = 1 - (zoomProgress * 0.3);
  
  return (
    <div className={styles.heroContainer} ref={heroRef}>
      {/* Eye visualization with zoom effect */}
      <div 
        className={styles.eyeContainer}
        style={{ 
          transform: `scale(${zoomScale}) translate3d(${eyeParallax.x}px, ${eyeParallax.y}px, 0px)`,
          opacity: pupilOpacity,
          filter: `brightness(${1 - zoomProgress * 0.5}) blur(${zoomProgress * 8}px)`
        }}
      >
        <EyeVisualization />
      </div>
      
      {/* Minimalist content overlay - just the title */}
      <div className={styles.contentOverlay}>
        <motion.div 
          className={styles.titleContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
          }}
        >
          <h1 className={styles.mainTitle}>
            <span className={styles.thin}>EYE</span>
            <span className={styles.bold}>GASM</span>
          </h1>
        </motion.div>
      </div>
      
      {/* Portal effect - simulates entering the pupil */}
      <div 
        className={styles.portalEffect} 
        style={{ 
          opacity: zoomProgress * 0.7,
          transform: `scale(${0.5 + zoomProgress * 2})`
        }}
      ></div>
      
      {/* Content reveal wrapper - appears after zooming into pupil */}
      <div 
        className={styles.contentRevealWrapper}
        style={{ 
          opacity: zoomProgress > 0.95 ? 1 : 0,
          transform: `translateY(${(1 - Math.min(1, (zoomProgress - 0.95) * 20)) * 100}px)`
        }}
      >
        <div className={styles.emergingContent}>
          {/* This will be empty but styled to transition to the rest of the page */}
        </div>
      </div>
      
      {/* Light rays effect for entrance transition */}
      <div 
        className={styles.lightRays}
        style={{
          opacity: zoomProgress > 0.6 ? zoomProgress - 0.6 : 0
        }}
      ></div>
      
      {/* Depth overlay - changes as we zoom in */}
      <div 
        className={styles.depthOverlay}
        style={{
          background: `radial-gradient(
            circle at center,
            transparent ${30 - zoomProgress * 30}%,
            rgba(0, 0, 0, ${0.2 + zoomProgress * 0.3}) ${70 - zoomProgress * 40}%,
            rgba(0, 0, 0, ${0.5 + zoomProgress * 0.5}) 100%
          )`
        }}
      ></div>
    </div>
  );
};

export default IntegratedHeroSection;