import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    padding: 0 ${props => props.theme.spacing.xs};
  }
`;

export const PageContainer = styled(Container)`
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.sm};
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  gap: ${props => props.gap || props.theme.spacing.md};
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  @media (max-width: 768px) {
    flex-direction: ${props => props.mobileDirection || props.direction || 'column'};
    gap: ${props => props.mobileGap || props.gap || props.theme.spacing.md};
  }
`;