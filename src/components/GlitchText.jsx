import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const GlitchText = ({ children, tag: Tag = 'span', className = '' }) => {
    const { theme } = useTheme();
    const isGlitchActive = theme === 'dark';

    const getTextContent = (nodes) => {
        if (typeof nodes === 'string') return nodes;
        if (Array.isArray(nodes)) return nodes.map(getTextContent).join('');
        if (nodes && typeof nodes === 'object' && nodes.props && nodes.props.children) {
            return getTextContent(nodes.props.children);
        }
        return '';
    };
    const dataText = getTextContent(children);

    return (
        <Tag
            className={`relative inline-block ${isGlitchActive ? 'glitch-active' : ''} ${className}`}
            data-text={dataText}
        >
            {children}
        </Tag>
    );
};

export default GlitchText;