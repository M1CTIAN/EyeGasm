import React from 'react';
import styles from '../styles/components/parallax.module.css';

export default function ParallaxSection({
    id,
    backgroundImage,
    title,
    subtitle,
    scrollSpeed = -4,
    titleScrollSpeed = 2,
    subtitleScrollSpeed = 1
}) {
    return (
        <section id={id} className={styles.parallaxSection} data-scroll-section>
            <div
                className={styles.parallaxBackground}
                data-scroll
                data-scroll-speed={scrollSpeed}
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            >
                <div className={styles.parallaxContent}>
                    {title && (
                        <h2 data-scroll data-scroll-speed={titleScrollSpeed}>{title}</h2>
                    )}
                    {subtitle && (
                        <p data-scroll data-scroll-speed={subtitleScrollSpeed}>{subtitle}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
