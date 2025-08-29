import styled from 'styled-components';

export const Card = styled.div`
  background: ${props => props.theme.colors?.background?.paper || '#fafafa'};
  border-radius: ${props => props.theme.borderRadius?.lg || '12px'};
  padding: ${props => props.theme.spacing?.(6) || '24px'};
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  box-shadow: ${props => props.theme.shadows?.sm || '0 1px 3px 0 rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  padding-bottom: ${props => props.theme.spacing?.(4) || '16px'};
  border-bottom: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
  
  h2, h3, h4 {
    margin: 0;
    color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  }
`;

export const CardBody = styled.div`
  padding: ${props => props.padding || '0'};
`;

export const CardFooter = styled.div`
  padding-top: ${props => props.theme.spacing?.(4) || '16px'};
  border-top: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  margin-top: ${props => props.theme.spacing?.(4) || '16px'};
  display: flex;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  justify-content: ${props => props.justify || 'flex-end'};
`;