import styled from 'styled-components';

const getVariantStyles = (props) => {
  switch (props.variant) {
    case 'primary':
      return `
        background: ${props.theme.colors?.primary?.[600] || '#0284c7'};
        color: white;
        border: 1px solid ${props.theme.colors?.primary?.[600] || '#0284c7'};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors?.primary?.[700] || '#0369a1'};
          border-color: ${props.theme.colors?.primary?.[700] || '#0369a1'};
          transform: translateY(-1px);
        }
        
        &:active:not(:disabled) {
          background: ${props.theme.colors?.primary?.[800] || '#075985'};
          transform: translateY(0);
        }
      `;
    
    case 'secondary':
      return `
        background: transparent;
        color: ${props.theme.colors?.primary?.[600] || '#0284c7'};
        border: 1px solid ${props.theme.colors?.border?.medium || '#d4d4d8'};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors?.primary?.[50] || '#f0f9ff'};
          border-color: ${props.theme.colors?.primary?.[300] || '#7dd3fc'};
        }
      `;
    
    case 'outlined':
      return `
        background: transparent;
        color: ${props.theme.colors?.primary?.[600] || '#0284c7'};
        border: 1px solid ${props.theme.colors?.primary?.[600] || '#0284c7'};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors?.primary?.[600] || '#0284c7'};
          color: white;
        }
      `;
    
    case 'danger':
      return `
        background: ${props.theme.colors?.error?.[500] || '#ef4444'};
        color: white;
        border: 1px solid ${props.theme.colors?.error?.[500] || '#ef4444'};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors?.error?.[600] || '#dc2626'};
          border-color: ${props.theme.colors?.error?.[600] || '#dc2626'};
        }
      `;
    
    case 'success':
      return `
        background: ${props.theme.colors?.success?.[500] || '#22c55e'};
        color: white;
        border: 1px solid ${props.theme.colors?.success?.[500] || '#22c55e'};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors?.success?.[600] || '#16a34a'};
          border-color: ${props.theme.colors?.success?.[600] || '#16a34a'};
        }
      `;
    
    default:
      return `
        background: ${props.theme.colors?.background?.paper || '#fafafa'};
        color: ${props.theme.colors?.text?.primary || '#18181b'};
        border: 1px solid ${props.theme.colors?.border?.medium || '#d4d4d8'};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors?.background?.subtle || '#f4f4f5'};
          border-color: ${props.theme.colors?.border?.dark || '#a1a1aa'};
        }
      `;
  }
};

const getSizeStyles = (props) => {
  switch (props.size) {
    case 'sm':
      return `
        padding: ${props.theme.spacing?.(1.5) || '6px'} ${props.theme.spacing?.(3) || '12px'};
        font-size: ${props.theme.typography?.fontSize?.sm || '14px'};
      `;
    case 'lg':
      return `
        padding: ${props.theme.spacing?.(3) || '12px'} ${props.theme.spacing?.(6) || '24px'};
        font-size: ${props.theme.typography?.fontSize?.lg || '18px'};
      `;
    default:
      return `
        padding: ${props.theme.spacing?.(2) || '8px'} ${props.theme.spacing?.(4) || '16px'};
        font-size: ${props.theme.typography?.fontSize?.base || '16px'};
      `;
  }
};

export const Button = styled.button`
  ${props => getVariantStyles(props)}
  ${props => getSizeStyles(props)}
  
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  font-weight: ${props => props.theme.typography?.fontWeight?.medium || '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  min-height: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors?.primary?.[300] || '#7dd3fc'};
    outline-offset: 2px;
  }
`;

export const IconButton = styled(Button)`
  padding: ${props => props.theme.spacing?.(2) || '8px'};
  min-width: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
  min-height: ${props => {
    switch (props.size) {
      case 'sm': return '32px';
      case 'lg': return '48px';
      default: return '40px';
    }
  }};
`;