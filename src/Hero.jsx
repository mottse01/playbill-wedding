import React from 'react';
import './Hero.css';

export default function Hero() {
    return (
        <div className="playbill-hero">
            <picture className="hero-cover-picture">
                <source
                    type="image/avif"
                    srcSet="/optimized/cover-900.avif 900w, /optimized/cover-1400.avif 1400w"
                    sizes="100vw"
                />
                <source
                    type="image/webp"
                    srcSet="/optimized/cover-900.webp 900w, /optimized/cover-1400.webp 1400w"
                    sizes="100vw"
                />
                <img
                    className="hero-cover-image"
                    src="/optimized/cover-1400.webp"
                    alt="Sean and Desi wedding playbill cover"
                    width="1200"
                    height="1800"
                    fetchPriority="high"
                    decoding="async"
                />
            </picture>
        </div>
    );
}
