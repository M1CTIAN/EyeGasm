import React from 'react';
import styles from '../app/page.module.css';

export default function TestimonialsSection() {
    return (
        <section className={`${styles.section}`} data-scroll-section>
            <h2 data-scroll data-scroll-speed="1" className={styles.sectionTitle}>
                What Our <span className={styles.highlight}>Visitors Say</span>
            </h2>
            <div className={styles.testimonialGrid}>
                <blockquote className={styles.testimonial} data-scroll data-scroll-speed="1.3">
                    <div className={styles.testimonialQuote}>"</div>
                    <p>The visual experience was truly captivating. I couldn't look away! The parallax effects create such a unique sense of depth.</p>
                    <div className={styles.testimonialAuthor}>
                        <div className={styles.testimonialAvatar}>AS</div>
                        <div>
                            <h4>Alex Smith</h4>
                            <p>Web Designer</p>
                        </div>
                    </div>
                </blockquote>
                <blockquote className={styles.testimonial} data-scroll data-scroll-speed="1.7">
                    <div className={styles.testimonialQuote}>"</div>
                    <p>These parallax effects create such a unique browsing experience. I've never seen a website that feels so alive and interactive.</p>
                    <div className={styles.testimonialAuthor}>
                        <div className={styles.testimonialAvatar}>JJ</div>
                        <div>
                            <h4>Jamie Johnson</h4>
                            <p>Creative Director</p>
                        </div>
                    </div>
                </blockquote>
            </div>
        </section>
    );
}
