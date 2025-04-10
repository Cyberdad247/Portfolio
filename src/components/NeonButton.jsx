import React from 'react';
import React from 'react';

interface NeonButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const NeonButton = ({ href, children, className = '', onClick, type = 'button' }) => {
    const Tag = href ? 'a' : 'button';

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Tag
            href={href}
            onClick={handleClick}
            className={`neon-btn ${className}`}
            type={Tag === 'button' ? type : undefined}
        >
            {children}
        </Tag>
    );
};



export default NeonButton;