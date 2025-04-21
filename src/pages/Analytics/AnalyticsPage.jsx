import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, 
         LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeEntries } from '../../store/slices/timeEntriesSlice';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { 
  startOfToday, endOfToday, 
  startOfWeek, endOfWeek, 
  startOfMonth,
  isWithinInterval, parseISO, format,
  addDays
} from 'date-fns';
import RecentTimeEntries from '../../components/Timer/RecentTimeEntries';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { entries = [], loading: entriesLoading } = useSelector(state => state.timeEntries || {});
  const { items: projects = [], loading: projectsLoading } = useSelector(state => state.projects || {});
  
  const [timeRange, setTimeRange] = useState('week');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    dispatch(fetchTimeEntries());
    dispatch(fetchProjects());
  }, [dispatch]);

  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    try {
      return parseISO(dateString);
    } catch (e) {
      console.warn('Не удалось распознать дату:', dateString);
      return new Date(dateString);
    }
  };

  const getFilteredData = useMemo(() => {
    if (entriesLoading || projectsLoading) return { pieData: null, barData: null };

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
        end = addDays(start, 29);
        break;
      default:
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
    }

    let debugText = `Выбранный период: ${timeRange}\n`;
    debugText += `Диапазон: ${format(start, 'yyyy-MM-dd')} - ${format(end, 'yyyy-MM-dd')}\n`;
    debugText += `Всего записей: ${entries.length}\n`;

    const filteredEntries = entries.filter(entry => {
      const entryDate = parseDate(entry.date);
      const isValid = entry.projectId && entry.duration > 0;
      const isInRange = isWithinInterval(entryDate, { start, end });
      
      debugText += `Запись ${entry.id || '?'} (${format(entryDate, 'yyyy-MM-dd')}): ${isValid ? 'valid' : 'invalid'}, ${isInRange ? 'in range' : 'out of range'}\n`;
      
      return isValid && isInRange;
    });

    debugText += `Отфильтровано записей: ${filteredEntries.length}\n`;

    const projectsData = projects.reduce((acc, project) => {
      acc[project.id] = {
        name: project.name || `Проект ${project.id}`,
        color: project.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
        totalSeconds: 0
      };
      return acc;
    }, {});

    filteredEntries.forEach(entry => {
      if (projectsData[entry.projectId]) {
        projectsData[entry.projectId].totalSeconds += entry.duration;
      }
    });

    const chartData = Object.values(projectsData)
      .filter(project => project.totalSeconds > 0)
      .map(project => ({
        ...project,
        hours: (project.totalSeconds / 3600).toFixed(1)
      }));

    debugText += `Проектов с данными: ${chartData.length}\n`;
    setDebugInfo(debugText);

    if (chartData.length === 0) {
      return {
        pieData: {
          labels: ['Нет данных'],
          datasets: [{
            data: [1],
            backgroundColor: ['#eeeeee']
          }]
        },
        barData: {
          labels: ['Нет данных'],
          datasets: [{
            data: [0],
            backgroundColor: ['#eeeeee']
          }]
        }
      };
    }

    return {
      pieData: {
        labels: chartData.map(p => p.name),
        datasets: [{
          data: chartData.map(p => p.totalSeconds),
          backgroundColor: chartData.map(p => p.color),
          borderWidth: 1
        }]
      },
      barData: {
        labels: chartData.map(p => p.name),
        datasets: [{
          label: 'Часы работы',
          data: chartData.map(p => parseFloat(p.hours)),
          backgroundColor: chartData.map(p => p.color),
          borderWidth: 1
        }]
      }
    };
  }, [entries, projects, timeRange, entriesLoading, projectsLoading]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 16,
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label || ''}: ${context.raw} ${context.datasetIndex === 0 ? 'сек' : 'ч'}`;
          }
        }
      }
    }
  };

  if (entriesLoading || projectsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4">Аналитика</Typography>
        
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={(_, newRange) => setTimeRange(newRange)}
          color="primary"
          size="small"
        >
          <ToggleButton value="day">День</ToggleButton>
          <ToggleButton value="week">Неделя</ToggleButton>
          <ToggleButton value="month">Месяц</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        mb: 3, 
        borderRadius: 1,
        maxHeight: 200,
        overflow: 'auto',
        display: 'none'
      }}>
        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {debugInfo}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3,
        mb: 3
      }}>
        <Paper sx={{ flex: 1, p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom align="center">
            Распределение времени
          </Typography>
          {getFilteredData.pieData && (
            <Pie 
              data={getFilteredData.pieData} 
              options={chartOptions} 
            />
          )}
        </Paper>

        <Paper sx={{ flex: 1, p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom align="center">
            Часы по проектам
          </Typography>
          {getFilteredData.barData && (
            <Bar 
              data={getFilteredData.barData} 
              options={{
                ...chartOptions,
                scales: {
                  y: { beginAtZero: true },
                  x: { grid: { display: false } }
                }
              }} 
            />
          )}
        </Paper>
      </Box>
      <RecentTimeEntries />
    </Box>
  );
};

export default AnalyticsPage;