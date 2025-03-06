import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const EyeVisualization = ({ className, style }) => {
    const containerRef = useRef(null);
    const requestRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const eyeGroupRef = useRef(null);
    const irisRef = useRef(null);
    const fibersGroupRef = useRef(null);
    const pupilRef = useRef(null);
    const pointLightRef = useRef(null);
    const materialRefs = useRef([]);

    const scrollYRef = useRef(0);
    const targetScrollYRef = useRef(0);
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Initialize Three.js scene
        const initScene = () => {
            // Scene setup
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            sceneRef.current = scene;

            // Camera setup
            const camera = new THREE.PerspectiveCamera(
                60,
                containerRef.current.clientWidth / containerRef.current.clientHeight,
                0.1,
                1000
            );
            camera.position.z = 10;
            cameraRef.current = camera;

            // Renderer setup - enable HDR-like rendering
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setClearColor(0x000000, 1);
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better contrast
            renderer.toneMappingExposure = 1.2; // Increase exposure

            // Clear any existing canvas
            while (containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
            }

            // Append new renderer
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Increase ambient light for better base illumination
            const ambientLight = new THREE.AmbientLight(0x333333); // Brighter ambient
            scene.add(ambientLight);

            // Main light with higher intensity
            const pointLight = new THREE.PointLight(0xffffff, 3.5, 50); // Increased intensity from 2 to 3.5
            pointLight.position.set(5, 5, 8);
            scene.add(pointLight);
            pointLightRef.current = pointLight;

            // Brighter, more vibrant colored lights
            const blueLight = new THREE.PointLight(0x0099ff, 3, 30); // More saturated blue, higher intensity
            blueLight.position.set(-8, 3, 5);
            scene.add(blueLight);

            const greenLight = new THREE.PointLight(0x00ffaa, 3, 30); // More saturated green, higher intensity
            greenLight.position.set(8, -3, 5);
            scene.add(greenLight);

            const purpleLight = new THREE.PointLight(0xaa00ff, 3, 30); // More saturated purple, higher intensity
            purpleLight.position.set(-4, -6, 7);
            scene.add(purpleLight);

            const goldLight = new THREE.PointLight(0xffcc00, 3, 30); // More saturated gold, higher intensity
            goldLight.position.set(4, 6, 7);
            scene.add(goldLight);

            // Add rim light for extra pop and contrast
            const rimLight = new THREE.PointLight(0xffffff, 2, 20);
            rimLight.position.set(0, 0, -5);
            scene.add(rimLight);

            // Create realistic eye
            createRealisticEye();

            // Start animation loop
            animate();

            // Force first render
            renderer.render(scene, camera);
        };

        // Modified createRealisticEye function to remove the limbal ring
        const createRealisticEye = () => {
            const eyeGroup = new THREE.Group();
            sceneRef.current.add(eyeGroup);
            eyeGroupRef.current = eyeGroup;

            // Base iris disc - darker base with no color
            const irisGeometry = new THREE.CircleGeometry(5, 64);
            const irisMaterial = new THREE.MeshStandardMaterial({
                color: 0x050505, // Nearly black base
                side: THREE.DoubleSide,
                roughness: 0.9,
                metalness: 0.1,
                emissive: 0x000000,
                emissiveIntensity: 0.0
            });
            const iris = new THREE.Mesh(irisGeometry, irisMaterial);
            eyeGroup.add(iris);
            irisRef.current = iris;

            // Create a group for all the fibers that will define the color pattern
            const fibersGroup = new THREE.Group();
            eyeGroup.add(fibersGroup);
            fibersGroupRef.current = fibersGroup;

            // Add uniformly distributed fibers with thicker strands
            createUniformFibers(fibersGroup, 1.0, 5.0, 500); // Reduced count, increased thickness

            // Pupil (more natural with depth)
            const pupilGeometry = new THREE.CircleGeometry(1.0, 64);
            const pupilMaterial = new THREE.MeshStandardMaterial({
                color: 0x000000,
                emissive: 0x000000,
                roughness: 0.5,
                metalness: 0.0,
                side: THREE.DoubleSide
            });
            const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
            pupil.position.z = 0.05;
            eyeGroup.add(pupil);
            pupilRef.current = pupil;

            // Add depth to pupil with a gradient ring
            const pupilRingGeometry = new THREE.RingGeometry(0.8, 1.0, 64);
            const pupilRingMaterial = new THREE.MeshStandardMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const pupilRing = new THREE.Mesh(pupilRingGeometry, pupilRingMaterial);
            pupilRing.position.z = 0.04;
            eyeGroup.add(pupilRing);

            // REMOVED: Limbal ring (the darker ring around the iris)

            // Add small precise floating particles
            const particles = createPreciseFloatingParticles(4000, 1.0, 5.0);
            eyeGroup.add(particles);

            // Add subtle reflection highlight on pupil
            const highlightGeometry = new THREE.CircleGeometry(0.2, 32);
            const highlightMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
            highlight.position.set(-0.3, 0.3, 0.06);
            eyeGroup.add(highlight);


            // Outer ring 
            // Create thinner outer sclera glow (more subtle border)
            // const scleraGlowGeometry = new THREE.RingGeometry(5, 5.2, 64);
            // const scleraGlowMaterial = new THREE.MeshStandardMaterial({
            //     color: 0x3399ff,
            //     emissive: 0x006699,
            //     side: THREE.DoubleSide,
            //     transparent: true,
            //     opacity: 0.5
            // });
            // const scleraGlow = new THREE.Mesh(scleraGlowGeometry, scleraGlowMaterial);
            // eyeGroup.add(scleraGlow);
        };

        // Create uniformly distributed fibers to define the color pattern
        const createUniformFibers = (parent, innerRadius, outerRadius, fiberCount = 900) => {
            // Define color bands based on distance from center - using more vibrant colors
            const colorBands = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    color: new THREE.Color(0xff0000), // Pure, saturated red
                    emissive: new THREE.Color(0xcc0000) // Deep red emissive
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    color: new THREE.Color(0x00ff00), // Pure, saturated green
                    emissive: new THREE.Color(0x00cc00) // Deep green emissive
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    color: new THREE.Color(0x00ffff), // Pure, saturated cyan
                    emissive: new THREE.Color(0x00cccc) // Deep cyan emissive
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    color: new THREE.Color(0xff00ff), // Pure, saturated magenta
                    emissive: new THREE.Color(0xcc00cc) // Deep magenta emissive
                }
            ];

            // Total fibers to create
            const totalFibers = fiberCount;
            const angularStep = (Math.PI * 2) / totalFibers;

            // Create the fibers with organic distribution
            for (let i = 0; i < totalFibers; i++) {
                // Calculate angle for perfect distribution
                const angle = i * angularStep;

                // Create points for the fiber with natural waviness
                const curvePoints = [];

                // Start at the pupil edge with slight variation
                const pupilEdgeVariation = 0.05;
                const adjustedInnerRadius = innerRadius * (1 + (Math.random() * pupilEdgeVariation) - pupilEdgeVariation / 2);
                const startX = adjustedInnerRadius * Math.cos(angle);
                const startY = adjustedInnerRadius * Math.sin(angle);

                // Add start point
                curvePoints.push(new THREE.Vector3(startX, startY, 0));

                // Create natural waviness with more segments
                const segments = 12; // Increased for smoother color transitions
                for (let j = 1; j < segments; j++) {
                    const t = j / segments;
                    const radius = innerRadius + (outerRadius - innerRadius) * t;

                    // Waviness increases toward outer edge
                    const waveAmplitude = 0.06 * t;

                    // Natural waviness pattern
                    const waveFrequency = 5 + Math.floor(Math.random() * 3);
                    const wavePhase = angle * waveFrequency + Math.random() * 0.5;
                    const waveOffset = Math.sin(wavePhase + t * Math.PI * 2) * waveAmplitude;

                    // Calculate wave direction perpendicular to radius
                    const perpAngle = angle + Math.PI / 2;
                    const offsetX = waveOffset * Math.cos(perpAngle);
                    const offsetY = waveOffset * Math.sin(perpAngle);

                    // Add natural "imperfections"
                    const imperfectionX = (Math.random() - 0.5) * 0.03 * t;
                    const imperfectionY = (Math.random() - 0.5) * 0.03 * t;

                    // Final position
                    const x = radius * Math.cos(angle) + offsetX + imperfectionX;
                    const y = radius * Math.sin(angle) + offsetY + imperfectionY;

                    // Variable z-depth
                    const z = 0.04 + (Math.random() - 0.5) * 0.02;

                    curvePoints.push(new THREE.Vector3(x, y, z));
                }

                // End at the outer edge with slight variation
                const outerEdgeVariation = 0.03;
                const adjustedOuterRadius = outerRadius * (1 + (Math.random() * outerEdgeVariation) - outerEdgeVariation / 2);
                const endX = adjustedOuterRadius * Math.cos(angle);
                const endY = adjustedOuterRadius * Math.sin(angle);

                // Add end point
                curvePoints.push(new THREE.Vector3(endX, endY, 0.04));

                // Create a smooth curve through the points
                const curve = new THREE.CatmullRomCurve3(curvePoints);

                // Variable fiber thickness - make them thicker for more visibility
                const baseThickness = 0.006 + Math.random() * 0.004;
                const pattern = Math.floor(i % 6);
                let thickness;

                switch (pattern) {
                    case 0:
                        thickness = baseThickness * 1.6;
                        break;
                    case 1:
                        thickness = baseThickness * 0.9;
                        break;
                    case 2:
                        thickness = baseThickness * 1.4;
                        break;
                    case 3:
                        thickness = baseThickness * 1.1;
                        break;
                    default:
                        thickness = baseThickness;
                }

                // Create tube geometry along the curve
                const tubeGeometry = new THREE.TubeGeometry(
                    curve,
                    24, // Increased for smoother color transitions
                    thickness,
                    5, // radial segments
                    false // closed
                );

                // For each segment of the tube, assign a color based on its distance from center
                const positions = tubeGeometry.getAttribute('position');
                const colors = new Float32Array(positions.count * 3);

                // Add color attribute to the geometry - calculate once per segment
                for (let j = 0; j < positions.count; j++) {
                    const x = positions.getX(j);
                    const y = positions.getY(j);

                    // Calculate distance from center
                    const distanceFromCenter = Math.sqrt(x * x + y * y);

                    // Find colors to interpolate between based on distance
                    let color1, color2;
                    let t = 0; // Interpolation factor

                    // Find the band this point is in, or the two bands to blend
                    if (distanceFromCenter <= colorBands[0].startRadius) {
                        // Before the first band (close to pupil), just use the first band color
                        color1 = colorBands[0].color;
                        color2 = colorBands[0].color;
                        t = 0;
                    } else if (distanceFromCenter >= colorBands[colorBands.length - 1].endRadius) {
                        // Beyond the last band, just use the last band color
                        const lastBand = colorBands[colorBands.length - 1];
                        color1 = lastBand.color;
                        color2 = lastBand.color;
                        t = 1;
                    } else {
                        // Find which two bands to blend between
                        for (let k = 0; k < colorBands.length; k++) {
                            const band = colorBands[k];

                            if (distanceFromCenter >= band.startRadius && distanceFromCenter <= band.endRadius) {
                                // Within this band
                                color1 = band.color;

                                // Create transition gradient within the band itself
                                const transitionWidth = band.endRadius - band.startRadius;
                                const positionInBand = distanceFromCenter - band.startRadius;
                                const transitionPoint = transitionWidth * 0.7; // Start transition at 70% of the band

                                if (k < colorBands.length - 1 && positionInBand > transitionPoint) {
                                    // Start blending with next band
                                    color2 = colorBands[k + 1].color;
                                    // Calculate transition factor (0-1) for the last 30% of this band
                                    t = (positionInBand - transitionPoint) / (transitionWidth - transitionPoint);
                                } else {
                                    // No transition yet, stay within current band
                                    color2 = band.color;
                                    t = 0;
                                }
                                break;
                            }

                            // Check if we're in a transition zone between bands
                            if (k < colorBands.length - 1 &&
                                distanceFromCenter > band.endRadius &&
                                distanceFromCenter < colorBands[k + 1].startRadius) {

                                // In transition zone between bands
                                color1 = band.color;
                                color2 = colorBands[k + 1].color;

                                // Calculate transition factor (0-1)
                                const transitionWidth = colorBands[k + 1].startRadius - band.endRadius;
                                t = (distanceFromCenter - band.endRadius) / transitionWidth;
                                break;
                            }
                        }
                    }

                    // Create smooth interpolation between the two colors
                    const finalColor = new THREE.Color().lerpColors(color1, color2, t);

                    // Add some subtle variation to make it more organic
                    const variationAmount = 0.05;
                    const variation = (Math.random() * variationAmount) - (variationAmount / 2);
                    finalColor.offsetHSL(0, variation, variation);

                    // Set the color in the buffer
                    colors[j * 3] = finalColor.r;
                    colors[j * 3 + 1] = finalColor.g;
                    colors[j * 3 + 2] = finalColor.b;
                }

                // Add the color attribute to the geometry
                tubeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                // Create material with vertex colors - CRITICAL FIX - lower emissive intensity
                const material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: 0.3,
                    metalness: 0.6,
                    emissive: 0x888888, // Much lower emissive base to let vertex colors show through
                    emissiveIntensity: 0.4, // Lower intensity allows colors to be more visible
                    transparent: true,
                    opacity: 0.95,
                    side: THREE.DoubleSide
                });

                const tube = new THREE.Mesh(tubeGeometry, material);
                parent.add(tube);

                // Add particles at the ends of threads
                if (Math.random() < 0.4) { // 40% chance for particles at thread ends
                    const particlePosition = curvePoints[curvePoints.length - 1];
                    const distanceFromCenter = Math.sqrt(
                        particlePosition.x * particlePosition.x +
                        particlePosition.y * particlePosition.y
                    );

                    // Find the color band for this distance
                    let particleColor;
                    for (const band of colorBands) {
                        if (distanceFromCenter >= band.startRadius && distanceFromCenter <= band.endRadius) {
                            particleColor = band.color.clone();
                            break;
                        }
                    }

                    if (particleColor) {
                        // Create particle cluster at the end of the fiber
                        const particleCount = 2 + Math.floor(Math.random() * 3);
                        for (let p = 0; p < particleCount; p++) {
                            const particleGeometry = new THREE.SphereGeometry(0.01 + Math.random() * 0.02, 8, 8);
                            const particleMaterial = new THREE.MeshStandardMaterial({
                                color: particleColor,
                                emissive: particleColor,
                                emissiveIntensity: 0.6,
                                roughness: 0.2,
                                metalness: 0.9,
                                transparent: true,
                                opacity: 0.9
                            });

                            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

                            // Position with more spread from the end of the fiber
                            particle.position.set(
                                particlePosition.x + (Math.random() - 0.5) * 0.1,
                                particlePosition.y + (Math.random() - 0.5) * 0.1,
                                particlePosition.z + (Math.random() - 0.5) * 0.05
                            );

                            parent.add(particle);
                        }
                    }
                }
            }
        };

        // Create small precise floating particles with radial color scheme
        const createPreciseFloatingParticles = (count, minRadius, maxRadius) => {
            // Create geometry for particles
            const particlesGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            // Use the same color bands as the fibers for consistency
            const colorBands = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    color: new THREE.Color(0xff3333) // Red
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    color: new THREE.Color(0x55dd55) // Green transition
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    color: new THREE.Color(0x00ddff) // Cyan
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    color: new THREE.Color(0xaa33ff) // Violet
                }
            ];

            // Create particles with organized distribution
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;

                // Distribute particles more uniformly across the eye
                const radiusDistribution = Math.random();
                let radius;

                if (radiusDistribution < 0.2) {
                    // 20% near the pupil
                    radius = minRadius + radiusDistribution * 0.8;
                } else if (radiusDistribution < 0.8) {
                    // 60% in the middle area
                    radius = minRadius + 0.8 + (radiusDistribution - 0.2) * 2.5;
                } else {
                    // 20% near the outer edge
                    radius = minRadius + 3.3 + (radiusDistribution - 0.8) * 1.7;
                }

                // Position
                positions[i * 3] = radius * Math.cos(angle);
                positions[i * 3 + 1] = radius * Math.sin(angle);
                positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

                // Choose color based on radius (distance from center)
                let particleColor;
                for (const band of colorBands) {
                    if (radius >= band.startRadius && radius <= band.endRadius) {
                        particleColor = band.color.clone();
                        break;
                    }
                }

                // If we're exactly on the border, default to the last band
                if (!particleColor) {
                    particleColor = colorBands[colorBands.length - 1].color.clone();
                }

                // 20% chance of white highlight particles
                const useHighlight = Math.random() < 0.2;
                if (useHighlight) {
                    particleColor = new THREE.Color(0xffffff);
                }

                // Apply minimal color variation
                const variation = Math.random() * 0.1 - 0.05;
                particleColor.offsetHSL(0, variation, variation);

                colors[i * 3] = particleColor.r;
                colors[i * 3 + 1] = particleColor.g;
                colors[i * 3 + 2] = particleColor.b;

                // Size - make highlight particles larger for shine effect
                if (useHighlight) {
                    sizes[i] = 0.03 + Math.random() * 0.02;
                } else {
                    sizes[i] = 0.01 + Math.random() * 0.015;
                }
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            // Create custom shader material for better looking particles with stronger shine
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.02,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            return new THREE.Points(particlesGeometry, particlesMaterial);
        };

        // Animation loop
        const animate = () => {
            if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            const delta = clock.current.getDelta();
            const elapsedTime = clock.current.getElapsedTime();

            // Smooth scrolling
            scrollYRef.current += (targetScrollYRef.current - scrollYRef.current) * 0.05;
            setScrollProgress(Math.floor(scrollYRef.current));

            // Camera zoom based on scroll position
            cameraRef.current.position.z = 10 - (scrollYRef.current / 100) * 7;

            // Animate fibers with subtle coordinated movement
            if (fibersGroupRef.current) {
                // Very subtle rotation
                fibersGroupRef.current.rotation.z += 0.0002 * Math.sin(elapsedTime * 0.2);

                // Create a ripple effect through the fibers
                fibersGroupRef.current.children.forEach((fiber, index) => {
                    if (fiber.type === 'Mesh' && fiber.geometry.type === 'TubeGeometry') {
                        // Use the fiber's angle to create a wave pattern
                        const angle = Math.atan2(
                            fiber.geometry.attributes.position.array[1],
                            fiber.geometry.attributes.position.array[0]
                        );

                        // Coordinated pulsing based on angle
                        const pulsePhase = angle * 3 + elapsedTime * 0.5;
                        const pulseScale = 1 + Math.sin(pulsePhase) * 0.03;
                        fiber.scale.set(pulseScale, pulseScale, 1);

                        // Coordinated shimmer effect - CRITICAL FIX - lower emissive intensity
                        if (fiber.material && fiber.material.opacity) {
                            fiber.material.opacity = 0.7 + Math.sin(pulsePhase) * 0.2;
                            fiber.material.emissiveIntensity = 0.3 + Math.sin(pulsePhase) * 0.15; // Lower emissive intensity
                            fiber.material.needsUpdate = true;
                        }
                    }
                });
            }

            // Make pupil expand/contract with a breathing effect
            if (pupilRef.current) {
                const breathingEffect = 1 + Math.sin(elapsedTime * 0.5) * 0.08;
                pupilRef.current.scale.set(breathingEffect, breathingEffect, 1);
            }

            // Animate particles for subtle coordinated floating motion
            if (eyeGroupRef.current) {
                eyeGroupRef.current.children.forEach(child => {
                    if (child instanceof THREE.Points) {
                        // Get the positions attribute
                        const positions = child.geometry.attributes.position;

                        // Loop through each particle
                        for (let i = 0; i < positions.count; i++) {
                            // Get current position
                            const x = positions.getX(i);
                            const y = positions.getY(i);
                            const z = positions.getZ(i);

                            // Calculate distance from center
                            const distance = Math.sqrt(x * x + y * y);

                            // Calculate angle from center
                            const angle = Math.atan2(y, x);

                            // Apply orbital motion in direction of fibers
                            const orbitalSpeed = 0.03 / (distance + 0.1); // Faster near center
                            const newAngle = angle + delta * orbitalSpeed;

                            // Add radial pulsing aligned with fiber movement
                            const pulsePhase = angle * 3 + elapsedTime * 0.5;
                            const pulseAmount = 0.002 * Math.sin(pulsePhase);
                            const newDistance = distance + pulseAmount;

                            // Update position
                            positions.setX(i, Math.cos(newAngle) * newDistance);
                            positions.setY(i, Math.sin(newAngle) * newDistance);
                            positions.setZ(i, z + (Math.sin(elapsedTime * 3 + i) * 0.0005));
                        }

                        // Mark positions for update
                        positions.needsUpdate = true;
                    }
                });
            }

            // Animate the texture overlays
            if (materialRefs.current && materialRefs.current.length > 0) {
                materialRefs.current.forEach(material => {
                    if (material.uniforms && material.uniforms.time) {
                        material.uniforms.time.value = elapsedTime;
                    }
                });
            }

            // Move the main light in a circular pattern
            if (pointLightRef.current) {
                const t = elapsedTime;
                pointLightRef.current.position.x = 5 * Math.sin(t * 0.3);
                pointLightRef.current.position.y = 5 * Math.cos(t * 0.3);

                // Adjust intensity based on zoom level
                const zoomProgress = scrollYRef.current / 100;
                pointLightRef.current.intensity = 2 + zoomProgress * 4;
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestRef.current = requestAnimationFrame(animate);
        };

        // Handling scroll wheel
        const handleWheel = (event) => {
            targetScrollYRef.current += event.deltaY * 0.01;
            // Clamp scroll value between 0 and 100 
            targetScrollYRef.current = Math.max(0, Math.min(100, targetScrollYRef.current));
        };

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        // Initialize with a small delay to ensure container is ready
        const timer = setTimeout(() => {
            if (containerRef.current) {
                initScene();
            }
        }, 100);

        // Add event listeners
        window.addEventListener('wheel', handleWheel);
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            clearTimeout(timer);

            if (containerRef.current && rendererRef.current && rendererRef.current.domElement) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }

            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);

            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }

            // Dispose all geometries and materials
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                background: '#000000',
                ...style
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '20px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    fontFamily: 'Arial, sans-serif',
                    zIndex: 100,
                    pointerEvents: 'none'
                }}
            >
                Zoom: {scrollProgress}%
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    color: 'white',
                    fontFamily: 'Arial, sans-serif',
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '10px',
                    borderRadius: '4px',
                    zIndex: 100
                }}
            >
                Scroll to zoom into the eye
            </div>
        </div>
    );
};

export default EyeVisualization;