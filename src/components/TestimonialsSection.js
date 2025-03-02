import React from 'react';
import styles from '../styles/components/testimonials.module.css';

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className={styles.testimonialSection} data-scroll-section>
            <h2 className={styles.sectionTitle}>What People Say</h2>
            
            <div className={styles.testimonialGrid}>
                <div className={styles.testimonial} data-scroll data-scroll-speed="1">
                    <div className={styles.testimonialQuote}>&ldquo;</div>
                    <p>The visual effects and animations on this site are absolutely mind-blowing. I&apos;ve never experienced anything quite like this before!</p>
                    <div className={styles.testimonialAuthor}>
                        <div className={styles.testimonialAvatar}>JD</div>
                        <div>
                            <h4>Jane Doe</h4>
                            <p>Digital Artist</p>
                        </div>
                    </div>
                </div>
                
                <div className={styles.testimonial} data-scroll data-scroll-speed="1.2">
                    <div className={styles.testimonialQuote}>&ldquo;</div>
                    <p>This website sets a new standard for immersive web design. It&apos;s not just visually stunning, but also incredibly smooth to navigate.</p>
                    <div className={styles.testimonialAuthor}>
                        <div className={styles.testimonialAvatar}>JS</div>
                        <div>
                            <h4>John Smith</h4>
                            <p>UI/UX Designer</p>
                        </div>
                    </div>
                </div>
                
                <div className={styles.testimonial} data-scroll data-scroll-speed="1.4">
                    <div className={styles.testimonialQuote}>&ldquo;</div>
                    <p>The attention to detail in the animations and transitions is remarkable. Every scroll reveals something new and exciting.</p>
                    <div className={styles.testimonialAuthor}>
                        <div className={styles.testimonialAvatar}>AL</div>
                        <div>
                            <h4>Alex Lee</h4>
                            <p>Web Developer</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
