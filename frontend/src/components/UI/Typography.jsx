import styled from 'styled-components';

export const H1 = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: #333;
`;

export const H2 = styled.h2`
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: #333;
`;

export const H3 = styled.h3`
  font-size: 1.75rem;
  margin: 0 0 1rem 0;
  color: #333;
`;

export const H4 = styled.h4`
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #333;
`;

export const H5 = styled.h5`
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: #333;
`;

export const H6 = styled.h6`
  font-size: 1rem;
  margin: 0 0 1rem 0;
  color: #333;
`;

export const Paragraph = styled.p`
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

export const Text = styled.span`
  color: ${props => props.color || 'inherit'};
  font-size: ${props => props.size || 'inherit'};
  font-weight: ${props => props.weight || 'normal'};
`;