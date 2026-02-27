'use client';

import { data } from '@/data/brands';
import { notFound } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';
import Toast from '@/components/Toast';

const WebGLBackground = dynamic(() => import('@/components/WebGLBackground'), { ssr: false });

export default function DayIdeation({ params }: { params: Promise<{ day: string }> }) {
    const unwrappedParams = React.use(params);
    const day = parseInt(unwrappedParams.day, 10);
    const brand = data.find((b) => b.day === day);

    if (!brand) {
        notFound();
    }

    const dayStr = day.toString().padStart(2, '0');

    // Local storage states
    const [ideation, setIdeation] = useLocalStorage<string>(`unbriefed-ideation-${day}`, '');
    const [prompts, setPrompts] = useLocalStorage<string>(`unbriefed-prompts-${day}`, '');
    const [links, setLinks] = useLocalStorage<string>(`unbriefed-links-${day}`, '');

    const [showToast, setShowToast] = React.useState(false);

    // Debounce the auto-save toast so it doesn't spam on every keystroke
    React.useEffect(() => {
        // Don't show toast on initial load if fields are empty
        if (!ideation && !prompts && !links) return;

        const timeout = setTimeout(() => {
            setShowToast(true);
        }, 1000); // 1 second after typing stops

        return () => clearTimeout(timeout);
    }, [ideation, prompts, links]);

    return (
        <main>
            <WebGLBackground />
            <div id="ui-layer">
                <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <div>
                            <span className="subtitle" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                                <Link href="/internal" className="back-link">← BACK TO GRID</Link>
                                <span>DAY // {dayStr}</span>
                            </span>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', margin: 0 }}>{brand.brand}</h1>
                        </div>
                        <div className="stats" style={{ paddingTop: '10px' }}>
                            <span style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px' }}>TIER {brand.tier}</span>
                        </div>
                    </div>
                </header>

                <div className="ideation-container">
                    <div className="input-group">
                        <label>📝 IDEATION & STORYBOARD</label>
                        <textarea
                            value={ideation}
                            onChange={(e) => setIdeation(e.target.value)}
                            placeholder="Brainstorming, concepts, storyboard notes..."
                            className="glass-input"
                            rows={12}
                        />
                    </div>

                    <div className="input-group">
                        <label>✨ PROMPTS (MIDJOURNEY / RUNWAY / CLAUDE)</label>
                        <textarea
                            value={prompts}
                            onChange={(e) => setPrompts(e.target.value)}
                            placeholder="Paste your generated prompts here..."
                            className="glass-input"
                            rows={8}
                        />
                    </div>

                    <div className="input-group">
                        <label>🔗 REFERENCES & LINKS</label>
                        <input
                            type="text"
                            value={links}
                            onChange={(e) => setLinks(e.target.value)}
                            placeholder="https://vimeo.com/... or moodboard links"
                            className="glass-input"
                        />
                    </div>
                </div>
            </div>
            <Toast
                show={showToast}
                message="Changes saved locally"
                onHide={() => setShowToast(false)}
            />
        </main>
    );
}
