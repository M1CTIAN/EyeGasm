import React from 'react';
import styles from '../styles/components/features.module.css';

export default function FeaturesSection() {
    return (
        <section id="about" className={styles.featuresSection} data-scroll-section>
            <div className={styles.featuresSectionInner}>
                <h2 data-scroll data-scroll-speed="1" className={styles.sectionTitle}>
                    Our Visual <span className={styles.highlight}>Experiences</span>
                </h2>
                <p className={styles.sectionSubtitle} data-scroll data-scroll-speed="1.1">
                    Creating immersive digital experiences through cutting-edge web techniques
                </p>
                
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard} data-scroll data-scroll-speed="1.2">
                        <div className={styles.featureIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"/>
                                <path d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3>Dynamic Imagery</h3>
                        <p>Stunning visuals that come to life as you scroll, creating an immersive experience that captivates visitors.</p>
                        <div className={styles.featureCardHover}></div>
                    </div>
                    
                    <div className={styles.featureCard} data-scroll data-scroll-speed="1.4">
                        <div className={styles.featureIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"/>
                                <path d="M4.5 10.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S6 12.825 6 12s-.675-1.5-1.5-1.5zm15 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S21 12.825 21 12s-.675-1.5-1.5-1.5zm-7.5 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3>Parallax Effects</h3>
                        <p>Create depth and dimension with modern scrolling techniques that transform how users interact with content.</p>
                        <div className={styles.featureCardHover}></div>
                    </div>
                    
                    <div className={styles.featureCard} data-scroll data-scroll-speed="1.6">
                        <div className={styles.featureIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"/>
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3>Visual Impact</h3>
                        <p>Designs that leave a lasting impression through thoughtful composition and cutting-edge visual techniques.</p>
                        <div className={styles.featureCardHover}></div>
                    </div>
                </div>
                
                <div className={styles.featureDecoration} data-scroll data-scroll-direction="horizontal" data-scroll-speed="-2"></div>
            </div>
        </section>
    );
}
