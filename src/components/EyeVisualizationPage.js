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

    // Pre-create a pool of particles and reuse them
    const particlePool = [];
    const POOL_SIZE = 5000;

    const initParticlePool = () => {
        for (let i = 0; i < POOL_SIZE; i++) {
            const particle = createParticle();
            particle.visible = false;
            particlePool.push(particle);
            scene.add(particle);
        }
    };

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

            // Enhanced realistic pupil with depth layers
            const createCosmicPupil = () => {
                const pupilGroup = new THREE.Group();
                
                // Base pupil - black hole effect
                const pupilGeometry = new THREE.CircleGeometry(1.0, 64);
                const pupilMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    emissive: 0x000505,
                    roughness: 0.1,
                    metalness: 0.9,
                    side: THREE.DoubleSide
                });
                const basePupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
                basePupil.position.z = 0.05;
                pupilGroup.add(basePupil);
                
                // Create vortex effect with spiraling rings
                const vortexRingsCount = 10;
                const vortexRings = [];
                
                for (let i = 0; i < vortexRingsCount; i++) {
                    // Calculate ring properties based on index
                    const ringRadius = 0.7 - (i * 0.07);
                    const segments = 64;
                    const ringGeometry = new THREE.RingGeometry(ringRadius * 0.85, ringRadius, segments);
                    
                    // Create subtle glow effect with custom shader material
                    const ringMaterial = new THREE.MeshStandardMaterial({
                        color: 0x000000,
                        emissive: new THREE.Color(0x000033).multiplyScalar(0.2 + i * 0.15),
                        transparent: true,
                        opacity: 0.7 - (i * 0.08),
                        side: THREE.DoubleSide,
                        roughness: 0.3,
                        metalness: 0.8
                    });
                    
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.z = i * (Math.PI / vortexRingsCount);
                    ring.position.z = 0.06 + (i * 0.012);
                    ring.userData = {
                        isVortexRing: true,
                        ringIndex: i,
                        rotationSpeed: 0.004 - (i * 0.0005),
                        pulseFrequency: 0.3 + (i * 0.1)
                    };
                    
                    pupilGroup.add(ring);
                    vortexRings.push(ring);
                }
                
      
              
                
                // Add particles floating above the pupil for cosmic dust effect
                const particlesCount = 120;
                const particlesGeometry = new THREE.BufferGeometry();
                const particlesPositions = new Float32Array(particlesCount * 3);
                const particlesSizes = new Float32Array(particlesCount);
                
                for (let i = 0; i < particlesCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 0.2 + Math.random() * 0.7; // Concentrate in pupil area
                    
                    particlesPositions[i * 3] = radius * Math.cos(angle);
                    particlesPositions[i * 3 + 1] = radius * Math.sin(angle);
                    particlesPositions[i * 3 + 2] = 0.15 + Math.random() * 0.1;
                    
                    particlesSizes[i] = 0.006 + Math.random() * 0.01;
                }
                
                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
                particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particlesSizes, 1));
                
                const particlesMaterial = new THREE.PointsMaterial({
                    color: 0x3366ff,
                    size: 0.01,
                    transparent: true,
                    opacity: 0.6,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    sizeAttenuation: true
                });
                
                const particles = new THREE.Points(particlesGeometry, particlesMaterial);
                particles.userData = { isCosmicParticles: true };
                pupilGroup.add(particles);
                
                // Central energy source/event horizon
                const coreGeometry = new THREE.CircleGeometry(0.4, 32);
                const coreMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    emissive: 0x000033,
                    emissiveIntensity: 0.5,
                    roughness: 0.1,
                    metalness: 1.0,
                    side: THREE.DoubleSide
                });
                
                const core = new THREE.Mesh(coreGeometry, coreMaterial);
                core.position.z = 0.14;
                core.userData = { isCore: true };
                pupilGroup.add(core);
                
                // Add subtle highlight rim
                const rimGeometry = new THREE.RingGeometry(0.38, 0.4, 32);
                const rimMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0055ff,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                });
                
                const rim = new THREE.Mesh(rimGeometry, rimMaterial);
                rim.position.z = 0.15;
                rim.userData = { isRim: true };
                pupilGroup.add(rim);
                
                eyeGroup.add(pupilGroup);
                pupilRef.current = pupilGroup;
            };

            // Call the new function instead of creating a basic pupil
            createCosmicPupil();

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

        };

        // Create uniformly distributed fibers to define the color pattern
        const createUniformFibers = (parent, innerRadius, outerRadius, fiberCount) => {
            // Determine detail level based on current zoom
            const zoomProgress = scrollYRef.current / 100;
            const detailLevel = zoomProgress > 0.7 ? 'high' : (zoomProgress > 0.3 ? 'medium' : 'low');
            
            // Adjust count based on detail level
            const actualFiberCount = detailLevel === 'high' ? fiberCount : 
                                   detailLevel === 'medium' ? Math.floor(fiberCount * 0.6) : 
                                   Math.floor(fiberCount * 0.4);
            
            // Continue with fiber creation using actualFiberCount...

            // Define color bands with more vivid colors and smoother transitions
            const colorBands = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    color: new THREE.Color(0xff2200), // Vibrant orange-red
                    emissive: new THREE.Color(0xbb1100) 
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    color: new THREE.Color(0x00ff88), // Bright teal-green
                    emissive: new THREE.Color(0x00bb66) 
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    color: new THREE.Color(0x00ccff), // Bright sky blue
                    emissive: new THREE.Color(0x0099cc) 
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    color: new THREE.Color(0xbb00ff), // Rich purple
                    emissive: new THREE.Color(0x8800cc) 
                }
            ];

            // Total fibers to create
            const totalFibers = actualFiberCount;
            const angularStep = (Math.PI * 2) / totalFibers;

            // Create the fibers with organic distribution
            for (let i = 0; i < totalFibers; i++) {
                // Calculate angle for perfect distribution
                const angle = i * angularStep;

                // Create points for the fiber with enhanced natural waviness
                const curvePoints = [];

                // Start at the pupil edge with slight variation
                const pupilEdgeVariation = 0.05;
                const adjustedInnerRadius = innerRadius * (1 + (Math.random() * pupilEdgeVariation) - pupilEdgeVariation / 2);
                const startX = adjustedInnerRadius * Math.cos(angle);
                const startY = adjustedInnerRadius * Math.sin(angle);

                // Add start point
                curvePoints.push(new THREE.Vector3(startX, startY, 0));

                // Create natural waviness with more segments for smoother, more detailed fibers
                const segments = 16; // Increased from 12 for finer detail
                for (let j = 1; j < segments; j++) {
                    const t = j / segments;
                    const radius = innerRadius + (outerRadius - innerRadius) * t;

                    // Enhanced waviness with more organic patterns
                    const waveAmplitude = 0.08 * t * (0.8 + Math.random() * 0.4); // More varied amplitude
                    
                    // Multi-layered waviness for more organic look
                    const primaryWave = Math.sin(angle * 5 + t * Math.PI * 2) * waveAmplitude;
                    const secondaryWave = Math.sin(angle * 12 + t * Math.PI * 3) * waveAmplitude * 0.3;
                    const waveOffset = primaryWave + secondaryWave;

                    // Calculate wave direction perpendicular to radius
                    const perpAngle = angle + Math.PI / 2;
                    const offsetX = waveOffset * Math.cos(perpAngle);
                    const offsetY = waveOffset * Math.sin(perpAngle);

                    // Add natural "imperfections" that increase toward outer edges
                    const imperfectionScale = t * t * 0.05;
                    const imperfectionX = (Math.random() - 0.5) * imperfectionScale;
                    const imperfectionY = (Math.random() - 0.5) * imperfectionScale;

                    // Final position
                    const x = radius * Math.cos(angle) + offsetX + imperfectionX;
                    const y = radius * Math.sin(angle) + offsetY + imperfectionY;

                    // Variable z-depth for more 3D effect
                    const z = 0.04 + Math.sin(angle * 8 + t * Math.PI) * 0.02;

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

                // Variable fiber thickness with more interesting patterns
                const thicknessBase = 0.005 + Math.random() * 0.003;
                let thickness;

                // Create different thickness patterns
                const patternType = Math.floor(Math.random() * 5);
                switch (patternType) {
                    case 0: // Gradually thickening fibers
                        thickness = thicknessBase * (1.2 + Math.sin(angle * 3) * 0.4) * 1.6;
                        break;
                    case 1: // Thin delicate fibers
                        thickness = thicknessBase * 0.8;
                        break;
                    case 2: // Extra thick prominent fibers
                        thickness = thicknessBase * 2.0;
                        break;
                    case 3: // Medium thickness with variation
                        thickness = thicknessBase * (1.4 + Math.sin(angle * 7) * 0.3);
                        break;
                    case 4: // Standard with slight randomness
                        thickness = thicknessBase * (1.0 + Math.random() * 0.5);
                        break;
                }

                // Create tube geometry with enhanced detail
                const tubeGeometry = new THREE.TubeGeometry(
                    curve,
                    28, // Increased segments for smoother tubes
                    thickness,
                    6, // More radial segments for better highlights
                    false
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

                // Create material with vertex colors and enhanced properties
                const material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: 0.2,  // Lower roughness for more shine
                    metalness: 0.7,  // Higher metalness for better reflections
                    emissive: 0x333333,
                    emissiveIntensity: 0.25,
                    transparent: true,
                    opacity: 0.95,
                    side: THREE.DoubleSide,
                    envMapIntensity: 1.5, // Enhances reflections
                    clearcoat: 0.3 + Math.random() * 0.4, // Add clearcoat for wet look
                    clearcoatRoughness: 0.2
                });

                // Add unique material properties to each fiber
                material.userData = {
                    baseEmissiveIntensity: 0.25 + Math.random() * 0.15,
                    pulseFactor: 0.8 + Math.random() * 0.4
                };

                materialRefs.current.push(material); // Add to material references

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

            // For particles, use instanced mesh instead of individual meshes
            const particleGeometry = new THREE.SphereGeometry(0.02, 6, 4);
            const particleMaterial = new THREE.MeshStandardMaterial({
                vertexColors: true,
                roughness: 0.3,
                metalness: 0.6,
                emissive: 0x888888,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.95,
                side: THREE.DoubleSide
            });
            const particleInstances = new THREE.InstancedMesh(particleGeometry, particleMaterial, count);

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
                        // Get position data for more natural movement
                        const posArray = fiber.geometry.attributes.position.array;
                        const x = posArray[0];
                        const y = posArray[1];
                        
                        // Calculate angle and distance for movement patterns
                        const angle = Math.atan2(y, x);
                        const distance = Math.sqrt(x*x + y*y);
                        
                        // Create multiple overlapping wave patterns
                        const primaryPhase = angle * 3 + elapsedTime * 0.5;
                        const secondaryPhase = angle * 5 - elapsedTime * 0.3;
                        const tertiaryPhase = distance * 0.8 + elapsedTime * 0.7;
                        
                        // Combine waves for complex pulsing pattern
                        const pulseScale = 1 + 
                            Math.sin(primaryPhase) * 0.02 + 
                            Math.sin(secondaryPhase) * 0.01 +
                            Math.sin(tertiaryPhase) * 0.005;
                            
                        fiber.scale.set(pulseScale, pulseScale, 1);

                        // Enhanced shimmer effect with material properties
                        if (fiber.material) {
                            const userData = fiber.material.userData || {};
                            const baseEmissive = userData.baseEmissiveIntensity || 0.25;
                            const pulseFactor = userData.pulseFactor || 1.0;
                            
                            // Create varied shimmer effect
                            const shimmerEffect = 0.15 * Math.sin(primaryPhase * pulseFactor);
                            
                            // Apply enhanced visual effects
                            fiber.material.opacity = 0.8 + Math.sin(primaryPhase) * 0.15;
                            fiber.material.emissiveIntensity = baseEmissive + shimmerEffect;
                            
                            // Subtle color shift for iridescent effect
                            const hueShift = Math.sin(tertiaryPhase) * 0.02;
                            fiber.material.emissive.offsetHSL(hueShift, 0, 0);
                            
                            fiber.material.needsUpdate = true;
                        }
                    }
                });
            }

            // Cosmic pupil animation
            if (pupilRef.current) {
                const breathingBase = Math.sin(elapsedTime * 0.5) * 0.08;
                const breathingEffect = 1 + breathingBase;
                
                // Subtle pulsing scale for the entire pupil
                pupilRef.current.scale.set(breathingEffect, breathingEffect, 1);
                
                // Animate each element based on its type
                pupilRef.current.children.forEach(element => {
                    if (!element.userData) return;
                    
                    // Vortex rings animation - rotation and pulse
                    if (element.userData.isVortexRing) {
                        const { ringIndex, rotationSpeed, pulseFrequency } = element.userData;
                        
                        // Rotate the rings to create vortex illusion
                        element.rotation.z += rotationSpeed;
                        
                        // Pulsing opacity effect
                        if (element.material) {
                            const opacityPulse = Math.sin(elapsedTime * pulseFrequency + ringIndex) * 0.1;
                            element.material.opacity = 0.7 - (ringIndex * 0.08) + opacityPulse;
                            
                            // Subtle emissive color changes
                            const emissiveIntensity = 0.2 + ringIndex * 0.15 + 
                                Math.sin(elapsedTime * 0.3 + ringIndex) * 0.1;
                            element.material.emissiveIntensity = emissiveIntensity;
                            element.material.needsUpdate = true;
                        }
                    }
                    
                    // Energy tendrils animation
                    if (element.userData.isTendril) {
                        const { tendrilIndex, rotationSpeed, pulseFrequency } = element.userData;
                        
                        // Subtle rotation around center
                        element.rotation.z += rotationSpeed * Math.sin(elapsedTime * 0.2);
                        
                        // Scale pulsing
                        const scalePulse = 1 + Math.sin(elapsedTime * pulseFrequency) * 0.08;
                        element.scale.set(scalePulse, scalePulse, 1);
                        
                        // Emissive intensity pulsing
                        if (element.material) {
                            const emissivePulse = 0.5 + Math.sin(elapsedTime * 0.7 + tendrilIndex * 0.2) * 0.3;
                            element.material.emissiveIntensity = emissivePulse;
                            element.material.needsUpdate = true;
                        }
                    }
                    
                    // Cosmic particles swirling animation
                    if (element.userData.isCosmicParticles && element.geometry) {
                        const positions = element.geometry.attributes.position.array;
                        
                        for (let i = 0; i < positions.length / 3; i++) {
                            const x = positions[i * 3];
                            const y = positions[i * 3 + 1];
                            const z = positions[i * 3 + 2];
                            
                            // Calculate current radius and angle
                            const radius = Math.sqrt(x*x + y*y);
                            let angle = Math.atan2(y, x);
                            
                            // Add orbital motion - faster near center
                            const orbitalSpeed = 0.05 / (radius + 0.2);
                            angle += delta * orbitalSpeed;
                            
                            // Vertical oscillation
                            const newZ = z + Math.sin(elapsedTime * 2 + i * 0.2) * 0.001;
                            
                            // Update position
                            positions[i * 3] = radius * Math.cos(angle);
                            positions[i * 3 + 1] = radius * Math.sin(angle);
                            positions[i * 3 + 2] = newZ;
                        }
                        
                        element.geometry.attributes.position.needsUpdate = true;
                    }
                    
                    // Central core/event horizon animation
                    if (element.userData.isCore && element.material) {
                        // Pulsing emissive intensity
                        const coreIntensity = 0.5 + Math.sin(elapsedTime * 0.8) * 0.3;
                        element.material.emissiveIntensity = coreIntensity;
                        
                        // Subtle scale pulsing
                        const coreScale = 1 + Math.sin(elapsedTime * 0.4) * 0.05;
                        element.scale.set(coreScale, coreScale, 1);
                        
                        element.material.needsUpdate = true;
                    }
                    
                    // Rim highlight animation
                    if (element.userData.isRim && element.material) {
                        // Smoother pulsing opacity with reduced amplitude
                        const rimOpacity = 0.45 + Math.sin(elapsedTime * 0.6) * 0.15;
                        element.material.opacity = rimOpacity;
                        
                        // Much slower color transitions with reduced frequencies
                        const r = 0.5 + 0.4 * Math.sin(elapsedTime * 0.08);
                        const g = 0.5 + 0.4 * Math.sin(elapsedTime * 0.08 + Math.PI * 0.6);
                        const b = 0.5 + 0.4 * Math.sin(elapsedTime * 0.08 + Math.PI * 1.2);
                        
                        // More consistent blue base for less dramatic shifts
                        const blueBase = 0.5;
                        element.material.color.setRGB(
                            r * 0.5, 
                            g * 0.5 + blueBase * 0.3,
                            b * 0.5 + blueBase
                        );
                        
                        // Gentler emissive color changes with reduced variation
                        if (element.material.emissive) {
                            element.material.emissive.setRGB(
                                r * 0.25,
                                g * 0.25 + blueBase * 0.2, 
                                b * 0.25 + blueBase * 0.7
                            );
                            
                            // Smoother emissive intensity with lower frequency and amplitude
                            element.material.emissiveIntensity = 0.7 + Math.sin(elapsedTime * 0.4) * 0.15;
                        }
                        
                        element.material.needsUpdate = true;
                    }
                });
            }

            // Dynamic depth effects on pupil layers
            if (pupilRef.current) {
                let layerIndex = 0;
                pupilRef.current.children.forEach(layer => {
                    if (layer.geometry) {
                        // Skip highlights
                        if (layer.material.opacity > 0.5) {
                            // Subtle pulsing z-position for depth effect
                            const depthPulse = Math.sin(elapsedTime * 0.7 + layerIndex * 0.3) * 0.01;
                            layer.position.z = layer.position.z * 0.95 + (0.05 + layerIndex * 0.01 + depthPulse) * 0.05;
                            
                            // Subtle opacity changes
                            if (layer.material.transparent) {
                                const opacityBase = 0.7 + (layerIndex * 0.05);
                                const opacityVariation = Math.sin(elapsedTime * 0.4 + layerIndex * 0.5) * 0.07;
                                layer.material.opacity = opacityBase + opacityVariation;
                                layer.material.needsUpdate = true;
                            }
                            
                            layerIndex++;
                        }
                    }
                });
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

            // Only update visible objects
            const updateFibers = () => {
                // Only update fibers that are in view
                const visibleFibers = fibersGroupRef.current.children.filter(
                    fiber => {
                        // Simple frustum culling check
                        const distance = fiber.position.distanceTo(cameraRef.current.position);
                        return distance < 15; // Only process fibers within certain distance
                    }
                );
                
                // Reduce update frequency for distant objects
                visibleFibers.forEach((fiber, index) => {
                    // Only update every other frame for optimization
                    if (index % 2 === frameCount % 2) {
                        // Your fiber animation code here
                    }
                });
            };

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            requestRef.current = requestAnimationFrame(animate);
        };

        // Group similar operations
        const updateAllMaterials = () => {
            // Update all material properties at once instead of in different loops
            materialRefs.current.forEach(material => {
                // Batch updates
                material.needsUpdate = true;
            });
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