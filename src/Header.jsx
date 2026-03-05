import React from 'react';
import './Header.css';

export default function Header({ title }) {
  if (title) {
    return (
      <div className="section-header">
        <div className="header-line"></div>
        <h2 className="section-title">{title}</h2>
        <div className="header-line"></div>
      </div>
    );
  }

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
            <text
              x="0"
              y="130"
              className="svg-text-content"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
            >
              PLAYBILL
            </text>
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
