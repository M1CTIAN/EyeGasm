import React, { useState, useEffect, useRef } from 'react';
import EyeVisualization from './EyeVisualizationPage';
import { motion } from 'framer-motion';
import '../styles/components/HeroSection.module.css';

const HeroSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const textLayerRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const parallaxOffset = {
    x: (mousePosition.x - 0.5) * 20,
    y: (mousePosition.y - 0.5) * 20
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };
  
  const titleText = "EYEGASM";
  
  return (
    <div className="hero-container" ref={heroRef}>
      <div className="eye-container">
        <EyeVisualization />
      </div>
      
      <div className="hero-content" ref={textLayerRef} 
           style={{ 
             transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)` 
           }}>
        <motion.div 
          className="hero-text-container"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <motion.h1 className="hero-title">
            {titleText.split('').map((letter, index) => (
              <motion.span 
                key={index} 
                variants={letterVariants}
                className="hero-letter"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Explore the depths of visual perception
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <button className="primary-button pulse-button">
              Begin Journey
            </button>
            <button className="secondary-button">
              Learn More
            </button>
          </motion.div>
        </motion.div>
        
        <div className="hero-scrolling-indicator">
          <div className="scroll-text">Scroll to explore</div>
          <div className="scroll-icon"></div>
        </div>
      </div>
      
      <div className="iris-overlay"></div>
    </div>
  );
};

export default HeroSection;
