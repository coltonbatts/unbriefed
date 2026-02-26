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

        <header>
          <div>
            <span className="subtitle">Colton Batts</span>
          </div>
          <div className="stats">
            DURATION: 90 DAYS<br />
            STATUS: ACTIVE<br />
            COORDINATES: SECURED
          </div>
        </header>

        <BoardGrid />
      </div>
    </main>
  );
}
