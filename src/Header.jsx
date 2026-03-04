import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <div className="playbill-header">
      {/* Left side: Venue details roughly 20% width */}
      <div className="header-left">
        <div className="venue-text">
          <span className="venue-name">The</span>
          <span className="venue-name">Mott</span>
          <span className="venue-name">Farm</span>
        </div>
      </div>

      {/* Right side: The main PLAYBILL banner */}
      <div className="header-right">
        <div className="header-title-container" aria-label="PLAYBILL">
          <svg
            viewBox="0 0 1000 180"
            className="header-title-svg"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Left anchored at 0, stretched exactly to 1000 (the viewBox limit) for pure edge-to-edge */}
            <text
              x="0"
              y="130"
              className="svg-text-content"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
            >
              PLAYBILL
            </text>
            {/* Right anchored exactly at 1000 to match the "L" edge perfectly */}
            <text
              x="1000"
              y="165"
              textAnchor="end"
              className="svg-subtitle-content"
            >
              a save-the-date for weddinggoers
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
