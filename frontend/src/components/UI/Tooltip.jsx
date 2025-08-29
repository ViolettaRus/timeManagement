import React, { useState } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: ${props => props.theme.spacing?.(2) || '8px'};
  background: ${props => props.theme.colors?.gray?.[800] || '#27272a'};
  color: white;
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  white-space: nowrap;
  margin-bottom: ${props => props.theme.spacing?.(1) || '4px'};
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 1000;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.theme.colors?.gray?.[800] || '#27272a'};
  }
`;

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <TooltipContent $visible={isVisible} $position={position}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;