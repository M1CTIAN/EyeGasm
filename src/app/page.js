'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

// Import all components
import {
    EyeVisualizationPage,
    LoadingScreen,
    HeroSection,
    ParallaxSection,
    FeaturesSection,
    TestimonialsSection,
    ContactSection,
    Footer
} from '../components';

export default function Page() {
    const scrollRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time and then hide the loader
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500); // 2.5 seconds loading screen

        // Dynamically import Locomotive Scroll to avoid SSR issues
        const initLocomotiveScroll = async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;

            const scroll = new LocomotiveScroll({
                el: scrollRef.current,
                smooth: true,
                multiplier: 1,
                lerp: 0.07, // Linear interpolation, lower = smoother
                smartphone: {
                    smooth: true
                },
                tablet: {
                    smooth: true
                }
            });

            // Update scroll on window resize
            window.addEventListener('resize', () => {
                scroll.update();
            });

            // Clean up
            return () => {
                scroll.destroy();
                window.removeEventListener('resize', scroll.update);
            };
        };

        // Only init scroll after loading is complete
        if (!loading) {
            initLocomotiveScroll();
        }

        return () => clearTimeout(timer);
    }, [loading]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className={styles.container} data-scroll-container ref={scrollRef}>
            <HeroSection />

            {/* Eye visualization - static section */}
            <section data-scroll-section>
                <EyeVisualizationPage />
            </section>

            <ParallaxSection
                id="gallery"
                backgroundImage="/Fronalpstock_big.jpg"
                title="Visual Storytelling"
                subtitle="Where imagery meets imagination"
                scrollSpeed="-4"
                titleScrollSpeed="2"
                subtitleScrollSpeed="1"
            />

            <FeaturesSection />

            <ParallaxSection
                backgroundImage="/Workers-Big-Ben-London.webp"
                title="Immersive Experiences"
                subtitle="Scroll to unlock new perspectives"
                scrollSpeed="-2"
                titleScrollSpeed="3"
                subtitleScrollSpeed="1.5"
            />

            <ParallaxSection
                backgroundImage="/NEO_elbrus_big.jpg"
                title="Creative Visuals"
                subtitle="Pushing the boundaries of web design"
                scrollSpeed="-3"
                titleScrollSpeed="2"
                subtitleScrollSpeed="1"
            />

            {/* <ContactSection /> */}

            <Footer />
        </div>
    );
}