import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/components/loading.module.css';

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        // Progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 25);
        
        // Create starry background
        const createStars = () => {
            const container = document.querySelector(`.${styles.loadingBackground}`);
            if (container) {
                // Clear existing stars
                const existingStars = container.querySelectorAll(`.${styles.star}`);
                existingStars.forEach(star => star.remove());
                
                // Create new stars
                for (let i = 0; i < 150; i++) {
                    const star = document.createElement('div');
                    star.classList.add(styles.star);
                    
                    // Random positioning
                    const size = Math.random() * 3;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    star.style.top = `${Math.random() * 100}%`;
                    star.style.left = `${Math.random() * 100}%`;
                    
                    // Animation properties
                    star.style.setProperty('--opacity', `${0.2 + Math.random() * 0.8}`);
                    star.style.setProperty('--duration', `${2 + Math.random() * 6}s`);
                    
                    container.appendChild(star);
                }
            }
        };
        
        createStars();
        
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
        <div className={styles.loadingScreen}>
            <div className={styles.loadingContent}>
                <div className={styles.loadingLogo}>
                    {'EYEGASM'.split('').map((letter, i) => (
                        <span 
                            key={i} 
                            className={styles.loadingLetter}
                            style={{ 
                                animationDelay: `${i * 0.1}s`,
                                transform: `rotateX(${Math.sin(i * 0.5) * 10}deg)`
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
                
                <div className={styles.loadingProgressContainer}>
                    <div 
                        className={styles.loadingProgressBar} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                
                <div className={styles.loadingText}>
                    <span className={styles.loadingCaption}>Crafting visual experience</span>
                    <span className={styles.loadingPercentage}>{progress}%</span>
                </div>
            </div>
            
            <div className={styles.loadingBackground}>
                {/* Star elements will be added here by JavaScript */}
            </div>
            
            <canvas ref={canvasRef} className={styles.cosmicCanvas}></canvas>
        </div>
    );
}