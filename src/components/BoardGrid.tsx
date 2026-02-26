'use client';

import { data, BrandData } from '@/data/brands';
import { useEffect, useRef, useCallback } from 'react';

const Card = ({ item }: { item: BrandData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const state = useRef({
        mouseX: 0, mouseY: 0,
        currentX: 0, currentY: 0,
        glareX: 50, glareY: 50,
        currentGlareX: 50, currentGlareY: 50,
        isHovering: false,
    });

    const animate = useCallback(function loop() {
        if (!cardRef.current) return;
        const ease = 0.08;

        state.current.currentX += (state.current.mouseX - state.current.currentX) * ease;
        state.current.currentY += (state.current.mouseY - state.current.currentY) * ease;
        state.current.currentGlareX += (state.current.glareX - state.current.currentGlareX) * ease;
        state.current.currentGlareY += (state.current.glareY - state.current.currentGlareY) * ease;

        const { currentX, currentY, currentGlareX, currentGlareY, isHovering } = state.current;

        const scale = Math.abs(currentX) * 0.02 + Math.abs(currentY) * 0.02 + (isHovering ? 1.04 : 1);

        const rotateX = currentY * -12;
        const rotateY = currentX * 12;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        if (isHovering || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
            cardRef.current.style.background = `radial-gradient(circle at ${currentGlareX}% ${currentGlareY}%, rgba(255,255,255,0.08), rgba(10,10,12,0.65) 60%)`;
        } else {
            cardRef.current.style.background = 'var(--card-bg)';
        }

        if (isHovering || Math.abs(state.current.currentX) > 0.001 || Math.abs(state.current.currentY) > 0.001) {
            requestRef.current = requestAnimationFrame(loop);
        } else {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            requestRef.current = 0;
        }
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        state.current.mouseX = (x - centerX) / centerX;
        state.current.mouseY = (y - centerY) / centerY;

        state.current.glareX = (x / rect.width) * 100;
        state.current.glareY = (y / rect.height) * 100;

        if (!state.current.isHovering) {
            state.current.isHovering = true;
            if (!requestRef.current) {
                requestRef.current = requestAnimationFrame(animate);
            }
        }
    };

    const handleMouseLeave = () => {
        state.current.isHovering = false;
        state.current.mouseX = 0;
        state.current.mouseY = 0;
        state.current.glareX = 50;
        state.current.glareY = 50;
        if (!requestRef.current) {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const dayStr = item.day.toString().padStart(2, '0');

    return (
        <div
            ref={cardRef}
            className="card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="card-header">
                <span className="day-label">DAY // {dayStr}</span>
            </div>
            <div className="card-content">
                <h3 className="brand-name">{item.brand}</h3>
            </div>
        </div>
    );
};

export default function BoardGrid() {
    return (
        <div className="grid">
            {data.map((item) => (
                <Card key={item.day} item={item} />
            ))}
        </div>
    );
}
