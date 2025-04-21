import React, { useState, useEffect } from 'react';
import {
  Typography, 
  Box, 
  Paper, 
  Select, 
  MenuItem, 
  TextField, 
  FormControl, 
  InputLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { saveTimeEntry } from '../../store/slices/timeEntriesSlice';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pauseTime, setPauseTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  
  const dispatch = useDispatch();
  const { items: projects = [] } = useSelector(state => state.projects || {});
  const { user } = useSelector(state => state.auth || {});

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handleStart = () => {
    if (!selectedProject) return;
    
    setStartTime(Date.now());
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isPaused) {
      const pauseDuration = Math.floor((Date.now() - pauseTime) / 1000);
      setPausedDuration(prev => prev + pauseDuration);
      setIsPaused(false);
    } else {
      setPauseTime(Date.now());
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!isRunning) return;
    
    const entry = {
      userId: user?.id,
      projectId: selectedProject,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: duration,
      pausedDuration: pausedDuration,
      description
    };
    dispatch(saveTimeEntry(entry));
    
    resetTimer();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setDuration(0);
    setPausedDuration(0);
    setDescription('');
    setSelectedProject('');
    setStartTime(null);
    setPauseTime(null);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Box sx={{ gap: 2 }}>
            <Typography variant="h4" align="center" sx={{ mb: 2 }}>
              {formatTime(duration)}
            </Typography>
            
            {isRunning && (
              <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                {isPaused ? 'На паузе' : 'Запись времени...'}
              </Typography>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2,
            mb: 2,
            height: 42
          }}>
            {!isRunning ? (
              <Tooltip title="Старт">
                <IconButton
                  color="primary"
                  onClick={handleStart}
                  disabled={!selectedProject}
                  size="large"
                >
                  <PlayArrow fontSize="large" />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Tooltip title={isPaused ? "Продолжить" : "Пауза"}>
                  <IconButton
                    color={isPaused ? "primary" : "secondary"}
                    onClick={handlePause}
                    size="large"
                  >
                    <Pause fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Стоп">
                  <IconButton
                    color="error"
                    onClick={handleStop}
                    size="large"
                  >
                    <Stop fontSize="large" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Проект</InputLabel>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Проект"
            disabled={isRunning}
          >
            {projects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <TextField
        label="Описание работы"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        disabled={isRunning}
      />
    </Paper>
  );
}