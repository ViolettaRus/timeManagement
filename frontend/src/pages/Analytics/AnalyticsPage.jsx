import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntries } from '../../store/slices/timeEntriesSlice';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { 
  startOfToday, endOfToday, 
  startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth 
} from 'date-fns';
import RecentTimeEntries from '../../components/Timer/RecentTimeEntries';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';
import {
  Container,
  Card,
  Button,
  H2
} from '../../components/UI';
import { isWithinDateRange } from '../../utils/dateUtils';
import { formatTime, getTimeUnitLabel } from '../../utils/timeUtils';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AnalyticsContainer = styled.div`
  padding: ${props => props.theme.spacing?.(6) || '24px'} 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing?.(8) || '32px'};
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing?.(8) || '32px'};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing?.(4) || '16px'};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TimeRangeContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  flex-wrap: wrap;
`;

const TimeRangeButton = styled(Button)`
  min-width: 100px;
  
  @media (max-width: 480px) {
    min-width: 80px;
    padding: ${props => props.theme.spacing?.(2) || '8px'};
    font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  }
`;

const UnitSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(2) || '8px'};
  
  span {
    font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
    color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
    white-space: nowrap;
  }
`;

const UnitSelect = styled.select`
  padding: ${props => props.theme.spacing?.(2) || '8px'};
  border: 1px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  border-radius: ${props => props.theme.borderRadius?.sm || '4px'};
  background: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
  min-width: 100px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing?.(8) || '32px'};
  margin-bottom: ${props => props.theme.spacing?.(8) || '32px'};
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartWrapper = styled(Card)`
  padding: ${props => props.theme.spacing?.(6) || '24px'};
  position: relative;
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h3`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
  color: ${props => props.theme.colors?.text?.primary || '#18181b'};
`;

const ChartContainer = styled.div`
  position: relative;
  flex: 1;
  min-height: 300px;
`;

const NoDataMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  font-style: italic;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing?.(4) || '16px'};
  margin-bottom: ${props => props.theme.spacing?.(8) || '32px'};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing?.(6) || '24px'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors?.primary?.main || '#0ea5e9'};
  margin-bottom: ${props => props.theme.spacing?.(1) || '4px'};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
`;

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { items: entries = [], loading: entriesLoading } = useSelector(state => state.timeEntries);
  const { items: projects = [], loading: projectsLoading } = useSelector(state => state.projects);
  
  const [timeRange, setTimeRange] = useState('week');
  const [timeUnit, setTimeUnit] = useState('hours');

  useEffect(() => {
    dispatch(fetchTimeEntries());
    dispatch(fetchProjects());
  }, [dispatch]);

  const { chartData, stats } = useMemo(() => {
    if (entriesLoading || projectsLoading) {
      return {
        chartData: {
          pieData: null,
          barData: null
        },
        stats: {
          totalSeconds: 0,
          totalEntries: 0,
          averagePerDay: 0,
          projectsCount: 0
        }
      };
    }

    const now = new Date();
    let start, end;

    switch (timeRange) {
      case 'day':
        start = startOfToday();
        end = endOfToday();
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
    }

    const filteredEntries = entries.filter(entry => {
      try {
        if (!entry || !entry.projectId || !entry.duration || entry.duration <= 0) {
          return false;
        }

        const entryDate = entry.date || entry.startTime || entry.createdAt || entry.timestamp;
        
        if (!entryDate) {
          return false;
        }

        return isWithinDateRange(entryDate, start, end);
      } catch (error) {
        console.error('Ошибка обработки записи:', error, entry);
        return false;
      }
    });

    const totalSeconds = filteredEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const totalEntriesCount = filteredEntries.length;
    const averagePerDay = totalEntriesCount > 0 
      ? (totalSeconds / totalEntriesCount) 
      : 0;

    const projectsData = projects.reduce((acc, project) => {
      if (project && (project.id || project._id)) {
        const projectId = project.id || project._id;
        acc[projectId] = {
          name: project.name || `Проект ${projectId}`,
          color: project.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
          totalSeconds: 0
        };
      }
      return acc;
    }, {});

    filteredEntries.forEach(entry => {
      if (entry && entry.projectId && projectsData[entry.projectId]) {
        projectsData[entry.projectId].totalSeconds += entry.duration || 0;
      }
    });

    const chartDataArray = Object.values(projectsData)
      .filter(project => project && project.totalSeconds > 0)
      .map(project => ({
        ...project,
        hours: (project.totalSeconds / 3600).toFixed(1)
      }));

    if (chartDataArray.length === 0) {
      return {
        chartData: {
          pieData: {
            labels: ['Нет данных'],
            datasets: [{
              data: [1],
              backgroundColor: ['#e0e0e0'],
              borderWidth: 0
            }]
          },
          barData: {
            labels: ['Нет данных'],
            datasets: [{
              data: [0],
              backgroundColor: ['#e0e0e0'],
              borderWidth: 0
            }]
          }
        },
        stats: {
          totalSeconds: 0,
          totalEntries: 0,
          averagePerDay: 0,
          projectsCount: 0
        }
      };
    }

    const pieData = {
      labels: chartDataArray.map(p => p.name),
      datasets: [{
        data: chartDataArray.map(p => p.totalSeconds),
        backgroundColor: chartDataArray.map(p => p.color),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 12
      }]
    };

    const barData = {
      labels: chartDataArray.map(p => p.name),
      datasets: [{
        label: 'Время работы',
        data: chartDataArray.map(p => {
          switch (timeUnit) {
            case 'seconds': return p.totalSeconds;
            case 'minutes': return p.totalSeconds / 60;
            case 'hours': return p.totalSeconds / 3600;
            default: return p.totalSeconds / 3600;
          }
        }),
        backgroundColor: chartDataArray.map(p => p.color),
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      }]
    };

    return {
      chartData: {
        pieData,
        barData
      },
      stats: {
        totalSeconds,
        totalEntries: totalEntriesCount,
        averagePerDay,
        projectsCount: chartDataArray.length
      }
    };
  }, [entries, projects, timeRange, entriesLoading, projectsLoading, timeUnit]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            
            if (context.datasetIndex === 1) {
              return `${label}: ${formatTime(value * (timeUnit === 'hours' ? 3600 : timeUnit === 'minutes' ? 60 : 1), timeUnit)}`;
            } else {
              return `${label}: ${formatTime(value, timeUnit)}`;
            }
          }
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    }
  }), [timeUnit]);

  const barOptions = useMemo(() => ({
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: getTimeUnitLabel(timeUnit).toUpperCase()
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }), [chartOptions, timeUnit]);

  if (entriesLoading || projectsLoading) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#666'
        }}>
          ⏳ Загрузка данных...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <AnalyticsContainer>
        <Header>
          <H2>Аналитика продуктивности</H2>
          <p>Анализируйте вашу работу и оптимизируйте время</p>
        </Header>

        <ControlsContainer>
          <TimeRangeContainer>
            <TimeRangeButton
              variant={timeRange === 'day' ? 'primary' : 'outlined'}
              onClick={() => setTimeRange('day')}
            >
              📅 День
            </TimeRangeButton>
            <TimeRangeButton
              variant={timeRange === 'week' ? 'primary' : 'outlined'}
              onClick={() => setTimeRange('week')}
            >
              📆 Неделя
            </TimeRangeButton>
            <TimeRangeButton
              variant={timeRange === 'month' ? 'primary' : 'outlined'}
              onClick={() => setTimeRange('month')}
            >
              🗓️ Месяц
            </TimeRangeButton>
          </TimeRangeContainer>

          <UnitSelector>
            <span>Единицы:</span>
            <UnitSelect
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
            >
              <option value="hours">Часы</option>
              <option value="minutes">Минуты</option>
              <option value="seconds">Секунды</option>
            </UnitSelect>
          </UnitSelector>
        </ControlsContainer>

        <StatsGrid>
          <StatCard>
            <StatValue>{formatTime(stats.totalSeconds, timeUnit)}</StatValue>
            <StatLabel>Всего времени ({getTimeUnitLabel(timeUnit)})</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalEntries}</StatValue>
            <StatLabel>Записей времени</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatTime(stats.averagePerDay, timeUnit)}</StatValue>
            <StatLabel>В среднем на запись</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.projectsCount}</StatValue>
            <StatLabel>Активных проектов</StatLabel>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartWrapper>
            <ChartTitle>📊 Распределение времени</ChartTitle>
            <ChartContainer>
              {chartData.pieData && chartData.pieData.labels[0] !== 'Нет данных' ? (
                <Pie 
                  data={chartData.pieData} 
                  options={chartOptions}
                />
              ) : (
                <NoDataMessage>
                  📝 Нет данных за выбранный период
                </NoDataMessage>
              )}
            </ChartContainer>
          </ChartWrapper>

          <ChartWrapper>
            <ChartTitle>⏱️ Время работы по проектам</ChartTitle>
            <ChartContainer>
              {chartData.barData && chartData.barData.labels[0] !== 'Нет данных' ? (
                <Bar 
                  data={chartData.barData} 
                  options={barOptions}
                />
              ) : (
                <NoDataMessage>
                  📝 Нет данных за выбранный период
                </NoDataMessage>
              )}
            </ChartContainer>
          </ChartWrapper>
        </ChartsGrid>

        <RecentTimeEntries />
      </AnalyticsContainer>
    </Container>
  );
};

export default AnalyticsPage;