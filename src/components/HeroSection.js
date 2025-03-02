import React from 'react';
import styles from '../styles/components/hero.module.css';

export default function HeroSection() {
    return (
        <header id="home" className={styles.hero} data-scroll-section>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent} data-scroll>
                <div className={styles.heroTextContainer}>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.heroTitle} data-scroll data-scroll-speed="1">
                            <span className={styles.heroTitleBig}>EYEGASM</span>
                        </h1>
                    </div>
                    
                    <div className={styles.subtitleWrapper} data-scroll data-scroll-speed="1.2">
                        <p className={styles.heroSubtitle}>
                            Visual experiences that captivate your senses
                        </p>
                    </div>
                </div>
                
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollLine}></div>
                    <span>Scroll</span>
                </div>
            </div>
        </header>
    );
}
