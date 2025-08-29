import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.colors.shadow.light};
`;

export const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.background.secondary};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  transition: background-color 0.3s ease;

  &:nth-child(even) {
    background-color: ${props => props.theme.colors.background.secondary};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  text-align: ${props => props.align || 'left'};
  color: ${props => props.theme.colors.text.primary};
`;

export const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
`;