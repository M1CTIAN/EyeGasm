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

        // Create realistic eye with detailed iris fibers and filled color areas
        const createRealisticEye = () => {
            const eyeGroup = new THREE.Group();
            sceneRef.current.add(eyeGroup);
            eyeGroupRef.current = eyeGroup;

            // Base iris disc - darker base
            const irisGeometry = new THREE.CircleGeometry(5, 64);
            const irisMaterial = new THREE.MeshStandardMaterial({
                color: 0x090909,
                side: THREE.DoubleSide,
                roughness: 0.8,
                metalness: 0.2,
                emissive: 0x000000,
                emissiveIntensity: 0.0
            });
            const iris = new THREE.Mesh(irisGeometry, irisMaterial);
            eyeGroup.add(iris);
            irisRef.current = iris;

            // Add filled color zones first
            createColorZones(eyeGroup);

            // Create a group for all the fibers that will overlay the color zones
            const fibersGroup = new THREE.Group();
            eyeGroup.add(fibersGroup);
            fibersGroupRef.current = fibersGroup;

            // Add uniformly distributed fibers
            createUniformFibers(fibersGroup, 1.0, 5.0);

            // Rest of the eye components (pupil, particles, etc)
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

            // Add limbal ring (the darker ring around the iris that makes it look more natural)
            const limbalRingGeometry = new THREE.RingGeometry(4.8, 5.0, 64);
            const limbalRingMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a0e03,
                emissive: 0x080401,
                emissiveIntensity: 0.1,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const limbalRing = new THREE.Mesh(limbalRingGeometry, limbalRingMaterial);
            limbalRing.position.z = 0.06;
            eyeGroup.add(limbalRing);

            // Add small precise floating particles
            const particles = createPreciseFloatingParticles(3000, 1.0, 5.0);
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

            // Create thinner outer sclera glow (more subtle border)
            const scleraGlowGeometry = new THREE.RingGeometry(5, 5.2, 64);
            const scleraGlowMaterial = new THREE.MeshStandardMaterial({
                color: 0x3399ff,
                emissive: 0x006699,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            const scleraGlow = new THREE.Mesh(scleraGlowGeometry, scleraGlowMaterial);
            eyeGroup.add(scleraGlow);

            // Create glowing rings that highlight the color bands
            createColorBandHighlights(eyeGroup);
        };

        // Create filled color zones in the iris
        const createColorZones = (parent) => {
            // Define the color zones with their radii - added green transition zone
            const colorZones = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    color: 0xff3333, // Red
                    emissive: 0xcc1100,
                    emissiveIntensity: 0.7
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    color: 0x55dd55, // Green transition zone
                    emissive: 0x33aa33,
                    emissiveIntensity: 0.65
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    color: 0x00ddff, // Cyan
                    emissive: 0x0099cc,
                    emissiveIntensity: 0.6
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    color: 0xaa33ff, // Violet
                    emissive: 0x6600dd,
                    emissiveIntensity: 0.5
                }
            ];

            // Create filled ring meshes for each zone
            colorZones.forEach(zone => {
                const ringGeometry = new THREE.RingGeometry(zone.startRadius, zone.endRadius, 128, 8);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    color: zone.color,
                    emissive: zone.emissive,
                    emissiveIntensity: zone.emissiveIntensity,
                    transparent: true,
                    opacity: 0.85,
                    side: THREE.DoubleSide,
                    roughness: 0.4,
                    metalness: 0.6
                });

                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                // Place slightly above the base to ensure visibility
                ring.position.z = 0.01;
                parent.add(ring);

                // Add glowing overlay for more luminosity
                const glowGeometry = new THREE.RingGeometry(zone.startRadius, zone.endRadius, 128, 1);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: zone.color,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                });

                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.position.z = 0.02;
                parent.add(glow);

                // Add texture overlay to break up the solid color look
                addTexturedOverlay(parent, zone);
            });
        };

        // Add textured overlay to make the solid colors more interesting
        const addTexturedOverlay = (parent, zone) => {
            // Create a procedural texture using ShaderMaterial
            const segments = 64;
            const rings = 8;
            const geometry = new THREE.RingGeometry(zone.startRadius, zone.endRadius, segments, rings);

            // Create a custom material with noise pattern and gradient transition
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(zone.color) },
                    emissiveColor: { value: new THREE.Color(zone.emissive) },
                    time: { value: 0 },
                    radius: { value: zone.startRadius },
                    thickness: { value: zone.endRadius - zone.startRadius },
                    transitionStart: { value: 0.7 }, // Start transition at 70% of the band
                    nextColor: { value: getNextZoneColor(zone) }, // Get next zone color for transition
                    nextEmissive: { value: getNextZoneEmissive(zone) } // Get next zone emissive for transition
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying float vRadius;
                    
                    void main() {
                        vUv = uv;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        vRadius = length(position.xy);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform vec3 emissiveColor;
                    uniform vec3 nextColor;
                    uniform vec3 nextEmissive;
                    uniform float time;
                    uniform float radius;
                    uniform float thickness;
                    uniform float transitionStart;
                    
                    varying vec2 vUv;
                    varying float vRadius;
                    
                    // Simple noise function
                    float noise(vec2 p) {
                        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                    }
                    
                    void main() {
                        // Calculate normalized radius (0-1 across the ring)
                        float normRadius = (vRadius - radius) / thickness;
                        
                        // Create texture variation
                        vec2 pos = vec2(vUv.x * 20.0, vUv.y * 20.0);
                        float n = noise(pos + time * 0.05);
                        
                        // Layer multiple noise frequencies
                        float n2 = noise(pos * 2.0 + time * 0.1) * 0.5;
                        float n3 = noise(pos * 4.0 + time * 0.2) * 0.25;
                        
                        float noiseVal = n + n2 + n3;
                        
                        // Gradient transition
                        vec3 baseColor = color;
                        vec3 baseEmissive = emissiveColor;
                        
                        if (normRadius > transitionStart) {
                            // Calculate transition factor
                            float t = (normRadius - transitionStart) / (1.0 - transitionStart);
                            
                            // Smooth step for smoother blend
                            t = smoothstep(0.0, 1.0, t);
                            
                            // Interpolate color
                            baseColor = mix(color, nextColor, t);
                            baseEmissive = mix(emissiveColor, nextEmissive, t);
                        }
                        
                        // Apply noise variation to color
                        vec3 finalColor = baseColor * (0.9 + 0.2 * noiseVal);
                        vec3 finalEmissive = baseEmissive * (0.9 + 0.2 * noiseVal);
                        
                        // Emission and opacity based on noise
                        float alpha = smoothstep(0.1, 0.9, noiseVal) * 0.35;
                        
                        // Add pulsing over time
                        alpha *= (0.8 + 0.2 * sin(time * 0.5 + vRadius * 5.0));
                        
                        gl_FragColor = vec4(finalColor, alpha);
                        
                        // Add emission for glow effect (would be used if we had custom blending)
                        // This doesn't actually work without a custom fragment output, but conceptually shows emission
                        // gl_FragColor += vec4(finalEmissive * alpha * 0.5, 0.0);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });

            const overlay = new THREE.Mesh(geometry, material);
            overlay.position.z = 0.03;
            parent.add(overlay);

            // Store the material so we can update it in the animation loop
            if (!materialRefs.current) materialRefs.current = [];
            materialRefs.current.push(material);
        };

        // Helper function to get the next zone's color for transitions
        const getNextZoneColor = (currentZone) => {
            const colorZones = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    color: 0xff3333 // Red
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    color: 0x55dd55 // Green
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    color: 0x00ddff // Cyan
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    color: 0xaa33ff // Violet
                }
            ];

            for (let i = 0; i < colorZones.length - 1; i++) {
                if (Math.abs(colorZones[i].startRadius - currentZone.startRadius) < 0.01 &&
                    Math.abs(colorZones[i].endRadius - currentZone.endRadius) < 0.01) {
                    return new THREE.Color(colorZones[i + 1].color);
                }
            }

            // Return the same color if no next zone (last zone)
            return new THREE.Color(currentZone.color);
        };

        // Helper function to get the next zone's emissive for transitions
        const getNextZoneEmissive = (currentZone) => {
            const colorZones = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    emissive: 0xcc1100 // Red
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    emissive: 0x33aa33 // Green
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    emissive: 0x0099cc // Cyan
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    emissive: 0x6600dd // Violet
                }
            ];

            for (let i = 0; i < colorZones.length - 1; i++) {
                if (Math.abs(colorZones[i].startRadius - currentZone.startRadius) < 0.01 &&
                    Math.abs(colorZones[i].endRadius - currentZone.endRadius) < 0.01) {
                    return new THREE.Color(colorZones[i + 1].emissive);
                }
            }

            // Return the same emissive if no next zone (last zone)
            return new THREE.Color(currentZone.emissive);
        };

        // Create uniformly distributed fibers to overlay the color zones
        const createUniformFibers = (parent, innerRadius, outerRadius) => {
            // Define color bands based on distance from center
            const colorBands = [
                {
                    startRadius: 1.0,
                    endRadius: 1.7,
                    color: new THREE.Color(0xff5555), // Red
                    emissive: new THREE.Color(0xdd2200)
                },
                {
                    startRadius: 1.7,
                    endRadius: 2.3,
                    color: new THREE.Color(0x77ff77), // Green
                    emissive: new THREE.Color(0x44cc44)
                },
                {
                    startRadius: 2.3,
                    endRadius: 3.3,
                    color: new THREE.Color(0x55eeff), // Cyan  
                    emissive: new THREE.Color(0x00aadd)
                },
                {
                    startRadius: 3.3,
                    endRadius: 5.0,
                    color: new THREE.Color(0xbb55ff), // Violet
                    emissive: new THREE.Color(0x7711ee)
                }
            ];

            // Total fibers to create
            const totalFibers = 900;
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

                // Variable fiber thickness - make them thinner since they're just accents now
                const thickness = 0.003 + 0.005 * Math.sin(Math.PI * 0.5 * (i % 4) / 4);

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

                // Add color attribute to the geometry
                for (let j = 0; j < positions.count; j++) {
                    const x = positions.getX(j);
                    const y = positions.getY(j);

                    // Calculate distance from center
                    const distanceFromCenter = Math.sqrt(x * x + y * y);

                    // Find colors to interpolate between based on distance
                    let color1, color2, emissive1, emissive2;
                    let t = 0; // Interpolation factor

                    // Find the band this point is in, or the two bands to blend
                    if (distanceFromCenter <= colorBands[0].startRadius) {
                        // Before the first band (close to pupil), just use the first band color
                        color1 = colorBands[0].color;
                        color2 = colorBands[0].color;
                        emissive1 = colorBands[0].emissive;
                        emissive2 = colorBands[0].emissive;
                        t = 0;
                    } else if (distanceFromCenter >= colorBands[colorBands.length - 1].endRadius) {
                        // Beyond the last band, just use the last band color
                        const lastBand = colorBands[colorBands.length - 1];
                        color1 = lastBand.color;
                        color2 = lastBand.color;
                        emissive1 = lastBand.emissive;
                        emissive2 = lastBand.emissive;
                        t = 1;
                    } else {
                        // Find which two bands to blend between
                        for (let k = 0; k < colorBands.length; k++) {
                            const band = colorBands[k];

                            if (distanceFromCenter >= band.startRadius && distanceFromCenter <= band.endRadius) {
                                // Within this band
                                color1 = band.color;
                                emissive1 = band.emissive;

                                // Create transition gradient within the band itself
                                const transitionWidth = band.endRadius - band.startRadius;
                                const positionInBand = distanceFromCenter - band.startRadius;
                                const transitionPoint = transitionWidth * 0.7; // Start transition at 70% of the band

                                if (k < colorBands.length - 1 && positionInBand > transitionPoint) {
                                    // Start blending with next band
                                    color2 = colorBands[k + 1].color;
                                    emissive2 = colorBands[k + 1].emissive;
                                    // Calculate transition factor (0-1) for the last 30% of this band
                                    t = (positionInBand - transitionPoint) / (transitionWidth - transitionPoint);
                                } else {
                                    // No transition yet, stay within current band
                                    color2 = band.color;
                                    emissive2 = band.emissive;
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
                                emissive1 = band.emissive;
                                emissive2 = colorBands[k + 1].emissive;

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

                // Create material with vertex colors
                const material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: 0.3,
                    metalness: 0.7,
                    emissive: 0xffffff, // Modulated by vertex colors
                    emissiveIntensity: 0.7,
                    transparent: true,
                    opacity: 0.9
                });

                const tube = new THREE.Mesh(tubeGeometry, material);
                parent.add(tube);

                // Rest of your code for particles remains the same...
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

        // Create glowing rings that highlight the color bands
        const createColorBandHighlights = (eyeGroup) => {
            // Highlight rings at color transition boundaries
            const boundaries = [1.7, 2.3, 3.3]; // Where the color bands change

            // Red to Green boundary
            const redGreenGeometry = new THREE.RingGeometry(1.68, 1.72, 64);
            const redGreenMaterial = new THREE.MeshStandardMaterial({
                color: 0xffcc66,
                emissive: 0xff9933,
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const redGreenRing = new THREE.Mesh(redGreenGeometry, redGreenMaterial);
            redGreenRing.position.z = 0.02;
            eyeGroup.add(redGreenRing);

            // Green to Cyan boundary
            const greenCyanGeometry = new THREE.RingGeometry(2.28, 2.32, 64);
            const greenCyanMaterial = new THREE.MeshStandardMaterial({
                color: 0x66ffcc,
                emissive: 0x33ccaa,
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const greenCyanRing = new THREE.Mesh(greenCyanGeometry, greenCyanMaterial);
            greenCyanRing.position.z = 0.02;
            eyeGroup.add(greenCyanRing);

            // Cyan to Violet boundary
            const cyanVioletGeometry = new THREE.RingGeometry(3.28, 3.32, 64);
            const cyanVioletMaterial = new THREE.MeshStandardMaterial({
                color: 0x77bbff,
                emissive: 0x3366ff,
                emissiveIntensity: 7,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const cyanVioletRing = new THREE.Mesh(cyanVioletGeometry, cyanVioletMaterial);
            cyanVioletRing.position.z = 0.02;
            eyeGroup.add(cyanVioletRing);
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

                        // Coordinated shimmer effect
                        if (fiber.material && fiber.material.opacity) {
                            fiber.material.opacity = 0.7 + Math.sin(pulsePhase) * 0.2;
                            fiber.material.emissiveIntensity = 0.5 + Math.sin(pulsePhase) * 0.3;
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