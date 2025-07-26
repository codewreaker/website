import React from 'react';
import './geometricCard.css';

interface GeometricCardProps {
  heading?: string;
  currency?: string;
  title?: string;
  tagline?:string;
  description?: string;
  action: string;
  onClick?: () => void;
  customStyle: {
    bg?: string;
    width?: string | number;
    height?: string | number;
    btnStyle?: React.CSSProperties;
  };
  children?: React.ReactNode;
}

const GeometricCard: React.FC<Partial<GeometricCardProps>> = ({
  heading = 'Lorem',
  title = 'Ipsum',
  action = 'Dit Dolore',
  tagline='Iadeleum',
  onClick = () => {
    /** */
  },
  customStyle,
  children,
}) => {
  const {
    bg = 'var(--color-primary)',
    btnStyle = {
      background: 'var(--color-text)',
      color: 'var(--color-primary)',
    },
    width,
    height,
  } = customStyle || {};
  
  return (
    <div
      className="info-card"
      style={{ width, height, '--before-tmp-bg': bg } as React.CSSProperties}
    >
      <p className="heading">{heading}</p>
      <p className="title">{title}</p>

      <div className="content">{children}</div>

      <div className="presented-by">{tagline}</div>
      <button
        onClick={onClick}
        className="portfolio-btn"
        style={btnStyle as React.CSSProperties}
      >
        {action}
      </button>
    </div>
  );
};

export default GeometricCard;
