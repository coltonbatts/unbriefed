'use client';

import { data, BrandData } from '@/data/brands';
import { useRef } from 'react';

const Card = ({ item }: { item: BrandData }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        cardRef.current.style.background = `
        radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08), rgba(10,10,12,0.65) 60%)
    `;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cardRef.current.style.background = '';
    };

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
