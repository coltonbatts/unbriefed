'use client';

import { data } from '@/data/brands';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

const WebGLBackground = dynamic(() => import('@/components/WebGLBackground'), { ssr: false });

export default function InternalBoard() {
    const [savedDataStatus, setSavedDataStatus] = useState<Record<number, boolean>>({});

    useEffect(() => {
        // Read local storage after mount to prevent hydration mismatch
        const status: Record<number, boolean> = {};
        data.forEach((item) => {
            const hasIdeation = !!window.localStorage.getItem(`unbriefed-ideation-"${item.day}"`);
            const hasPrompts = !!window.localStorage.getItem(`unbriefed-prompts-"${item.day}"`);
            const hasLinks = !!window.localStorage.getItem(`unbriefed-links-"${item.day}"`);
            status[item.day] = hasIdeation || hasPrompts || hasLinks;
        });
        // eslint-disable-next-line
        setSavedDataStatus(status);
    }, []);

    return (
        <main>
            <WebGLBackground />
            <div id="ui-layer">
                <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
                    <div>
                        <span className="subtitle">INTERNAL ACCESS</span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>Unbriefed Board</h1>
                    </div>
                </header>

                <div className="grid">
                    {data.map((item) => {
                        const dayStr = item.day.toString().padStart(2, '0');
                        return (
                            <Link href={`/internal/${item.day}`} key={item.day} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ cursor: 'pointer', minHeight: '180px' }}>
                                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="day-label">DAY // {dayStr}</span>
                                        {savedDataStatus[item.day] && (
                                            <div
                                                title="In Progress"
                                                style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--accent-red)',
                                                    boxShadow: '0 0 8px var(--accent-red)'
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="card-content">
                                        <h3 className="brand-name">{item.brand}</h3>
                                        <p className="card-action-text" style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '15px', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.2s' }}>
                                            OPEN IDEATION ↗
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
