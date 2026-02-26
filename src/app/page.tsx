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
        <header>
          <div>
            <span className="subtitle">Spec Ad Series</span>
            <h1>UNBRIEFED</h1>
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
