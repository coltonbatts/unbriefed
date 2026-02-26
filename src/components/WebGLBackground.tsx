'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // WebGL Ambient Background (Particles & Minimal Wireframe)
        const container = mountRef.current;
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.001);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 1000;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Clear the container to prevent multiple canvases on strict mode re-renders
        if (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);

        // Gothic Dust Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color(0xff2a55); // Crimson
        const color2 = new THREE.Color(0x222222); // Dark slate
        const color3 = new THREE.Color(0x888888); // Grey spark

        for (let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 4000;
            posArray[i + 1] = (Math.random() - 0.5) * 4000;
            posArray[i + 2] = (Math.random() - 0.5) * 2000;

            const rand = Math.random();
            const mixedColor = rand < 0.1 ? color1 : (rand < 0.3 ? color3 : color2);

            colorArray[i] = mixedColor.r;
            colorArray[i + 1] = mixedColor.g;
            colorArray[i + 2] = mixedColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        // Create round sprite
        const canvas = document.createElement('canvas');
        canvas.width = 16; canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 16, 16);
        }
        const texture = new THREE.CanvasTexture(canvas);

        const particlesMaterial = new THREE.PointsMaterial({
            size: 10,
            map: texture,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Abstract Wireframe Monolith
        const geoGroup = new THREE.Group();
        const boxGeo = new THREE.BoxGeometry(400, 3000, 400);
        const edgesGeo = new THREE.EdgesGeometry(boxGeo);
        const mat = new THREE.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.2 });

        for (let i = 0; i < 4; i++) {
            const mesh = new THREE.LineSegments(edgesGeo, mat);
            mesh.rotation.y = (Math.PI / 4) * i;
            geoGroup.add(mesh);
        }
        scene.add(geoGroup);

        // Parallax Mouse Interaction for Background
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
        };
        document.addEventListener('mousemove', handleMouseMove);

        // Scroll listener to move particles up/down
        let scrollY = 0;
        const handleScroll = () => {
            scrollY = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation Loop
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Subtle rotation
            particlesMesh.rotation.y -= 0.0002;
            geoGroup.rotation.y += 0.0005;

            // Parallax shift based on mouse & scroll
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - (scrollY * 0.5) - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            boxGeo.dispose();
            edgesGeo.dispose();
            mat.dispose();
            texture.dispose();
        };
    }, []);

    return <div id="webgl-container" ref={mountRef} />;
}
