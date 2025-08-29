import styled from 'styled-components';

export const Form = styled.form`
  width: 100%;
`;

export const FormControl = styled.div`
  margin-bottom: ${props => props.theme.spacing?.(3) || '24px'};
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing?.(1) || '8px'};
  font-weight: 500;
  color: ${props => props.theme.colors?.text?.primary || '#212121'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing?.(1) || '8px'};
  font-size: ${props => props.theme.typography?.fontSize?.md || '16px'};
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius?.sm || '4px'};
  background-color: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  color: ${props => props.theme.colors?.text?.primary || '#212121'};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors?.primary?.main || '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.theme.colors?.primary?.main ? `${props.theme.colors.primary.main}20` : 'rgba(25, 118, 210, 0.2)'};
  }

  &:disabled {
    background-color: ${props => props.theme.colors?.background?.secondary || '#f5f5f5'};
    color: ${props => props.theme.colors?.text?.disabled || '#9e9e9e'};
  }

  &::placeholder {
    color: ${props => props.theme.colors?.text?.disabled || '#9e9e9e'};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing?.(1) || '8px'};
  font-size: ${props => props.theme.typography?.fontSize?.md || '16px'};
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius?.sm || '4px'};
  background-color: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  color: ${props => props.theme.colors?.text?.primary || '#212121'};
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors?.primary?.main || '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.theme.colors?.primary?.main ? `${props.theme.colors.primary.main}20` : 'rgba(25, 118, 210, 0.2)'};
  }

  &:disabled {
    background-color: ${props => props.theme.colors?.background?.secondary || '#f5f5f5'};
    color: ${props => props.theme.colors?.text?.disabled || '#9e9e9e'};
  }

  &::placeholder {
    color: ${props => props.theme.colors?.text?.disabled || '#9e9e9e'};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing?.(1) || '8px'};
  font-size: ${props => props.theme.typography?.fontSize?.md || '16px'};
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius?.sm || '4px'};
  background-color: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  color: ${props => props.theme.colors?.text?.primary || '#212121'};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors?.primary?.main || '#1976d2'};
    box-shadow: 0 0 0 2px ${props => props.theme.colors?.primary?.main ? `${props.theme.colors.primary.main}20` : 'rgba(25, 118, 210, 0.2)'};
  }

  &:disabled {
    background-color: ${props => props.theme.colors?.background?.secondary || '#f5f5f5'};
    color: ${props => props.theme.colors?.text?.disabled || '#9e9e9e'};
  }
`;

export const ErrorText = styled.p`
  color: ${props => props.theme.colors?.error?.main || '#d32f2f'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  margin-top: ${props => props.theme.spacing?.(0.5) || '4px'};
`;