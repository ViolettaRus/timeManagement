import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableHeaderCell,
  FlexContainer,
  Button,
  Select
} from '../UI';
import styled from 'styled-components';
import { formatTimeWithUnit } from '../../utils/timeUtils';

const PaginationSelect = styled(Select)`
  margin-left: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs};
  max-width: 80px;
`;

const UnitSelect = styled(Select)`
  margin-left: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs};
  max-width: 120px;
`;

const PaginationInfo = styled.span`
  margin: 0 ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ColorIndicator = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${props => props.color};
  margin-right: ${props => props.theme.spacing.sm};
  border-radius: 50%;
  flex-shrink: 0;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StyledTable = styled(Table)`
  min-width: 400px;
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const UnitSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  span {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const RecentTimeEntries = () => {
  const { entries = [], loading } = useSelector((state) => ({
    entries: state.timeEntries?.entries || [],
    loading: state.timeEntries?.loading || false
  }));

  const { items: projects = [] } = useSelector((state) => state.projects || {});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [timeUnit, setTimeUnit] = useState('hours');

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTimeUnitChange = (event) => {
    setTimeUnit(event.target.value);
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          ⏳ Загрузка...
        </div>
      </Card>
    );
  }

  const validProjects = projects.filter(project => project && project.id);
  
  if (validProjects.length === 0) {
    return (
      <Card>
        <NoData>
          📁 Нет проектов для отображения
        </NoData>
      </Card>
    );
  }

  const paginatedProjects = validProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <HeaderRow>
        <h3 style={{ margin: 0 }}>📈 Статистика по проектам</h3>
        
        <UnitSelector>
          <span>Единицы:</span>
          <UnitSelect
            value={timeUnit}
            onChange={handleTimeUnitChange}
          >
            <option value="hours">Часы</option>
            <option value="minutes">Минуты</option>
            <option value="seconds">Секунды</option>
          </UnitSelect>
        </UnitSelector>
      </HeaderRow>
      
      <TableContainer>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Проект</TableHeaderCell>
              <TableHeaderCell align="right">Затраченное время</TableHeaderCell>
              <TableHeaderCell align="right">Записи</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {paginatedProjects.map((project) => {
              if (!project) return null;
              
              const projectEntries = entries.filter(e => e && e.projectId === project.id);
              const totalSeconds = projectEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
              const formattedTime = formatTimeWithUnit(totalSeconds, timeUnit);
              
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <FlexContainer align="center">
                      <ColorIndicator color={project.color || '#ccc'} />
                      <span>{project.name || 'Без названия'}</span>
                    </FlexContainer>
                  </TableCell>
                  <TableCell align="right">{formattedTime}</TableCell>
                  <TableCell align="right">{projectEntries.length}</TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </StyledTable>
      </TableContainer>
      
      {validProjects.length > 0 && (
        <FlexContainer justify="space-between" align="center" wrap="wrap">
          <FlexContainer align="center" mobileDirection="row">
            <span style={{ fontSize: '0.9rem' }}>Проектов на странице:</span>
            <PaginationSelect
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              {[5, 10, 25].map((rows) => (
                <option key={rows} value={rows}>
                  {rows}
                </option>
              ))}
            </PaginationSelect>
          </FlexContainer>
          <FlexContainer align="center" mobileDirection="row">
            <Button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              variant="outlined"
              size="small"
            >
              ←
            </Button>
            <PaginationInfo>
              {page + 1} / {Math.ceil(validProjects.length / rowsPerPage)}
            </PaginationInfo>
            <Button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= Math.ceil(validProjects.length / rowsPerPage) - 1}
              variant="outlined"
              size="small"
            >
              →
            </Button>
          </FlexContainer>
        </FlexContainer>
      )}
    </Card>
  );
};

export default RecentTimeEntries;