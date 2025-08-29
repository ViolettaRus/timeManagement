import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
`;

const SnackbarContainer = styled.div`
  position: fixed;
  bottom: ${props => props.theme.spacing?.(4) || '32px'};
  left: 50%;
  transform: translateX(-50%);
  padding: ${props => props.theme.spacing?.(2) || '16px'} ${props => props.theme.spacing?.(4) || '32px'};
  background-color: ${props => {
    switch (props.variant) {
      case 'success': 
        return props.theme.colors?.success?.main || '#2e7d32';
      case 'error': 
        return props.theme.colors?.error?.main || '#d32f2f';
      case 'warning': 
        return props.theme.colors?.warning?.main || '#f57c00';
      case 'info': 
        return props.theme.colors?.info?.main || '#1976d2';
      default: 
        return props.theme.colors?.primary?.main || '#1976d2';
    }
  }};
  color: white;
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  box-shadow: ${props => props.theme.shadows?.[2] || '0 4px 8px rgba(0,0,0,0.1)'};
  z-index: 10000;
  display: ${props => props.open ? 'block' : 'none'};
  min-width: 300px;
  text-align: center;
  
  ${props => props.open && css`
    animation: ${slideIn} 0.3s ease forwards;
  `}
  
  ${props => !props.open && css`
    animation: ${slideOut} 0.3s ease forwards;
  `}
`;

export const Snackbar = ({ 
  open, 
  onClose, 
  message, 
  variant = 'success', 
  autoHideDuration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [open, autoHideDuration, onClose]);

  if (!isVisible && !open) return null;

  return (
    <SnackbarContainer open={isVisible} variant={variant}>
      {message}
    </SnackbarContainer>
  );
};

export default Snackbar;