'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import BoardGrid from '@/components/BoardGrid';

// Dynamically import Three.js background since it needs the window object
const WebGLBackground = dynamic(() => import('@/components/WebGLBackground'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remove loading screen after mount
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <div
        id="loading"
        style={{
          opacity: loading ? 1 : 0,
          pointerEvents: loading ? 'all' : 'none'
        }}
      >
        SYSTEM_INIT // LOADING...
      </div>

      <WebGLBackground />

      <div id="ui-layer">
        <a href="https://x.com/theColtonBatts" target="_blank" rel="noopener noreferrer" className="x-link">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="x-icon">
            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>
        <div className="hero-banner">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src="/banner-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-glass">
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
