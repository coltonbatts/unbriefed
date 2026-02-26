'use client';

import { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import BoardGrid from '@/components/BoardGrid';

// Dynamically import Three.js background since it needs the window object
const WebGLBackground = dynamic(() => import('@/components/WebGLBackground'), { ssr: false });

export default function Home() {


  // --- Hero Interactive Logic ---
  const glassRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const state = useRef({
    mouseX: 0, mouseY: 0,
    currentX: 0, currentY: 0,
    isHovering: false,
  });

  const animateTitle = useCallback(function loop() {
    if (!glassRef.current) return;
    const ease = 0.08;

    state.current.currentX += (state.current.mouseX - state.current.currentX) * ease;
    state.current.currentY += (state.current.mouseY - state.current.currentY) * ease;

    const { currentX, currentY, isHovering } = state.current;

    const rotateX = currentY * -10;
    const rotateY = currentX * 10;
    const translateZ = isHovering ? 20 : 0;
    const scale = isHovering ? 1.02 : 1.0;

    glassRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale}) translateZ(${translateZ}px)`;

    if (isHovering || Math.abs(state.current.currentX) > 0.001 || Math.abs(state.current.currentY) > 0.001) {
      requestRef.current = requestAnimationFrame(loop);
    } else {
      glassRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)`;
      requestRef.current = 0;
    }
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    state.current.mouseX = (x - centerX) / centerX;
    state.current.mouseY = (y - centerY) / centerY;

    if (!state.current.isHovering) {
      state.current.isHovering = true;
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(animateTitle);
      }
    }
  };

  const handleHeroMouseLeave = () => {
    state.current.isHovering = false;
    state.current.mouseX = 0;
    state.current.mouseY = 0;
    if (!requestRef.current) {
      requestRef.current = requestAnimationFrame(animateTitle);
    }
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <main>


      <WebGLBackground />

      <div id="ui-layer">
        <a href="https://x.com/theColtonBatts" target="_blank" rel="noopener noreferrer" className="x-link">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="x-icon">
            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>
        <div
          className="hero-banner"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          <video autoPlay loop muted playsInline className="hero-video">
            <source src="/banner-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-glass" ref={glassRef}>
            <h1 className="hero-title">
              <span className="un-gothic">Un</span>
              <span className="briefed-pixel">briefed</span>
            </h1>
          </div>
        </div>

        <BoardGrid />
      </div>
    </main>
  );
}
