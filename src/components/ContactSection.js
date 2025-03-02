import React from 'react';
import styles from '../app/page.module.css';

export default function ContactSection() {
    return (
        <section id="contact" className={styles.contactSection} data-scroll-section>
            <h2 data-scroll data-scroll-speed="1">Get in Touch</h2>
            <p data-scroll data-scroll-speed="1.2">Want to learn more about our visual techniques?</p>
            <button className={styles.ctaButton} data-scroll data-scroll-speed="1.5">Contact Us</button>
        </section>
    );
}